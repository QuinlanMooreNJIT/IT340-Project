import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class CartComponent implements OnInit {
  
  cartItems: any[] = [];
  loading = false;
  
  constructor(private cartService: CartService, private cdr: ChangeDetectorRef) {
    console.log("CART COMPONENT CONSTRUCTOR FIRED")
  }
  
  ngOnInit(): void {
    this.getCart();
  }
  
  getCart() {
    console.log("getCart() FIRED");
    
    this.loading = true;
    
    this.cartService.getCart().subscribe({
      next: (res: any) => {
        console.log("CART RESPONSE:", res);
        
        this.cartItems = res.listings || [];
        
        console.log("cartItems AFTER SET:", this.cartItems);
        
        console.log("SETTING loading FALSE");
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log("CART ERROR:", err);
        this.loading = false;
      }
    });
  }
  
  removeItem(listingId: string) {
    this.cartService.removeFromCart(listingId).subscribe({
      next: () => {
        this.getCart();
      }
    });
  }
  
  checkout() {
    this.cartService.checkout().subscribe({
      next: (res) => {
        alert('Purchase successful!');
        this.cartItems = [];
      },
      error: (err) => {
        alert(err.error.message || 'Checkout failed');
      }
    });
  }
}
