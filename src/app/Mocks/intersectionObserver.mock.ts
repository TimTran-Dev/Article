import { vi } from 'vitest';

export class MockIntersectionObserver {
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();

  constructor() {
    /* empty */
  }
}

export const createIntersectionObserverMock = (): typeof IntersectionObserver => {
  return MockIntersectionObserver as unknown as typeof IntersectionObserver;
};
