// Tests for the root component and its navigation bar.
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { App } from './app';
import { makeToken, TOKEN_KEY } from './testing-helpers';

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([]), provideHttpClient()]
    });
  });

  afterEach(() => localStorage.clear());

  // Creates the app and returns the page it drew as text.
  const render = async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    return (fixture.nativeElement as HTMLElement).textContent ?? '';
  };

  it('shows Sign In and Register when signed out', async () => {
    const text = await render();
    expect(text).toContain('Sign In');
    expect(text).toContain('Register');
    expect(text).not.toContain('My Results');
    expect(text).not.toContain('Admin');
  });

  it('shows the name, My Results, and Sign Out for a taker, but not Admin', async () => {
    localStorage.setItem(TOKEN_KEY, makeToken('taker', 3600, 'Sam'));
    const text = await render();
    expect(text).toContain('Sam');
    expect(text).toContain('My Results');
    expect(text).toContain('Sign Out');
    expect(text).not.toContain('Admin');
  });

  it('shows the Admin link for an admin', async () => {
    localStorage.setItem(TOKEN_KEY, makeToken('admin', 3600));
    expect(await render()).toContain('Admin');
  });
});
