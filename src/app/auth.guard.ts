// Route guards for Testify.
// A guard runs before a page opens and decides if the user can see it.
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

// Lets signed in users through. Everyone else goes to the sign-in page.
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  // Returning true opens the page. Returning a URL sends the user there instead.
  return auth.isLoggedIn() ? true : router.parseUrl('/sign-in');
};

// Lets admins through. Takers go to the test list. Signed out users go to sign-in.
export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  // Check for a signed in user first so a signed out user is not sent to the test list.
  if (!auth.isLoggedIn()) {
    return router.parseUrl('/sign-in');
  }
  return auth.isAdmin() ? true : router.parseUrl('/test-list');
};
