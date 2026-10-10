import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-test-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './test-list.html',
  styleUrl: './test-list.css'
})
export class TestList { }
