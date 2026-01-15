import { a, defineData } from '@aws-amplify/backend';

export const schema = a.schema({
  User: a.model({
    cognitoId: a.string().required(),
    email: a.email().required(),
    firstName: a.string(),
    lastName: a.string(),
    username: a.string(),
    profileImageKey: a.string(),
    createdAt: a.datetime(),
    updatedAt: a.datetime(),
    tenantId: a.string()  
  })
  .identifier(['cognitoId'])
  .authorization((allow) => [
    allow.owner().to(['read', 'update', 'delete']),
    allow.groups(['admin', 'companyA_admin', 'companyB_admin']).to(['read', 'create', 'update', 'delete'])
  ])
});

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool'
  }
});
