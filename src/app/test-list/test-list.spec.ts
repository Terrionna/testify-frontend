// Tests for the test list page.
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TestList } from './test-list';
import { environment } from '../../environments/environment';

describe('TestList', () => {
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestList],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()]
    });
    http = TestBed.inject(HttpTestingController);
  });

  it('shows each test the backend sends', async () => {
    const fixture = TestBed.createComponent(TestList);
    http.expectOne(`${environment.apiUrl}/tests`).flush([
      { _id: '1', title: 'Secure Coding Basics', version: 1, passingScore: 80 },
      { _id: '2', title: 'Web API Fundamentals', version: 2, passingScore: 70 }
    ]);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelectorAll('.card').length).toBe(2);
    expect(el.textContent).toContain('Secure Coding Basics');
    expect(el.textContent).toContain('Version 2');
  });

  it('says so when no tests are published', async () => {
    const fixture = TestBed.createComponent(TestList);
    http.expectOne(`${environment.apiUrl}/tests`).flush([]);
    await fixture.whenStable();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('No tests are published yet');
  });
});
