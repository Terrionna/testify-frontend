import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  TestSummary,
  TestDetail,
  AttemptResult,
  Attempt,
  Certificate,
  CertificateVerification,
  AdminTest
} from './models';

const API_URL = '/api';

@Injectable({ providedIn: 'root' })
export class TestService {
  constructor(private http: HttpClient) { }

  listPublished(): Observable<TestSummary[]> {
    return this.http.get<TestSummary[]>(`${API_URL}/tests`);
  }

  getPublished(id: string): Observable<TestDetail> {
    return this.http.get<TestDetail>(`${API_URL}/tests/${id}`);
  }

  submit(id: string, answers: number[]): Observable<AttemptResult> {
    return this.http.post<AttemptResult>(`${API_URL}/tests/${id}/attempts`, { answers });
  }

  myAttempts(): Observable<Attempt[]> {
    return this.http.get<Attempt[]>(`${API_URL}/attempts/mine`);
  }

  myCertificates(): Observable<Certificate[]> {
    return this.http.get<Certificate[]>(`${API_URL}/certificates/mine`);
  }

  verifyCertificate(code: string): Observable<CertificateVerification> {
    return this.http.get<CertificateVerification>(`${API_URL}/certificates/verify/${code}`);
  }

  listAll(): Observable<AdminTest[]> {
    return this.http.get<AdminTest[]>(`${API_URL}/admin/tests`);
  }

  create(test: Omit<AdminTest, '_id' | 'published'>): Observable<AdminTest> {
    return this.http.post<AdminTest>(`${API_URL}/admin/tests`, test);
  }

  update(id: string, test: Omit<AdminTest, '_id' | 'published'>): Observable<AdminTest> {
    return this.http.put<AdminTest>(`${API_URL}/admin/tests/${id}`, test);
  }

  publish(id: string): Observable<AdminTest> {
    return this.http.post<AdminTest>(`${API_URL}/admin/tests/${id}/publish`, {});
  }

  newVersion(id: string): Observable<AdminTest> {
    return this.http.post<AdminTest>(`${API_URL}/admin/tests/${id}/versions`, {});
  }

  history(id: string): Observable<{ title: string; latest: unknown; versions: unknown[] }> {
    return this.http.get<{ title: string; latest: unknown; versions: unknown[] }>(
      `${API_URL}/admin/tests/${id}/history`
    );
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${API_URL}/admin/tests/${id}`);
  }
}
