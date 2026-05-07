import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterLink, 
    RouterOutlet,
    FormsModule
    ],
  templateUrl: './app.html',
})
export class AppComponent {
  
  searchQuery: string = '';
  
  constructor(private router: Router) {}
  
  onSearch(): void {
    
    const query = this.searchQuery.trim();
    
    if (!query) return;
    
    this.router.navigate(['/search'],{
      queryParams: { q: query }
    });
    
    this.searchQuery = '';
  }
}
