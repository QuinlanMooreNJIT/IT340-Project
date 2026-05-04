import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ListingService {
  
  private apiUrl = 'http://192.168.10.20:3000/api/listings';
  
  constructor(private http: HttpClient) {}
  
  //GET all listings
  getListings(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
  
  //GET single listing by ID
  getListingById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
  
  //CREATE new listing
  createListing(listing: any): Observable<any> {
    const token = localStorage.getItem('token');
    
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    
    return this.http.post<any>(this.apiUrl, listing, { headers });
  }
}
