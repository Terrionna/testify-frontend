import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.css'
})
export class SignIn {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private http: HttpClient, private router: Router) { }

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }

    this.http.post<any>('/api/auth/login', { email: this.email, password: this.password })
      .subscribe({
        next: (response) => {
          if (response && response.token) {
            localStorage.setItem('token', response.token);
          }
          this.router.navigate(['/test-list']);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Sign in failed. Please check your credentials.';
        }
      });
  }
}
