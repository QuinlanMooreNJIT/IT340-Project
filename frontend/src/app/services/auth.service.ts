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
  
  register(username: string, email: string, password: string) {
    return this.http.post(`${this.baseUrl}/register`, {
      username,
      email,
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
        this.setMfaUser(res.userId);
        }
      })
    );
  }
  
  setMfaUser(userId: string) {
    if (this.isBrowser()) {
      localStorage.setItem('mfa_userId',userId);
    }
  }
  
  getMfaUser(): string | null {
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
      localStorage.setItem('token', token);
      localStorage.removeItem('mfa_userId');
    }
  }
  
  logout() {
  if (this.isBrowser()){
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('mfa_userId');
    }
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
  
  setUser(user: any) {
    if (this.isBrowser()) {
      localStorage.setItem('user', JSON.stringify(user))
    }
  }
  
  getUser(): any {
    if (!this.isBrowser()) return null;
    
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
  
  getUserId(): string | null {
    const user = this.getUser();
    return user ? user.userId: null;
  }
  
  getUserRole(): String | null {
  const user = this.getUser();
    return user ? user.role : null; 
  }
  
  isAdmin(): boolean {
    return this.getUserRole() === 'admin'
  }
  
  canModify(resourceUserId: string): boolean {
    const user = this.getUser();
    
    if (!user) return false;
    
    return user.role === 'admin' || user.userId === resourceUserId;
  }
  
  verifyMfa(data: {userId: string, otp: string}) {
    return this.http.post(
      'http://192.168.10.20:3000/api/mfa/verify',
      data
    );
  }
}
