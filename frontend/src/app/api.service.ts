import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'http://192.168.75.135:3000';
  
  constructor(private http: HttpClient) {}
  
  getMessage() {
    return this.http.get(this.apiUrl, { responseType: 'text' });
  }
}
