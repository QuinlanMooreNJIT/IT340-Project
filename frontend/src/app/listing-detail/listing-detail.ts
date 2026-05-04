import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ListingService } from '../services/listing.service';

@Component({
  selector: 'app-listing-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listing-detail.html',
  styleUrl: './listing-detail.css',
})
export class ListingDetail implements OnInit {

  listing: any;
  
  constructor(
    private route: ActivatedRoute,
    private listingService: ListingService,
    private cdr: ChangeDetectorRef
  ) {}
  
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
  
    if (!id) return;
    
    this.listingService.getListingById(id).subscribe({
      next: (data) => {
        this.listing = data;
        
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading listing:', err);
      }
    });    
  }
}
