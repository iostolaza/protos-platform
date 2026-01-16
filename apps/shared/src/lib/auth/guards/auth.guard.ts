import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { getCurrentUser } from 'aws-amplify/auth';

export const authGuard: CanActivateFn = async () => {
  const router = inject(Router);
  try {
    await getCurrentUser();
    return true;
  } catch {
    return router.parseUrl('/sign-in');
  }
};
