import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: '/login.html',
})

export class LoginComponent { 
  username = '';
  password = '';
  message = '';
  
  constructor(private auth: AuthService, private router: Router) {}
  
  login() {
    this.auth.login(this.username, this.password).subscrube({
      next: (res: any) => {
        locatlStorage.setItem('token', res.token);
        this.router.navigate(['/home']);
      },
      error: () => {
        this.message = "Invalid Credentials";
      }
    });
  }
}
