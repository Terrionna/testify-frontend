// Root component for Testify.
// Holds the navigation bar and the space where each page appears.
import { Component, inject } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from './auth.service';
import { OctopusMascotComponent } from './octopus-mascot/octopus-mascot';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, OctopusMascotComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // Public so the template can read who is signed in.
  auth = inject(AuthService);
  private router = inject(Router);

  // Signs the user out and sends them to the sign-in page.
  signOut(): void {
    this.auth.logout();
    this.router.navigateByUrl('/sign-in');
  }
}
