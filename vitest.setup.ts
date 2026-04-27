import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach } from 'vitest';
import { cleanup } from '@testing-library/react';

beforeEach(() => {
  // jsdom ships a real localStorage; just wipe it between tests so the
  // store's captured storage reference stays valid.
  localStorage.clear();
  sessionStorage.clear();
});

afterEach(() => {
  cleanup();
});
