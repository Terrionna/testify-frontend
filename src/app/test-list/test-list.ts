// Test list page for Testify.
// Shows every published test.
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TestService, TestSummary } from '../test.service';

@Component({
  selector: 'app-test-list',
  imports: [RouterLink],
  templateUrl: './test-list.html',
  styleUrl: './test-list.css'
})
export class TestList {
  private api = inject(TestService);

  tests = signal<TestSummary[]>([]);
  loading = signal(true);
  error = signal('');

  // Picks an emoji for a card from the words in the title.
  iconFor(title: string): string {
    const t = title.toLowerCase();
    if (t.includes('javascript')) return '\u26A1';
    if (t.includes('angular')) return '\uD83C\uDD70\uFE0F';
    if (t.includes('node') || t.includes('express') || t.includes('api')) return '\uD83D\uDE80';
    if (t.includes('secure') || t.includes('security')) return '\uD83D\uDD12';
    return '\uD83D\uDC19';
  }

  // Loads the tests when the page opens.
  constructor() {
    this.api.listTests().subscribe({
      next: (tests) => {
        this.tests.set(tests);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message ?? 'Could not load the tests');
        this.loading.set(false);
      }
    });
  }
}
