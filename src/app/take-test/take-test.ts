// Take-test page for Testify.
// Shows the questions, sends the answers, and shows the result.
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AttemptResult, TestDetail, TestService } from '../test.service';

@Component({
  selector: 'app-take-test',
  imports: [RouterLink],
  templateUrl: './take-test.html',
  styleUrl: './take-test.css'
})
export class TakeTest {
  private api = inject(TestService);
  private route = inject(ActivatedRoute);
  private testId = this.route.snapshot.paramMap.get('id') ?? '';

  test = signal<TestDetail | null>(null);
  // The chosen choice for each question, in order. null means not answered yet.
  answers = signal<(number | null)[]>([]);
  result = signal<AttemptResult | null>(null);
  loading = signal(true);
  busy = signal(false);
  error = signal('');

  // True when every question has an answer.
  allAnswered = computed(() => this.answers().length > 0 && this.answers().every((a) => a !== null));

  // Loads the test when the page opens.
  constructor() {
    this.api.getTest(this.testId).subscribe({
      next: (test) => {
        this.test.set(test);
        // Start with every question unanswered.
        this.answers.set(test.questions.map(() => null));
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message ?? 'Could not load the test');
        this.loading.set(false);
      }
    });
  }

  // Saves the choice picked for one question.
  choose(questionIndex: number, choiceIndex: number): void {
    this.answers.update((list) => list.map((value, i) => (i === questionIndex ? choiceIndex : value)));
  }

  // Sends the answers to the backend, which does the scoring.
  submit(): void {
    this.error.set('');
    this.busy.set(true);
    this.api.submitAttempt(this.testId, this.answers() as number[]).subscribe({
      next: (result) => {
        this.result.set(result);
        this.busy.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message ?? 'Could not submit the test');
        this.busy.set(false);
      }
    });
  }
}
