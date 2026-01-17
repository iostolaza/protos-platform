import { Injectable, signal, inject } from '@angular/core';
import { generateClient } from 'aws-amplify/data';
import { uploadData, getUrl } from 'aws-amplify/storage';
import type { Schema } from '../../../../../../amplify/data/resource'; 
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import { RoleService } from './role.service';

type UserType = Schema['User']['type'];
type PaymentMethodType = Schema['PaymentMethod']['type'];

export type UserProfile = UserType & { profileImageUrl?: string };

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private client = generateClient<Schema>();
  public user = signal<UserProfile | null>(null);
  public allUsers = signal<UserType[]>([]);
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

    this.loadCurrentUser().catch(() => console.log('No initial user'));
  }

  async load() {
    await this.loadCurrentUser();
  }

  private async loadCurrentUser() {
    try {
      const { userId } = await getCurrentUser();

      const { data: user, errors } = await this.client.models.User.get({ cognitoId: userId });
      if (errors) throw errors;

      if (!user) {
        const session = await fetchAuthSession();
        const email = session.tokens?.idToken?.payload['email'] as string || '';
        const now = new Date().toISOString();
        const { data: newUser, errors: createErrors } = await this.client.models.User.create({
          cognitoId: userId,
          email,
          createdAt: now,
          updatedAt: now,
        });
        if (createErrors) throw createErrors;
        this.user.set({ ...newUser, profileImageUrl: undefined } as UserProfile);
        return;
      }

      const profileImageUrl = user.profileImageKey ? await this.getProfileImageUrlFromKey(user.profileImageKey) : undefined;
      this.user.set({ ...user, profileImageUrl });
    } catch (error) {
      console.error('Load user error:', error);
    }
  }

  private async getProfileImageUrlFromKey(key: string): Promise<string> {
    const { url } = await getUrl({ path: key, options: { expiresIn: 3600 } });
    return url.toString();
  }

  async save(updated: Partial<UserProfile>) {
    const current = this.user();
    if (!current?.cognitoId) return;

    const { data: updatedUser, errors } = await this.client.models.User.update({
      cognitoId: current.cognitoId,
      ...updated,
      updatedAt: new Date().toISOString(),
    });
    if (errors) throw errors;

    const profileImageUrl = updatedUser?.profileImageKey ? await this.getProfileImageUrlFromKey(updatedUser.profileImageKey) : current.profileImageUrl;
    this.user.set({ ...updatedUser, profileImageUrl } as UserProfile);
  }

  async getAllUsers(): Promise<UserType[]> {
    const { data, errors } = await this.client.models.User.list({});
    if (errors) throw errors;
    this.allUsers.set(data);
    return data;
  }

  async uploadProfileImage(file: File): Promise<string> {
    const { userId } = await getCurrentUser();
    const result = await uploadData({
      path: ({ identityId }) => `protected/${identityId}/profile-pictures/${userId}/${file.name}`,
      data: file
    }).result;
    const key = result.path;
    await this.save({ profileImageKey: key });
    return key;
  }

  async getPaymentMethods(): Promise<PaymentMethodType[]> {
    const { userId } = await getCurrentUser();
    const { data, errors } = await this.client.models.PaymentMethod.list({
      filter: { userCognitoId: { eq: userId } }
    });
    if (errors) throw errors;
    return data;
  }

  async addPaymentMethod(type: string, name: string) {
    const { userId } = await getCurrentUser();
    const now = new Date().toISOString();
    const { errors } = await this.client.models.PaymentMethod.create({
      userCognitoId: userId,
      type,
      name,
      createdAt: now,
      updatedAt: now,
    });
    if (errors) throw errors;
  }

  async updatePaymentMethod(id: string, type: string, name: string) {
    const { errors } = await this.client.models.PaymentMethod.update({
      id,
      type,
      name,
      updatedAt: new Date().toISOString(),
    });
    if (errors) throw errors;
  }

  async deletePaymentMethod(id: string) {
    const { errors } = await this.client.models.PaymentMethod.delete({ id });
    if (errors) throw errors;
  }
}
