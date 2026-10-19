// Tests for the sign-in page.
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { SignIn } from './sign-in';
import { environment } from '../../environments/environment';
import { makeToken } from '../testing-helpers';

describe('SignIn', () => {
  let http: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [SignIn],
      // The router needs a /test-list route to land on after sign-in.
      providers: [provideRouter([{ path: 'test-list', children: [] }]), provideHttpClient(), provideHttpClientTesting()]
    });
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => localStorage.clear());

  // Types into the form and sends it.
  const fillAndSubmit = async (email: string, password: string) => {
    const fixture = TestBed.createComponent(SignIn);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    (el.querySelector('input[type=email]') as HTMLInputElement).value = email;
    (el.querySelector('input[type=password]') as HTMLInputElement).value = password;
    el.querySelector('form')!.dispatchEvent(new Event('submit'));
    return { fixture, el };
  };

  it('sends the typed email and password to /login', async () => {
    await fillAndSubmit('sam@example.com', 'password123');
    const req = http.expectOne(`${environment.apiUrl}/login`);
    expect(req.request.body).toEqual({ email: 'sam@example.com', password: 'password123' });
  });

  it('goes to the test list after a good sign-in', async () => {
    const router = TestBed.inject(Router);
    const { fixture } = await fillAndSubmit('sam@example.com', 'password123');
    http.expectOne(`${environment.apiUrl}/login`).flush({ token: makeToken('taker', 3600) });
    await fixture.whenStable();
    expect(router.url).toBe('/test-list');
  });

  it('shows the backend message after a bad sign-in', async () => {
    const { fixture, el } = await fillAndSubmit('sam@example.com', 'wrong');
    http.expectOne(`${environment.apiUrl}/login`).flush(
      { message: 'Incorrect email or password' },
      { status: 401, statusText: 'Unauthorized' }
    );
    await fixture.whenStable();
    expect(el.textContent).toContain('Incorrect email or password');
  });
});
