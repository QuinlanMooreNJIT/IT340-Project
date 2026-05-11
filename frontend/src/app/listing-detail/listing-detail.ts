import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
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
  
  loading: boolean = true;
  
  constructor(
    private route: ActivatedRoute,
    private listingService: ListingService,
    private commentService: CommentService,
    private cartService: CartService,
    private router: Router,
    public auth: AuthService,
    private cdr: ChangeDetectorRef
  ) {}
  
  ngOnInit(): void {
    
    console.log("LISTING DETAIL INIT");
  
    this.route.paramMap
      .pipe(
        switchMap(params => {
        
          const id = params.get('id');
          
          console.log("ROUTE PARAM EMITTED");
          console.log("ROUTE PARAM ID:", id);
          
          if (!id) {
            console.error("ROUTE MISSING ID");
            throw new Error('No ID');
          }
          
          console.log("HTTP calling getListingById");
          console.log("HTTP Request URL param:", id);
          
          
          return this.listingService.getListingById(id);
        })
      )
      .subscribe({
      
        next: (data) => {
        
          console.log("HTTP SUCCESS Listing received");
          console.log("HTTP RESPONSE", data);
        
          this.listing = data;
          
          console.log("STATE LISTING ASSIGNED:", this.listing);
          
          this.loading = false;
          
          console.log("STATE loading set to FALSE");
          
          this.cdr.detectChanges();
          
          console.log("CDR detectChanges Triggered");
          
          this.loadComments();
        },
        error: (err) => {
        
          console.error("HTTP ERROR Listing load failed");
          console.error("LISTING ERROR:", err);
        
          this.loading = false;
          
          console.log("STATE loading set to FALSE thru error");
        }
      });
  }
  
  canModify(resourceUserId: string): boolean {
    return this.auth.canModify(resourceUserId);
  }
  
  loadComments(): void {
  
    console.log("COMMENTS loadComments CALLED");
    
    console.log("COMMENTS current listing state:", this.listing);

    
    const id = this.listing?._id;
    
    console.log("COMMENTS extracted ID:", id);
  
    if(!id) {
    
      console.warn("COMMENTS NO LISTING ID - abort request");      
      return;
    }
    
    this.commentService.getComments(id).subscribe({
    
      next: (data) => {
      
        console.log("COMMENTS SUCCESS:", data);
      
        this.comments = data;
        
        console.log("STATE comments assigned", this.comments);
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
  
  editComment(comment: any) {
    
    const updated = prompt("Edit comment:", comment.content);
    
    if (!updated) return;
    
    this.commentService.updateComment(comment._id, {
      content: updated
    }).subscribe({
      next: (res: any) => {
        comment.content = res.comment.content;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
  
  deleteComment(id: string) {
      
      this.commentService.deleteComment(id).subscribe({
        next: () => {
          this.comments = this.comments.filter(c => c._id !== id);
        },
        error: (err) => {
          console.error(err);
        }
      });
  }
  
  editListing() {
    this.router.navigate(['/edit-listing', this.listing._id]);
  }
  
  deleteListing() {
    
    if (!this.listing?._id) return;
    
    this.listingService.deleteListing(this.listing._id).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
  
  addToCart(): void {
  
    console.log("CART addToCart CLICKED");
    
    console.log("CART LISING STATE:", this.listing);
    console.log("CART LISTING ID", this.listing?._id);
    
    if (!this.listing?._id || this.isAddingToCart) {
    
      console.warn("CART BLOCKED")
    
      console.log("CART isAddingToCart", this.isAddingToCart);
      
      return;
    }
    
    this.isAddingToCart = true;
    
    console.log("CART HTTP SENDING REQUEST");
    console.log("CART HTTP PAYLOAD", {
      listingId: this.listing._id
    });
    
    this.cartService.addToCart(this.listing?._id).subscribe({
    
      next: (res) => {
      
        console.log("CART SUCCESS", res);
      
        this.cartMessage = 'Item added to cart';
        
        this.isAddingToCart = false;
        
        console.log("CART STATE reset complete");
      },
      error: (err) => {
      
        console.error("CART ERROR", err);
        
        console.log("CART ERROR BODY", err.error);
        
        this.cartMessage = 
          err.error.message || 'Error adding to cart';
          
        this.isAddingToCart = false;
        
        console.log("CART STATE rest after error");
      }
    });
  }
}
