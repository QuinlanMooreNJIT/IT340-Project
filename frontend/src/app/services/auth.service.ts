import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable ({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://192.168.75.135:3000/api/auth';
  
  constructor(private http: HttpClient) {}
  
  register(username: string, password: string) {
    return this.http.post(`${this.baseUrl}/register`, {
      username,
      password
    });
  }
  
  login(username: string, password: string) {
    return this.http.post(`${this.baseUrl}/login`,{
    username,
    password
    });
  }
}
