import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../services/auth.service';
import { ListingService } from '../services/listing.service';
import { CommentService } from '../services/comment.service';
import { CartService } from '../services/cart.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-listing-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './listing-detail.html',
  styleUrl: './listing-detail.css',
})
export class ListingDetail implements OnInit {

  listing: any;
  
  comments: any[] = [];
  newComment: string = '';
  isAddingToCart: boolean = false;
  
  constructor(
    private route: ActivatedRoute,
    private listingService: ListingService,
    private commentService: CommentService,
    private cartService: CartService,
    private cdr: ChangeDetectorRef,
    public auth: AuthService
  ) {}
  
  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap(params => {
          const id = params.get('id');
          if (!id) throw new Error('No ID');
          
          return this.listingService.getListingById(id);
        })
      )
      .subscribe({
        next: (data) => {
          this.listing = data;
          this.loadComments();
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error loading listing:', err);
        }
      });
  }
  loadComments(): void {
    if(!this.listing?._id) return;
    
    this.commentService.getComments(this.listing._id).subscribe({
      next: (data) => {
        this.comments = data;
      },
      error: (err) => {
        console.error('Error loading comments:', err);
      }
    });
  }
  
  submitComment(): void {
    if (!this.newComment.trim()) return;
    
    this.commentService.addComment(
      this.listing._id,
      this.newComment
    ).subscribe({
      next: () => {
        this.newComment = '';
        this.loadComments();
      },
      error: (err) => {
        console.error('Error posting comments:', err);
      }
    });
  }
  
  addToCart(): void {
    if (!this.listing?._id || this.isAddingToCart) return;
    
    this.isAddingToCart = true;
    
    this.cartService.addToCart(this.listing._id).subscribe({
      next: (res) => {
        alert('Item added to cart');
        this.isAddingToCart = false;
      },
      error: (err) => {
        alert(err.error.message || 'Error adding to cart');
        this.isAddingToCart = false;
      }
    });
  }
}
