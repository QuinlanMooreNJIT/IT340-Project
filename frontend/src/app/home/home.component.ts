import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ListingService } from '../services/listing.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./home.component.css'],
  templateUrl: './home.component.html'
})

export class HomeComponent implements OnInit {

  listings: any[] = [];

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
        this.listings = date;
      },
      error (err) => {
        console.error('Error loading listings', err);
      }
    });
  }
  
  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
