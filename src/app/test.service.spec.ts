// Tests for TestService: each call must use the right address and method.
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TestService } from './test.service';
import { environment } from '../environments/environment';

describe('TestService', () => {
  let service: TestService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(TestService);
    http = TestBed.inject(HttpTestingController);
  });

  // Fail if a request was sent that the test did not check.
  afterEach(() => http.verify());

  it('lists tests with GET /tests', () => {
    service.listTests().subscribe();
    expect(http.expectOne(`${environment.apiUrl}/tests`).request.method).toBe('GET');
  });

  it('submits answers with POST /tests/:id/attempts', () => {
    service.submitAttempt('abc', [0, 1]).subscribe();
    const req = http.expectOne(`${environment.apiUrl}/tests/abc/attempts`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ answers: [0, 1] });
  });

  it('verifies a certificate with GET /certificates/verify/:code', () => {
    service.verifyCertificate('abc123').subscribe();
    expect(http.expectOne(`${environment.apiUrl}/certificates/verify/abc123`).request.method).toBe('GET');
  });

  it('publishes with POST /admin/tests/:id/publish', () => {
    service.adminPublishTest('abc').subscribe();
    expect(http.expectOne(`${environment.apiUrl}/admin/tests/abc/publish`).request.method).toBe('POST');
  });

  it('deletes with DELETE /admin/tests/:id', () => {
    service.adminDeleteTest('abc').subscribe();
    expect(http.expectOne(`${environment.apiUrl}/admin/tests/abc`).request.method).toBe('DELETE');
  });

  it('loads stats with GET /admin/stats', () => {
    service.adminStats().subscribe();
    expect(http.expectOne(`${environment.apiUrl}/admin/stats`).request.method).toBe('GET');
  });
});
