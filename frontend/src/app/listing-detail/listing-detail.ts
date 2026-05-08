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
  cartMessage = '';
  
  constructor(
    private route: ActivatedRoute,
    private listingService: ListingService,
    private commentService: CommentService,
    private cartService: CartService,
    public auth: AuthService,
    private cdr: ChangeDetectorRef
  ) {}
  loading: boolean = true;
  
  ngOnInit(): void {
    
    console.log("LISTING DETAIL INIT");
  
    this.route.paramMap
      .pipe(
        switchMap(params => {
        
          const id = params.get('id');
          
          console.log("ROUTE PARAM ID:", id);
          
          if (!id) throw new Error('No ID');
          
          return this.listingService.getListingById(id);
        })
      )
      .subscribe({
      
        next: (data) => {
        
          console.log("LISTING LOADED:", data);
        
          this.listing = data;
          
          this.loading = false;
          
          this.cdr.detectChanges();
          
          this.loadComments();
        },
        error: (err) => {
        
          console.error("LISTING ERROR:", err);
        
          this.loading = false;
        }
      });
  }
  
  loadComments(): void {
  
    console.log("loadComments CALLED");
  
    if(!this.listing?._id) {
      console.log("NO LISTING ID FOR COMMENTS");
      return;
    }
    
    this.commentService.getComments(this.listing?._id).subscribe({
    
      next: (data) => {
      
        console.log("COMMENTS LOADED:", data);
      
        this.comments = data;
      },
      
      error: (err) => {
      
        console.error('COMMENTS ERROR:', err);
      }
    });
  }
  
  submitComment(): void {
  
    if (!this.newComment.trim()) return;
    
    this.commentService.addComment(
      this.listing?._id,
      this.newComment
    ).subscribe({
    
      next: () => {
      
        console.log("COMMENT POSTED");
      
        this.newComment = '';
        
        this.loadComments();
      },
      error: (err) => {
      
        console.error('ERROR POST COMMENT', err);
      }
    });
  }
  
  addToCart(): void {
  
    console.log("addToCart CLICKED");
  
    if (!this.listing?._id || this.isAddingToCart) {
      console.log("addToCart BLOCKED");
      return;
    }
    
    this.isAddingToCart = true;
    
    this.cartMessage = '';
    
    this.cartService.addToCart(this.listing?._id).subscribe({
    
      next: (res) => {
      
        console.log("ADD TO CART SUCCESS:", res);
      
        this.cartMessage = 'Item added to cart';
        
        this.isAddingToCart = false;
      },
      error: (err) => {
      
        console.error("ADD TO CART ERROR:", err);
        
        this.cartMessage = 
          err.error.message || 'Error adding to cart';
          
        this.isAddingToCart = false;
      }
    });
  }
}
