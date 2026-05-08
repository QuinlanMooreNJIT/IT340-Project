import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  
  private API_URL = 'http://192.168.10.20:3000/cart';
  
  private cartCount = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCount.asObservable();
  
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}
  
  setCount(count: number) {
    this.cartCount.next(count);
  }
  
  addToCart(listingId: string): Observable<any> {
    console.log("addToCart called", listingId)
    return this.http.post(`${this.API_URL}/add`, { listingId });
  }
  
  getCart(): Observable<any> {
    
    console.log("CartService.getCart() CALLED");
    
    return this.http.get(`${this.API_URL}`).pipe(
      tap({
        next: (res) => {
          console.log("CART RESPONSE:", res);
        },
        error: (err) => {
          console.error("CART ERROR", err);
        }
      })
    );
  }
  
  removeFromCart(listingId: string): Observable<any> {
    console.log("removeFromCart called", listingId);
    return this.http.delete(`${this.API_URL}/${listingId}`);
  }
  
  checkout(): Observable<any> {
    console.log("checkout called");
    return this.http.post(`${this.API_URL}/checkout`, {});
  }
}
