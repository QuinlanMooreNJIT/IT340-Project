import { Component, OnInit } from '@angular/core';
import { ApiService } from './api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  template: '<h1>{{ message }}</h1>'
})
export class AppComponent implements OnInit {
  message = 'Loading...';
  constructor(private api: ApiService) {}
  ngOnInit(): void {
    console.log('AppComponent initialized');
    this.api.getMessage().subscribe(
    data => {console.log('Data Recieved;', data); this.message = data; },
    err => { console.error('Error fetching data', err); this.message = 'Error'; }
    );
  }
}
