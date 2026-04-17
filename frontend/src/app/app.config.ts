import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';

import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
    withInterceptors([
      (req, next) => {
        const token = localStorage.getItem('token');
        
        if(token) {
          const cloned = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
          });
          return next(cloned);
        }
        return next(req);
      }
    ])
    ),
    provideRouter(routes), 
    importProvidersFrom(FormsModule)
  ]
};
