// Tests for authGuard and adminGuard.
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { authGuard, adminGuard } from './auth.guard';
import { makeToken, TOKEN_KEY } from './testing-helpers';

describe('route guards', () => {
  // Runs a guard the way the router does and returns where it sent the user, or true if it let them through.
  const run = (guard: typeof authGuard) => {
    const result = TestBed.runInInjectionContext(() => guard({} as never, {} as never));
    if (result === true) {
      return true;
    }
    // A redirect comes back as a URL object, so turn it into text to compare.
    return TestBed.inject(Router).serializeUrl(result as never);
  };

  // Before each test: empty the saved token and set up a router with no routes.
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClient()]
    });
  });

  afterEach(() => localStorage.clear());

  it('authGuard sends a signed out user to /sign-in', () => {
    expect(run(authGuard)).toBe('/sign-in');
  });

  it('authGuard lets a signed in user through', () => {
    localStorage.setItem(TOKEN_KEY, makeToken('taker', 3600));
    expect(run(authGuard)).toBe(true);
  });

  it('adminGuard sends a signed out user to /sign-in', () => {
    expect(run(adminGuard)).toBe('/sign-in');
  });

  it('adminGuard sends a taker to /test-list', () => {
    localStorage.setItem(TOKEN_KEY, makeToken('taker', 3600));
    expect(run(adminGuard)).toBe('/test-list');
  });

  it('adminGuard lets an admin through', () => {
    localStorage.setItem(TOKEN_KEY, makeToken('admin', 3600));
    expect(run(adminGuard)).toBe(true);
  });
});
