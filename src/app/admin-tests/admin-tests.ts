// Admin page for Testify.
// Lists every test, creates drafts, publishes, makes new versions, deletes drafts, and shows stats.
import { Component, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { NewTest, Stats, TestService, TestSummary } from '../test.service';

// One question in the new test form. The choices are one text box with one choice per line.
interface QuestionForm {
  text: string;
  choices: string;
  // The number of the correct choice, counting from 1 as a person would.
  answer: number;
}

@Component({
  selector: 'app-admin-tests',
  templateUrl: './admin-tests.html',
  styleUrl: './admin-tests.css'
})
export class AdminTests {
  private api = inject(TestService);

  tests = signal<TestSummary[]>([]);
  stats = signal<Stats | null>(null);
  showForm = signal(false);
  questions = signal<QuestionForm[]>([{ text: '', choices: '', answer: 1 }]);
  error = signal('');
  busy = signal(false);

  // Loads the tests and the stats when the page opens.
  constructor() {
    this.reload();
  }

  // Loads both lists again from the backend.
  reload(): void {
    this.api.adminListTests().subscribe({
      next: (tests) => this.tests.set(tests),
      error: (err) => this.error.set(err.error?.message ?? 'Could not load the tests')
    });
    this.api.adminStats().subscribe({
      next: (stats) => this.stats.set(stats),
      error: (err) => this.error.set(err.error?.message ?? 'Could not load the stats')
    });
  }

  // Shows or hides the new test form.
  toggleForm(): void {
    this.showForm.update((open) => !open);
  }

  // Adds an empty question to the form.
  addQuestion(): void {
    this.questions.update((list) => [...list, { text: '', choices: '', answer: 1 }]);
  }

  // Removes one question from the form.
  removeQuestion(index: number): void {
    this.questions.update((list) => list.filter((_, i) => i !== index));
  }

  // Saves what was typed in one box of one question.
  setField(index: number, field: keyof QuestionForm, event: Event): void {
    const value = (event.target as HTMLInputElement | HTMLTextAreaElement).value;
    this.questions.update((list) =>
      list.map((q, i) => (i === index ? { ...q, [field]: field === 'answer' ? Number(value) : value } : q))
    );
  }

  // Builds the test from the form and sends it to the backend as a draft.
  save(event: Event, title: string, passingScore: string, version: string): void {
    // Stop the browser from reloading the page.
    event.preventDefault();
    this.error.set('');

    const body: NewTest = {
      title,
      passingScore: Number(passingScore),
      version: Number(version),
      questions: this.questions().map((q) => ({
        text: q.text,
        // One choice per line. Empty lines are dropped.
        choices: q.choices.split('\n').map((line) => line.trim()).filter((line) => line),
        // The backend counts from 0, so subtract 1.
        answer: q.answer - 1
      }))
    };

    this.busy.set(true);
    this.api.adminCreateTest(body).subscribe({
      next: () => {
        this.busy.set(false);
        this.showForm.set(false);
        this.questions.set([{ text: '', choices: '', answer: 1 }]);
        this.reload();
      },
      error: (err) => {
        this.error.set(err.error?.message ?? 'Could not save the test');
        this.busy.set(false);
      }
    });
  }

  // Publishes a draft.
  publish(id: string): void {
    this.run(this.api.adminPublishTest(id));
  }

  // Copies a test into a new draft with the next version number.
  newVersion(id: string): void {
    this.run(this.api.adminNewVersion(id));
  }

  // Deletes a draft after the admin confirms.
  remove(id: string): void {
    if (window.confirm('Delete this draft?')) {
      this.run(this.api.adminDeleteTest(id));
    }
  }

  // Runs one admin request, then reloads the lists. Shows the backend's message if it fails.
  private run(request: Observable<unknown>): void {
    this.error.set('');
    request.subscribe({
      next: () => this.reload(),
      error: (err) => this.error.set(err.error?.message ?? 'That did not work')
    });
  }
}
