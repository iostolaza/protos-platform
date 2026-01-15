import { CanActivateFn, UrlTree } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { getCurrentUser } from 'aws-amplify/auth';
import { catchError, map, from, of } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  return from(getCurrentUser()).pipe(
    map(() => true),
    catchError(() => of(router.createUrlTree(['/sign-in'])))
  );
};

export const noAuthGuard: CanActivateFn = () => {
  const router = inject(Router);
  return from(getCurrentUser()).pipe(
    map(() => router.createUrlTree(['/main-layout/home'])),
    catchError(() => of(true))
  );
};
