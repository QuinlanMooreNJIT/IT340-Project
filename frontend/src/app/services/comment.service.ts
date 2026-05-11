import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private apiUrl = 'http://192.168.10.20:3000/api/comments';
  
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
  
  updateComment(commentId: string, data: any): Observable<any> {
    
    const token = localStorage.getItem('token');
    
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    
    return this.http.put(
      `${this.apiUrl}/${commentId}`,
      data,
      { headers }
    );
  }
  
  deleteComment(commentId: string): Observable<any> {
    const token = localStorage.getItem('token');
    
    const headers = new HttpHeaders({
      Authorization: ` Bearer ${token}`
    });
    
    return this.http.delete(
      `${this.apiUrl}/${commentId}`,
      { headers }
    );
  }
}
