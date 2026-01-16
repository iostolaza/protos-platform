import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { getCurrentUser } from 'aws-amplify/auth';

export const noAuthGuard: CanActivateFn = async () => {
  const router = inject(Router);
  try {
    await getCurrentUser();
    return router.parseUrl('/main-layout/home');
  } catch {
    return true;
  }
};
