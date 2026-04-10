import { signal } from '@angular/core';
import { vi } from 'vitest';

/**
 * Factory function to create a fresh mock instance.
 * This is the safest way to avoid 'this' errors and state leakage.
 */
export const createNavigationServiceMock = () => {
  const showCreateModal = signal(false);

  return {
    showCreateModal,
    // Use arrow functions to capture the 'showCreateModal' variable from the closure
    openModal: vi.fn(() => {
      showCreateModal.set(true);
    }),
    closeModal: vi.fn(() => {
      showCreateModal.set(false);
    }),
  };
};

// Export a singleton instance if you prefer, but factory functions are safer for tests
export const mockNavigationService = createNavigationServiceMock();
