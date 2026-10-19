// My results page for Testify.
// Shows the user's attempts and certificates.
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AttemptRow, CertificateRow, TestService } from '../test.service';

@Component({
  selector: 'app-my-results',
  imports: [RouterLink, DatePipe],
  templateUrl: './my-results.html',
  styleUrl: './my-results.css'
})
export class MyResults {
  private api = inject(TestService);

  attempts = signal<AttemptRow[]>([]);
  certificates = signal<CertificateRow[]>([]);
  loading = signal(true);
  error = signal('');

  // Loads both lists when the page opens.
  constructor() {
    this.api.myAttempts().subscribe({
      next: (attempts) => {
        this.attempts.set(attempts);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message ?? 'Could not load your results');
        this.loading.set(false);
      }
    });
    this.api.myCertificates().subscribe({
      next: (certificates) => this.certificates.set(certificates),
      error: (err) => this.error.set(err.error?.message ?? 'Could not load your certificates')
    });
  }

  // Builds the address of the public page that verifies a certificate.
  verifyUrl(code: string): string {
    return `${window.location.origin}/verify-certificate/${code}`;
  }

  // Builds LinkedIn's Add to Profile address. No account linking is involved.
  linkedInUrl(cert: CertificateRow): string {
    const issued = new Date(cert.issuedAt);
    const params = new URLSearchParams({
      startTask: 'CERTIFICATION_NAME',
      name: cert.test.title,
      organizationName: 'Testify',
      issueYear: String(issued.getFullYear()),
      issueMonth: String(issued.getMonth() + 1),
      certUrl: this.verifyUrl(cert.code),
      certId: cert.code
    });
    return `https://www.linkedin.com/profile/add?${params.toString()}`;
  }
}
