// Tests for the take-test page.
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TakeTest } from './take-test';
import { environment } from '../../environments/environment';

// A test with two questions. The backend does not send the correct answers.
const sampleTest = {
  _id: 'abc',
  title: 'Sample',
  version: 1,
  passingScore: 80,
  questions: [
    { text: 'First?', choices: ['A', 'B'] },
    { text: 'Second?', choices: ['C', 'D'] }
  ]
};

describe('TakeTest', () => {
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TakeTest],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        // Pretend the address is /take-test/abc.
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id: 'abc' }) } } }
      ]
    });
    http = TestBed.inject(HttpTestingController);
  });

  it('loads the test from the address and shows its questions', async () => {
    const fixture = TestBed.createComponent(TakeTest);
    http.expectOne(`${environment.apiUrl}/tests/abc`).flush(sampleTest);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('First?');
    expect(el.textContent).toContain('Second?');
    expect(el.querySelectorAll('input[type=radio]').length).toBe(4);
  });

  it('keeps Submit disabled until every question has an answer', async () => {
    const fixture = TestBed.createComponent(TakeTest);
    http.expectOne(`${environment.apiUrl}/tests/abc`).flush(sampleTest);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    const button = el.querySelector('button.button') as HTMLButtonElement;
    expect(button.disabled).toBe(true);

    const radios = el.querySelectorAll<HTMLInputElement>('input[type=radio]');
    radios[0].dispatchEvent(new Event('change'));
    await fixture.whenStable();
    expect(button.disabled).toBe(true);

    radios[3].dispatchEvent(new Event('change'));
    await fixture.whenStable();
    expect(button.disabled).toBe(false);
  });

  it('sends the chosen positions and shows the result', async () => {
    const fixture = TestBed.createComponent(TakeTest);
    http.expectOne(`${environment.apiUrl}/tests/abc`).flush(sampleTest);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    const radios = el.querySelectorAll<HTMLInputElement>('input[type=radio]');
    // First question: choice 0. Second question: choice 1.
    radios[0].dispatchEvent(new Event('change'));
    radios[3].dispatchEvent(new Event('change'));
    await fixture.whenStable();
    (el.querySelector('button.button') as HTMLButtonElement).click();

    const req = http.expectOne(`${environment.apiUrl}/tests/abc/attempts`);
    expect(req.request.body).toEqual({ answers: [0, 1] });
    req.flush({ score: 100, passed: true, correct: 2, total: 2, certificateCode: 'abc123' });
    await fixture.whenStable();
    expect(el.textContent).toContain('Your score: 100%');
    expect(el.textContent).toContain('abc123');
  });
});
