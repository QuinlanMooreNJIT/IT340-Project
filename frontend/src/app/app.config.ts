import {ApplicationConfig } from '@angular/core';
import {provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { AppRoutes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';


export const appConfig: ApplicationConfig = {
  providers: [
  provideHttpClient(),
    provideBrowserGlobalErrorListeners(),
    provideRouter(AppRoutes), provideClientHydration(withEventReplay())
  ]
};
