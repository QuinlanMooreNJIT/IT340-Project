import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ListingService } from '../services/listing.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./home.component.css'],
  templateUrl: './home.component.html'
})

export class HomeComponent implements OnInit {

  listings: any[] = [];
  
  newListing = {
    title: '',
    description: '',
    price: null,
    category: 'instrument'
  };

  constructor(
    public auth: AuthService, 
    private router: Router,
    private listingService: ListingService
  ) {}
  
  ngOnInit(): void {
    this.loadListings();
  }
  
  loadListings() {
    this.listingService.getListings().subscribe({
      next: (data) => {
        this.listings = data;
      },
      error: (err) => {
        console.error('Error loading listings', err);
      }
    });
  }
  
  createListing() {
    this.listingService.createListing(this.newListing).subscribe({
      next: () => {
        this.newListing = {
        title: '',
        description: '',
        price: null,
        category: 'instrument'
        };
        
        this.loadListings();
      },
      error: (err) => {
        console.error('Error creating listing', err);
      }
    });
  }
  
  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
