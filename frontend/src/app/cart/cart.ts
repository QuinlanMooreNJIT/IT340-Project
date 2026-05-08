import { Component, OnInit } from '@angular/core';
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
  
  constructor(private cartService: CartService) {}
  
  ngOnInit(): void {
    this.getCart();
  }
  
  getCart() {
    this.loading = true;
    
    this.cartService.getCart().subscribe({
      next: (res: any) => {
        this.cartItems = res.listings || [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        alert('Failed to load cart')
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
