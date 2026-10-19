// Tests for the admin page.
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { AdminTests } from './admin-tests';
import { environment } from '../../environments/environment';

describe('AdminTests', () => {
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AdminTests],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    http = TestBed.inject(HttpTestingController);
  });

  // Creates the page and answers the two requests it sends when it opens.
  const open = async () => {
    const fixture = TestBed.createComponent(AdminTests);
    http.expectOne(`${environment.apiUrl}/admin/tests`).flush([
      { _id: 'd1', title: 'Draft Test', version: 1, passingScore: 80, published: false },
      { _id: 'p1', title: 'Live Test', version: 1, passingScore: 80, published: true }
    ]);
    http.expectOne(`${environment.apiUrl}/admin/stats`).flush({
      totals: { users: 3, attempts: 2, certificates: 1 },
      tests: [{ testId: 'p1', title: 'Live Test', version: 1, attempts: 2, takers: 2, averageScore: 80, passRate: 50 }]
    });
    await fixture.whenStable();
    return fixture;
  };

  it('shows the tests with their status and the stats', async () => {
    const fixture = await open();
    const text = (fixture.nativeElement as HTMLElement).textContent;
    expect(text).toContain('Draft');
    expect(text).toContain('Published');
    expect(text).toContain('50%');
  });

  it('offers Publish and Delete only for drafts', async () => {
    const fixture = await open();
    const labels = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('td button')).map((b) => b.textContent?.trim());
    // The draft row has Publish, Delete, New version. The published row has New version.
    expect(labels).toEqual(['Publish', 'Delete', 'New version', 'New version']);
  });

  it('turns the form into the shape the backend expects', async () => {
    const fixture = await open();
    const page = fixture.componentInstance;
    page.toggleForm();
    page.questions.set([{ text: 'Question?', choices: 'Right\nWrong\n\n', answer: 1 }]);
    page.save(new Event('submit'), 'New Test', '70', '1');
    const req = http.expectOne(`${environment.apiUrl}/admin/tests`);
    expect(req.request.method).toBe('POST');
    // Empty lines are dropped, and the answer counts from 0.
    expect(req.request.body).toEqual({
      title: 'New Test',
      passingScore: 70,
      version: 1,
      questions: [{ text: 'Question?', choices: ['Right', 'Wrong'], answer: 0 }]
    });
  });
});
