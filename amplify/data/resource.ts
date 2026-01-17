import { a, defineData, type ClientSchema } from '@aws-amplify/backend';

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
  ]),

  PaymentMethod: a.model({
    userCognitoId: a.string().required(),
    type: a.string().required(),
    name: a.string().required(),
    createdAt: a.datetime(),
    updatedAt: a.datetime(),
  })
    .secondaryIndexes(index => [index("userCognitoId")])
    .authorization(allow => [allow.ownerDefinedIn("userCognitoId").identityClaim("sub")]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool'
  }
});
