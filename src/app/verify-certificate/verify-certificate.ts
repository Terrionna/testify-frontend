// Verify page for Testify.
// Anyone can check a certificate by its code. No sign-in is needed.
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { TestService, VerifiedCertificate } from '../test.service';

@Component({
  selector: 'app-verify-certificate',
  imports: [DatePipe],
  templateUrl: './verify-certificate.html',
  styleUrl: './verify-certificate.css'
})
export class VerifyCertificate {
  private api = inject(TestService);
  private route = inject(ActivatedRoute);

  certificate = signal<VerifiedCertificate | null>(null);
  error = signal('');
  busy = signal(false);
  // The code typed or taken from the address, shown in the input box.
  code = signal(this.route.snapshot.paramMap.get('code') ?? '');

  // When the address already holds a code, check it right away.
  constructor() {
    if (this.code()) {
      this.check(this.code());
    }
  }

  // Looks up the certificate for a code.
  check(code: string): void {
    const trimmed = code.trim();
    if (!trimmed) {
      return;
    }
    this.certificate.set(null);
    this.error.set('');
    this.busy.set(true);
    this.api.verifyCertificate(trimmed).subscribe({
      next: (certificate) => {
        this.certificate.set(certificate);
        this.busy.set(false);
      },
      error: (err) => {
        this.error.set(err.status === 404 ? 'No certificate has that code' : 'Could not reach the server');
        this.busy.set(false);
      }
    });
  }

  // Runs when the form is sent.
  submit(event: Event, code: string): void {
    // Stop the browser from reloading the page.
    event.preventDefault();
    this.check(code);
  }
}
