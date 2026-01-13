import { signal } from '@angular/core';
import { vi } from 'vitest';
import { Toast, ToastType } from '../Models/toast.interface';

export const mockToastService = {
  // Use a signal to mirror the real service's state
  currentToast: signal<Toast | null>(null),

  // Spyable methods using Vitest vi.fn()
  show: vi.fn((message: string, type: ToastType = 'success', duration: number = 3000) => {
    // Optional: Update the signal so the UI reflects the change in tests
    mockToastService.currentToast.set({ message, type });
  }),

  clear: vi.fn(() => {
    mockToastService.currentToast.set(null);
  }),
};
