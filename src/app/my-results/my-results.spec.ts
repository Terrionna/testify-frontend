// Tests for the my-results page.
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { MyResults } from './my-results';
import { environment } from '../../environments/environment';

describe('MyResults', () => {
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MyResults],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()]
    });
    http = TestBed.inject(HttpTestingController);
  });

  it('shows attempts and certificates', async () => {
    const fixture = TestBed.createComponent(MyResults);
    http.expectOne(`${environment.apiUrl}/attempts/mine`).flush([
      { _id: 'a1', test: { _id: 't1', title: 'Secure Coding Basics' }, testVersion: 1, score: 80, passed: true, takenAt: '2026-10-01T12:00:00Z' }
    ]);
    http.expectOne(`${environment.apiUrl}/certificates/mine`).flush([
      { _id: 'c1', test: { _id: 't1', title: 'Secure Coding Basics' }, testVersion: 1, code: 'abc123', issuedAt: '2026-10-01T12:00:00Z' }
    ]);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('80%');
    expect(el.textContent).toContain('Passed');
    expect(el.textContent).toContain('abc123');
  });

  it('builds a LinkedIn Add to Profile address with the certificate details', () => {
    const fixture = TestBed.createComponent(MyResults);
    http.expectOne(`${environment.apiUrl}/attempts/mine`).flush([]);
    http.expectOne(`${environment.apiUrl}/certificates/mine`).flush([]);
    const url = new URL(
      fixture.componentInstance.linkedInUrl({
        _id: 'c1',
        test: { _id: 't1', title: 'Secure Coding Basics' },
        testVersion: 1,
        code: 'abc123',
        issuedAt: '2026-10-15T12:00:00Z'
      })
    );
    expect(url.origin + url.pathname).toBe('https://www.linkedin.com/profile/add');
    expect(url.searchParams.get('startTask')).toBe('CERTIFICATION_NAME');
    expect(url.searchParams.get('name')).toBe('Secure Coding Basics');
    expect(url.searchParams.get('certId')).toBe('abc123');
    expect(url.searchParams.get('certUrl')).toContain('/verify-certificate/abc123');
    expect(url.searchParams.get('issueYear')).toBe('2026');
    expect(url.searchParams.get('issueMonth')).toBe('10');
  });
});
