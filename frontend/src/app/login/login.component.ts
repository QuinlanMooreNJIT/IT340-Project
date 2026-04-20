import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: `./login.component.html`,
})

export class LoginComponent { 
  username = '';
  password = '';
  message = '';
  
  constructor(private auth: AuthService, private router: Router) {}
  
  login() {
  console.log("LOGIN FUNCTION FIRED");
  console.log("USERNAME:", this.username);
  console.log("PASSWORD:", this.password);  
    this.auth.login(this.username, this.password).subscribe({
      next: (res: any) => {
      console.log("LOGIN SUCCESS:", res);
        
        this.router.navigate(['/home']);
      },
      error: (err) => {
      console.log("LOGIN ERROR:", err);
        this.message = "Invalid Credentials";
      }
    });
  }
}
