import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, RouterLink],
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
      }
    });
  }
}
