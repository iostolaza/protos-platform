// apps/admin/src/app/app.config.ts

import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http'; 
import { provideAnimations } from '@angular/platform-browser/animations'; 
import { provideAngularSvgIcon } from 'angular-svg-icon'; 
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    provideAngularSvgIcon()
  ]
};