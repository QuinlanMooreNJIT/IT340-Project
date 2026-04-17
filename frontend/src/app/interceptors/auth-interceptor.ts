import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';

import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  
  constructor(private: HttpRequest<any>, next: HttpHandler) {
  
  if(token) {
    const cloned = req.clone({
      setHeaders: {
        authorization: `Bearer ${token}`
      }
    });
    return next.handle(cloned);
  }
  return next.handle(req);
  }
}
