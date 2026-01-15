import { defineAuth } from '@aws-amplify/backend';
import { postConfirmation } from './post-confirmation/resource';

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
  triggers: { postConfirmation },
  multifactor: {
    mode: 'OPTIONAL',
    totp: true
  }
});
