import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ListingService } from '../services/listing.service';
import { CommentService } from '../services/comment.service';

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
  
  constructor(
    private route: ActivatedRoute,
    private listingService: ListingService,
    private commentService: CommentService,
    private cdr: ChangeDetectorRef
  ) {}
  
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
  
    if (!id) return;
    
    this.listingService.getListingById(id).subscribe({
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
}
