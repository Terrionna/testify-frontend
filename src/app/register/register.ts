// Register page for Testify.
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  imports: [RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  private auth = inject(AuthService);
  private router = inject(Router);

  // The message shown under the form when registering fails.
  error = signal('');
  // True while the request is running, so the button cannot be pressed twice.
  busy = signal(false);

  // Sends the name, email, and password to the backend.
  submit(event: Event, name: string, email: string, password: string): void {
    // Stop the browser from reloading the page.
    event.preventDefault();
    this.error.set('');
    this.busy.set(true);
    this.auth.register(name, email, password).subscribe({
      next: () => this.router.navigateByUrl('/test-list'),
      error: (err) => {
        this.error.set(err.error?.message ?? 'Could not reach the server');
        this.busy.set(false);
      }
    });
  }
}
