import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet, NavigationEnd } from '@angular/router';
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
  
  constructor(private router: Router) {
  
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          console.log("NAVIGATED TO:", event.urlAfterRedirects);
        }
      });
    }
  
    onSearch(): void {
    
    const query = this.searchQuery.trim();
    
    if (!query) return;
    
    this.router.navigate(['/search'],{
      queryParams: { q: query }
    });
    
    this.searchQuery = '';
  }
}
