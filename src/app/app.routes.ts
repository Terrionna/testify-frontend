import { Routes } from '@angular/router';
import { SignIn } from './sign-in/sign-in';
import { Register } from './register/register';
import { TestList } from './test-list/test-list';
import { TakeTest } from './take-test/take-test';
import { MyResults } from './my-results/my-results';
import { VerifyCertificate } from './verify-certificate/verify-certificate';
import { AdminTests } from './admin-tests/admin-tests';

export const routes: Routes = [
  { path: '', redirectTo: 'test-list', pathMatch: 'full' },
  { path: 'sign-in', component: SignIn },
  { path: 'register', component: Register },
  { path: 'test-list', component: TestList },
  { path: 'take-test/:id', component: TakeTest },
  { path: 'my-results', component: MyResults },
  { path: 'verify-certificate', component: VerifyCertificate },
  { path: 'admin-tests', component: AdminTests },
  { path: '**', redirectTo: 'test-list' }
];
