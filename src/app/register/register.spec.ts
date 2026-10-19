// Tests for the register page.
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { Register } from './register';
import { environment } from '../../environments/environment';

describe('Register', () => {
  let http: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [Register],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()]
    });
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => localStorage.clear());

  it('sends the typed name, email, and password to /register', async () => {
    const fixture = TestBed.createComponent(Register);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    (el.querySelector('input[type=text]') as HTMLInputElement).value = 'Sam';
    (el.querySelector('input[type=email]') as HTMLInputElement).value = 'sam@example.com';
    (el.querySelector('input[type=password]') as HTMLInputElement).value = 'password123';
    el.querySelector('form')!.dispatchEvent(new Event('submit'));
    const req = http.expectOne(`${environment.apiUrl}/register`);
    expect(req.request.body).toEqual({ name: 'Sam', email: 'sam@example.com', password: 'password123' });
  });

  it('shows the backend message when the email is taken', async () => {
    const fixture = TestBed.createComponent(Register);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    el.querySelector('form')!.dispatchEvent(new Event('submit'));
    http.expectOne(`${environment.apiUrl}/register`).flush(
      { message: 'That record already exists' },
      { status: 409, statusText: 'Conflict' }
    );
    await fixture.whenStable();
    expect(el.textContent).toContain('That record already exists');
  });
});
