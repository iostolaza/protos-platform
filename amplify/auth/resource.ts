import { defineAuth } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: { email: true },
  groups: [
    'admin',
    'companyA_admin',
    'companyA_manager',
    'companyA_facilities',
    'companyA_user',
    'companyB_admin',
    'companyB_manager',
    'companyB_facilities',
    'companyB_user'
  ],
  multifactor: {
    mode: 'OPTIONAL',
    totp: true
  }
});
