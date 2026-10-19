// Account service for Testify.
// Handles logging in, registering, logging out, and knowing who is signed in.
import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { environment } from '../environments/environment';

// The name the token is saved under in the browser.
const TOKEN_KEY = 'testify_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  // The saved token. A signal, so the navigation bar updates when it changes.
  private token = signal<string | null>(localStorage.getItem(TOKEN_KEY));

  // The middle part of the token, which holds the name, role, and expiry.
  private payload = computed(() => {
    const token = this.token();
    if (!token) {
      return null;
    }
    try {
      // The middle part uses - and _ in place of + and /, so swap them back before decoding.
      const middle = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(middle)) as { name?: string; role?: string; exp?: number };
    } catch {
      // The token is broken, so treat it as no token.
      return null;
    }
  });

  // True when a token exists and has not expired.
  // The expiry is in seconds, so it is multiplied by 1000 to compare with the time in milliseconds.
  isLoggedIn = computed(() => {
    const data = this.payload();
    return !!data && !!data.exp && data.exp * 1000 > Date.now();
  });

  // True when the signed in user is an admin.
  isAdmin = computed(() => this.isLoggedIn() && this.payload()?.role === 'admin');

  // The signed in user's name, or an empty string.
  name = computed(() => this.payload()?.name ?? '');

  // Returns the saved token. The interceptor adds it to every request.
  getToken(): string | null {
    return this.token();
  }

  // Saves a token in the browser and in the signal.
  private save(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
    this.token.set(token);
  }

  // POST: /api/login, then saves the token that comes back.
  login(email: string, password: string) {
    return this.http
      .post<{ token: string }>(`${environment.apiUrl}/login`, { email, password })
      .pipe(tap((res) => this.save(res.token)));
  }

  // POST: /api/register, then saves the token that comes back.
  register(name: string, email: string, password: string) {
    return this.http
      .post<{ token: string }>(`${environment.apiUrl}/register`, { name, email, password })
      .pipe(tap((res) => this.save(res.token)));
  }

  // Signs the user out by removing the saved token.
  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.token.set(null);
  }
}
