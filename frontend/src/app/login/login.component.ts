import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.services';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: '/login.html',
})

export class LoginComponent { 
  username = '';
  password = '';
  message = '';
  
  constructor(private auth: AuthService, private router: Router) {}
  
  login() {
    this.auth.login(this.username, this.password).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token);
        this.router.navigate(['/home']);
      },
      error: () => {
        this.message = "Invalid Credentials";
      }
    });
  }
}
