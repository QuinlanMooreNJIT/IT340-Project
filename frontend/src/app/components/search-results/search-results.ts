import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ListingService } from '../../services/listing.service';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './search-results.html',
  styleUrl: './search-results.css',
})
export class SearchResultsComponent implements OnInit {
  
  listings: any[] = [];
  query: string = '';
  
  constructor(
  private route: ActivatedRoute,
  private listingService: ListingService
  ) {}
  
  ngOnInit(): void {
    
    this.route.queryParams.subscribe(params => {
      
      this.query = params['q'] || '';
      
      if (this.query.trim() !== '') {
        
        this.listingService.searchListings(this.query)
          .subscribe({
            next: (data) => {
              this.listings = data;
            },
            error: (err) => {
              console.error('Search error:', err);
            }
          });
      }
    });
  }
}
