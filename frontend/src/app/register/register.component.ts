import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: '/register.component.html'
})

export class RegisterComponent { 
  username = '';
  password = '';
  message = '';
  
  constructor(private auth: AuthService, private router: Router) {} 
  register() {
    this.auth.register(this.username, this.password).subscribe ({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: () => {
        this.message = 'Error Creating account';
        }
    });
  }
}


