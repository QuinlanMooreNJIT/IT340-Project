import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  
  private API_URL = 'http://192.168.10.20:3000/cart';
  private cartCount = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCount.asObservable();
  
  setCount(count: number) {
    this.cartCount.next(count);
  }
  
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
