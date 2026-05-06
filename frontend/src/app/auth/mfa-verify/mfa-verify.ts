import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-mfa-verify',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './mfa-verify.html',
  styleUrl: './mfa-verify.css',
})
export class MfaVerify {
  
  otp = '';
  message = '';
  
  constructor(
    private http: HttpClient,
    private router: Router,
    private auth: Authservice
  ) {}
  
  verifyOtp() {
    const userId = localStorage.getItem('mfa_userId');
    
    if(!userId) {
      this.message = "Session expired. Please login again.";
      this.router.navigate(['/login']);
      return;
    }
    
    this.http.post<any>('http://192.168.10.10/3000/api/mfa/verify', {
      userId,
      otp: this.otp
    }).subscribe({
      next: (res) => {
        
        console.log("MFA SUCCESS:", res);
        
        this.auth.setToken(res.token);
        
        localStorage.removeItem('mfa_userId');
        
        this.route.navigate(['/home']);
      },
      
      error: (err) => {
        console.log("MFA ERROR:", err);
        this.message = "Inaviled or expired code";
      }
    });
  }
}
