import type { PostConfirmationTriggerHandler } from 'aws-lambda';
import { schema } from '../../data/resource';
import { generateClient } from 'aws-amplify/data';

const client = generateClient<typeof schema>({ authMode: 'iam' });

export const handler: PostConfirmationTriggerHandler = async (event) => {
  const sub = event.request.userAttributes.sub;
  const email = event.request.userAttributes.email;
  const firstName = event.request.userAttributes.given_name || '';
  const lastName = event.request.userAttributes.family_name || '';

  const { data: existing } = await client.models.User.get({ cognitoId: sub });
  if (existing) return event;

  const { errors } = await client.models.User.create({
    cognitoId: sub,
    email,
    firstName,
    lastName,
    username: event.userName || email.split('@')[0],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  if (errors) {
    console.error('Create user errors:', errors);
    throw new Error(`Failed to create user: ${errors.map((e: { message: string }) => e.message).join(', ')}`);
  }

  return event;
};
