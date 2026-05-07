import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ListingService } from '../../services/listing.service';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.html',
  styleUrl: './search-results.css',
})
export class SearchResults implements OnInit {
  
  listings: any[] = [];
  query: string = '';
  
  constructor(
  private route: ActivatedRoute,
  private listingService: ListingService
  ) {}
  
  ngOnInit(): void {
    
    this.route.query.Params.subscribe(params => {
      
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
