import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-results.html',
  styleUrl: './my-results.css'
})
export class MyResults {
  results = [
    { title: 'JavaScript Fundamentals', score: '90%', date: '2026-10-01' },
    { title: 'Angular Architecture', score: '85%', date: '2026-10-05' }
  ];
}
