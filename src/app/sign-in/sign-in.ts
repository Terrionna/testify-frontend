// Sign-in page for Testify.
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-sign-in',
  imports: [RouterLink],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.css'
})
export class SignIn {
  private auth = inject(AuthService);
  private router = inject(Router);

  // The message shown under the form when sign-in fails.
  error = signal('');
  // True while the request is running, so the button cannot be pressed twice.
  busy = signal(false);

  // Sends the email and password to the backend.
  submit(event: Event, email: string, password: string): void {
    // Stop the browser from reloading the page.
    event.preventDefault();
    this.error.set('');
    this.busy.set(true);
    this.auth.login(email, password).subscribe({
      next: () => this.router.navigateByUrl('/test-list'),
      error: (err) => {
        // Show the backend's message, or a general one when the backend cannot be reached.
        this.error.set(err.error?.message ?? 'Could not reach the server');
        this.busy.set(false);
      }
    });
  }
}
