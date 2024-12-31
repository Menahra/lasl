import * as matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';
import { afterEach, expect } from 'vitest';

// since we do not use vitest globals we need to extend expect
expect.extend(matchers);

// clear environment after each test case
afterEach(() => {
  cleanup();
});

