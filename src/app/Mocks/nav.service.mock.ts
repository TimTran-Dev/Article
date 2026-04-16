import { signal } from '@angular/core';
import { vi } from 'vitest';

export const createNavigationServiceMock = () => {
  const showCreateModal = signal(false);

  return {
    showCreateModal,

    openModal: vi.fn(() => {
      showCreateModal.set(true);
    }),
    closeModal: vi.fn(() => {
      showCreateModal.set(false);
    }),
  };
};

export const mockNavigationService = createNavigationServiceMock();
