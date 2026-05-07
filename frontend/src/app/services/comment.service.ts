import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private apiUrl = 'http://192.168.10.20:3000/comments';
  
  constructor(private http: HttpClient) {}
  
  getComments(listingId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${listingId}`);
  }
  
  addComment(listingId: string, content: string): Observable<any> {
    const token = localStorage.getItem('token');
    
    console.log("TOKEN:", token);
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    
    return this.http.post(
      this.apiUrl,
      { listingId, content },
      { headers }
    );
  }
}
