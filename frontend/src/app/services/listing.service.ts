import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ListingService {
  
  private apiUrl = 'http://192.168.10.20:3000/api/listings';
  
  constructor(private http: HttpClient) {}
  
  getListings(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
  
  getListingById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
  
  createListing(listing: any): Observable<any> {
    const token = localStorage.getItem('token');
    
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    
    return this.http.post(this.apiUrl, listing, { headers });
  }
}
