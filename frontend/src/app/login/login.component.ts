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
  
  mfaRequired = false;
  userIdFromMfa: string | null = null;
  
  constructor(private auth: authService, private router: Router) {}
  
  login() {
  
    this.authService.login(this.username, this.password)
      .subscribe((res: any) =>{
      
      if (res.mfaRequired) {
        this.mfaRequired = true;
        this.userIdFromMfa = res.userId;
        return;
      }
      
      this.handleLoginSuccess(res)
    });
  }
  
  verifyOtp() {
  
    if (!this.userIdFromMfa) return;
    
    this.authService.verifyMfa({
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
    
    this.authService.setToken(res.token);
    this.authService.setUser(res.user);
    
    console.log('LOGIN COMPLETE:', res.user);
  }
}
