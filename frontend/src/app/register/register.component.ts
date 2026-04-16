import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: '/register.html',
  standalone: true,
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
        this.message = 'Error Creating account';
    });
  }
}


