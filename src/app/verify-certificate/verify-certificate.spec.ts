// Tests for the verify page.
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { VerifyCertificate } from './verify-certificate';
import { environment } from '../../environments/environment';

describe('VerifyCertificate', () => {
  let http: HttpTestingController;

  // Sets up the page with a code in the address, or with none.
  const setup = (code: string | null) => {
    TestBed.configureTestingModule({
      imports: [VerifyCertificate],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap(code ? { code } : {}) } } }
      ]
    });
    http = TestBed.inject(HttpTestingController);
  };

  it('checks the code in the address right away and shows the holder', async () => {
    setup('abc123');
    const fixture = TestBed.createComponent(VerifyCertificate);
    http.expectOne(`${environment.apiUrl}/certificates/verify/abc123`).flush({
      name: 'Sam Rivera',
      title: 'Secure Coding Basics',
      version: 1,
      issuedAt: '2026-10-01T12:00:00Z'
    });
    await fixture.whenStable();
    const text = (fixture.nativeElement as HTMLElement).textContent;
    expect(text).toContain('This certificate is valid');
    expect(text).toContain('Sam Rivera');
  });

  it('sends nothing when the address has no code', async () => {
    setup(null);
    const fixture = TestBed.createComponent(VerifyCertificate);
    await fixture.whenStable();
    http.expectNone(() => true);
  });

  it('says no certificate has that code on a 404', async () => {
    setup('nope');
    const fixture = TestBed.createComponent(VerifyCertificate);
    http.expectOne(`${environment.apiUrl}/certificates/verify/nope`).flush(
      { message: 'Certificate not found' },
      { status: 404, statusText: 'Not Found' }
    );
    await fixture.whenStable();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('No certificate has that code');
  });
});
