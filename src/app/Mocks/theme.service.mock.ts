import { WritableSignal, signal } from '@angular/core';
import { vi, type Mock } from 'vitest';

export interface ThemeServiceMock {
  isDarkMode: WritableSignal<boolean>;
  toggleTheme: Mock;
}

export const createThemeServiceMock = (): ThemeServiceMock => {
  const isDarkMode = signal<boolean>(false);

  return {
    isDarkMode,
    toggleTheme: vi.fn(() => {
      isDarkMode.update((v) => !v);
    }) as Mock,
  };
};
