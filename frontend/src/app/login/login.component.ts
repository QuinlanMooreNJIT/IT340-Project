import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  styleUrls: ['./login.component.css'],
  templateUrl: `./login.component.html`
})

export class LoginComponent { 
  username = '';
  password = '';
  otp = '';
  message = '';
  
  mfaRequired = false;
  userIdFromMfa: string | null = null;
  
  constructor(private auth: AuthService, private router: Router) {}
  
  login() {
  
  this.auth.login(this.username, this.password)
    .subscribe({
    
      next: (res: any) => {
      
        if (res.mfaRequired) {
          
          this.message = "Check your email for verification code";
          
          localStorage.setItem('mfa_userId', res.userId);
          
          this.router.navigate(['/mfa-verify']);
          
          return;
        }
        
        this.message = "Unexpected login response (no MFA flag)";
        console.log("WARNING: No MFA flag returned", res);
      },
      
      error: (err) => {
        
        console.log("LOGIN ERROR:", err)
        
        this.message = "Invalid Credentials";
      }
    });
  }
  
  verifyOtp() {
  
    if (!this.userIdFromMfa) return;
    
    this.auth.verifyMfa({
      userId: this.userIdFromMfa,
      otp: this.otp
    }).subscribe((res: any) => {
      
      this.handleLoginSuccess(res);
      
      this.mfaRequired = false
      this.userIdFromMfa = null;
      this.otp = '';
    });
  }
  
  private handleLoginSuccess(res: any) {
    
    this.auth.setToken(res.token);
    this.auth.setUser(res.user);
    
    console.log('LOGIN COMPLETE:', res.user);
  }
}
