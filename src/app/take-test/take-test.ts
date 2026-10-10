import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-take-test',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './take-test.html',
  styleUrl: './take-test.css'
})
export class TakeTest implements OnInit {
  testId: string | null = null;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.testId = this.route.snapshot.paramMap.get('id');
  }
}
