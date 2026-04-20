import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  styleUrls: ['./register.component.css'],
  templateUrl: '/register.component.html'
})

export class RegisterComponent { 
  username = '';
  password = '';
  message = '';
  
  constructor(private auth: AuthService, private router: Router) {} 
  register() {
  console.log("REGISTER CLICKED");
  console.log("USERNAME:", this.username);
  console.log("PASSWORD:", this.password);
    this.auth.register(this.username, this.password).subscribe ({
      next: (res) => {
      console.log("REGISTER SUCCESS: ", res);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.log("REGISTER ERROR FULL:", err);
        console.log("STATUS:", err.status);
        console.log("BODY:", err.error);
        }
    });
  }
}


