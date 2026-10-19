// Helpers shared by the test files.

// Builds a fake token. Only the middle part matters to the app.
export const makeToken = (role: string, secondsFromNow: number, name = 'Sam'): string => {
  const payload = { role, name, exp: Math.floor(Date.now() / 1000) + secondsFromNow };
  return 'header.' + btoa(JSON.stringify(payload)) + '.signature';
};

// The name the app saves the token under.
export const TOKEN_KEY = 'testify_token';
