import { Injectable, signal, inject } from '@angular/core';
import { generateClient } from 'aws-amplify/data';
import { uploadData, getUrl } from 'aws-amplify/storage';
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';
import { Observable, Subject, from } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Hub } from 'aws-amplify/utils';
import { RoleService } from './role.service';

const client = generateClient();

export type UserProfile = any;

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public user = signal<UserProfile | null>(null);
  public allUsers = signal<any[]>([]);
  private destroy$ = new Subject<void>();

  private roleService = inject(RoleService);

  constructor() {
    this.setupAuthListener();
  }

  private setupAuthListener() {
    Hub.listen('auth', async ({ payload }) => {
      switch (payload.event) {
        case 'signedIn':
        case 'tokenRefresh':
          await this.loadCurrentUser();
          await this.roleService.refreshGroups();
          break;
        case 'signedOut':
          this.user.set(null);
          this.allUsers.set([]);
          break;
      }
    });

    (async () => {
      try {
        await fetchAuthSession();
        await this.loadCurrentUser();
        await this.roleService.refreshGroups();
      } catch {
        console.log('No initial user');
      }
    })();
  }

  async loadCurrentUser() {
    try {
      const { userId, signInDetails } = await getCurrentUser();
      const email = signInDetails?.loginId;

      const { data: userData, errors } = await client.models['User'].get({ cognitoId: userId });
      if (errors) throw new Error(errors.map((e: any) => e.message).join(', '));

      let user = userData;

      if (!user && email) {
        const { data: users } = await client.models['User'].listUserByEmail({ email });
        user = users[0];
      }

      if (!user && email) {
        const now = new Date().toISOString();
        const { errors } = await client.models['User'].create({
          cognitoId: userId,
          email,
          createdAt: now,
          updatedAt: now,
        });
        if (errors) throw new Error(errors.map((e: any) => e.message).join(', '));

        const { data: newUser } = await client.models['User'].get({ cognitoId: userId });
        user = newUser;
      }

      if (!user) return;

      const profileImageUrl = await this.getProfileImageUrlFromKey(user.profileImageKey);
      this.user.set({ ...user, profileImageUrl });

      client.models['User'].observeQuery({ filter: { cognitoId: { eq: userId } } })
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: async ({ items }) => {
            if (items[0]) await this.updateProfileFromItem(items[0]);
          },
          error: (err) => console.error('ObserveQuery error:', err),
        });
    } catch (error) {
      console.error('Load user error:', error);
    }
  }

  private async getProfileImageUrlFromKey(key: string | null | undefined): Promise<string | undefined> {
    if (!key) return undefined;
    const { url } = await getUrl({ path: key, options: { expiresIn: 3600 } });
    return url.toString();
  }

  private async updateProfileFromItem(item: any) {
    let profileImageUrl = this.user()?.profileImageUrl;
    const currentKey = this.user()?.profileImageKey;
    if (item.profileImageKey !== currentKey) {
      profileImageUrl = await this.getProfileImageUrlFromKey(item.profileImageKey);
    }
    this.user.set({ ...item, profileImageUrl });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
