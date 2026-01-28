import { signal } from '@angular/core';
import { Toast, ToastType } from '../Models/toast.interface';
import { vi } from 'vitest';

export const createToastServiceMock = () => {
  const currentToast = signal<Toast | null>(null);

  return {
    currentToast,
    show: vi.fn((message: string, type: ToastType = 'success', _duration: number = 3000) => {
      currentToast.set({ message, type });
    }),

    clear: vi.fn(() => {
      currentToast.set(null);
    }),
  };
};

export const mockToastService = createToastServiceMock();
