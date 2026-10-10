import { Routes } from '@angular/router';
import { TestList } from './test-list/test-list';
import { TakeTest } from './take-test/take-test';
import { MyResults } from './my-results/my-results';
import { AdminTests } from './admin-tests/admin-tests';
import { authGuard, adminGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: 'test-list',
    component: TestList,
    canActivate: [authGuard]
  },
  {
    path: 'take-test/:id',
    component: TakeTest,
    canActivate: [authGuard]
  },
  {
    path: 'my-results',
    component: MyResults,
    canActivate: [authGuard]
  },
  {
    path: 'admin-tests',
    component: AdminTests,
    canActivate: [adminGuard]
  }
];
