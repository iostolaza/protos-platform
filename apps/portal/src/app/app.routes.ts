import { Routes } from '@angular/router';
import { authGuard, noAuthGuard } from '@shared';
import { SignInComponent, MainLayoutComponent } from '@shared';

export const routes: Routes = [
  { path: '', redirectTo: 'sign-in', pathMatch: 'full' },
  { path: 'sign-in', component: SignInComponent, canActivate: [noAuthGuard] },
  {
    path: 'main-layout',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'home', loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent) },
      { path: 'settings', loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent) },
      { path: 'logout', component: SignInComponent }
    ]
  },
  { path: '**', redirectTo: 'sign-in' }
];
