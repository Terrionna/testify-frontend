// Routes for Testify.
// Each route connects a URL to a page. canActivate runs a guard before the page opens.
import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './auth.guard';
import { SignIn } from './sign-in/sign-in';
import { Register } from './register/register';
import { TestList } from './test-list/test-list';
import { TakeTest } from './take-test/take-test';
import { MyResults } from './my-results/my-results';
import { VerifyCertificate } from './verify-certificate/verify-certificate';
import { AdminTests } from './admin-tests/admin-tests';

export const routes: Routes = [
  { path: '', redirectTo: 'test-list', pathMatch: 'full' },

  // Open to everyone.
  { path: 'sign-in', component: SignIn },
  { path: 'register', component: Register },
  { path: 'verify-certificate', component: VerifyCertificate },
  { path: 'verify-certificate/:code', component: VerifyCertificate },

  // Signed in users.
  { path: 'test-list', component: TestList, canActivate: [authGuard] },
  { path: 'take-test/:id', component: TakeTest, canActivate: [authGuard] },
  { path: 'my-results', component: MyResults, canActivate: [authGuard] },

  // Admins only.
  { path: 'admin-tests', component: AdminTests, canActivate: [adminGuard] },

  // Any unknown address goes to the test list.
  { path: '**', redirectTo: 'test-list' }
];
