import { Injectable } from '@angular/core';
import { generateClient } from 'aws-amplify/data';

const client = generateClient();

@Injectable({ providedIn: 'root' })
export class AdminService {
  async inviteUser(data: {
    email: string;
    firstName: string;
    lastName: string;
    role: 'Admin' | 'Manager' | 'Facilities' | 'Tenant';
    applicationType?: 'Tenant' | 'Employee';
  }) {
    const { errors } = await client.mutations.adminInviteUser({
      ...data,
      applicationType: data.applicationType ?? 'Employee',
    });
    if (errors) throw errors;
  }

  async listUsers() {
    const { data } = await client.models['User'].list({});
    return data ?? [];
  }

  async listGroups(): Promise<string[]> {
    const { data } = await client.queries.adminListGroups();
    return (data ?? []).filter((g): g is string => typeof g === 'string');
  }

  async addUserToGroup(email: string, groupName: string) {
    await client.mutations.adminAddUserToGroup({ email, groupName });
  }

  async removeUserFromGroup(email: string, groupName: string) {
    await client.mutations.adminRemoveUserFromGroup({ email, groupName });
  }

  async getUserGroups(email: string): Promise<string[]> {
    const groups = await this.listGroups();
    const userGroups: string[] = [];

    for (const group of groups) {
      const { data } = await client.queries.adminListUsersInGroup({ groupName: group });
      const users = data ?? [];
      if (Array.isArray(users) && users.some((u: any) => u?.email === email)) {
        userGroups.push(group);
      }
    }
    return userGroups;
  }
}
