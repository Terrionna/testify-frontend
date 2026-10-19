// API service for Testify.
// Every call to the backend for tests, attempts, certificates, and stats lives here.
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

// One test in the list.
export interface TestSummary {
  _id: string;
  title: string;
  version: number;
  passingScore: number;
  // Only the admin list includes this.
  published?: boolean;
}

// One question. The correct answer is only sent to admins.
export interface Question {
  text: string;
  choices: string[];
  answer?: number;
}

// One test with its questions.
export interface TestDetail extends TestSummary {
  questions: Question[];
}

// What the backend sends back after a test is submitted.
export interface AttemptResult {
  score: number;
  passed: boolean;
  correct: number;
  total: number;
  certificateCode: string | null;
}

// One saved attempt in the results list.
export interface AttemptRow {
  _id: string;
  test: { _id: string; title: string };
  testVersion: number;
  score: number;
  passed: boolean;
  takenAt: string;
}

// One certificate in the results list.
export interface CertificateRow {
  _id: string;
  test: { _id: string; title: string };
  testVersion: number;
  code: string;
  issuedAt: string;
}

// What the public verify page shows.
export interface VerifiedCertificate {
  name: string;
  title: string;
  version: number;
  issuedAt: string;
}

// The numbers on the admin page.
export interface Stats {
  totals: { users: number; attempts: number; certificates: number };
  tests: {
    testId: string;
    title: string;
    version: number;
    attempts: number;
    takers: number;
    averageScore: number;
    passRate: number;
  }[];
}

// The data an admin sends to create a test.
export interface NewTest {
  title: string;
  passingScore: number;
  version: number;
  questions: { text: string; choices: string[]; answer: number }[];
}

@Injectable({ providedIn: 'root' })
export class TestService {
  private http = inject(HttpClient);
  private api = environment.apiUrl;

  // Signed in users.
  listTests() {
    return this.http.get<TestSummary[]>(`${this.api}/tests`);
  }
  getTest(id: string) {
    return this.http.get<TestDetail>(`${this.api}/tests/${id}`);
  }
  submitAttempt(id: string, answers: number[]) {
    return this.http.post<AttemptResult>(`${this.api}/tests/${id}/attempts`, { answers });
  }
  myAttempts() {
    return this.http.get<AttemptRow[]>(`${this.api}/attempts/mine`);
  }
  myCertificates() {
    return this.http.get<CertificateRow[]>(`${this.api}/certificates/mine`);
  }

  // Open to everyone.
  verifyCertificate(code: string) {
    return this.http.get<VerifiedCertificate>(`${this.api}/certificates/verify/${encodeURIComponent(code)}`);
  }

  // Admins only.
  adminListTests() {
    return this.http.get<TestSummary[]>(`${this.api}/admin/tests`);
  }
  adminCreateTest(body: NewTest) {
    return this.http.post<TestSummary>(`${this.api}/admin/tests`, body);
  }
  adminPublishTest(id: string) {
    return this.http.post<TestSummary>(`${this.api}/admin/tests/${id}/publish`, {});
  }
  adminNewVersion(id: string) {
    return this.http.post<TestSummary>(`${this.api}/admin/tests/${id}/versions`, {});
  }
  adminDeleteTest(id: string) {
    return this.http.delete<void>(`${this.api}/admin/tests/${id}`);
  }
  adminStats() {
    return this.http.get<Stats>(`${this.api}/admin/stats`);
  }
}
