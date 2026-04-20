import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
})

export class HomeComponent { 

  constructor(public auth: AuthService, private router: Router) {}
  
  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
