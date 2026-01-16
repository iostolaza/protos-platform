import { Injectable, signal, computed } from '@angular/core';
import { fetchAuthSession } from 'aws-amplify/auth';

@Injectable({ providedIn: 'root' })
export class RoleService {
  private groups = signal<string[]>([]);

  public isAdmin$ = computed(() => this.groups().includes('admin') || this.groups().some(g => g.endsWith('_admin')));
  public isManager$ = computed(() => this.groups().includes('companyA_manager') || this.groups().includes('companyB_manager'));
  public isTenant$ = computed(() => this.groups().includes('companyA_user') || this.groups().includes('companyB_user'));
  public isFacilities$ = computed(() => this.groups().includes('companyA_facilities') || this.groups().includes('companyB_facilities'));

  async refreshGroups(): Promise<void> {
    try {
      const session = await fetchAuthSession({ forceRefresh: true });
      const groups = (session.tokens?.idToken?.payload['cognito:groups'] as string[]) || [];
      this.groups.set(groups);
    } catch (err) {
      console.error('Failed to refresh groups', err);
      this.groups.set([]);
    }
  }

  getGroups(): string[] {
    return this.groups();
  }

  hasGroup(group: string): boolean {
    return this.groups().includes(group);
  }
}
