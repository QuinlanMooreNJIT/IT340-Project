import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/commn/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  
  private API_URL = 'http://192.168.10.20:3000/cart';
  
  constructor(private http: HttpClient) {}
  
  addToCart(listingId: string): Observable<any> {
    return this.http.post(`${this.API_URL}/add`, { listingId });
  }
  
  getCart(): Observable<any> {
    return this.http.get(`${this.API_URL}`);
  }
  
  removeFromCart(listingId: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/${listingId}`);
  }
  
  checkout(): Observable<any> {
    return this.http.post(`${this.API_URL}/checkout`, {});
  }
}
