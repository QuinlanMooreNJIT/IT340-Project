import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

@Injectable ({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://192.168.10.20:3000/api/auth';
  
  constructor(
  private http: HttpClient,
  @Inject(PLATFORM_ID) private platformId: Object
  ) {}
  
  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId)
  }
  
  register(username: string, password: string) {
    return this.http.post(`${this.baseUrl}/register`, {
      username,
      password
    });
  }
  
  login(username: string, password: string) {
    return this.http.post<any>(
    `${this.baseUrl}/login`,
    { username, password }
    ).pipe(
      tap((res) => {
      if (res.mfaRequired && this.isBrowser()) {
        localStorage.setItem('mfa_userId', res.userId);
        }
      })
    );
  }
  
  setMfaUser(): string | null {
    if (this.isBrowser()) {
      return localStorage.getItem('mfa_userId');
    }
    return null
  }
  
  clearMfaUser() {
    if (this.isBrowser()) {
      localStorage.removeItem('mfa_userId');
    }
  }
  
  setToken(token: string) {
    if (this.isBrowser()) {
      localStorage.removeItem('mfa_userId');
    }
  }
  
  logout() {
    localStorage.removeItem('token');
  }
  
  getToken(): string | null {
    if (this.isBrowser()) {
    return localStorage.getItem('token');
    }
    return null;
  }
  
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
