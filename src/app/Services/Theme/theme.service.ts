import { Injectable, signal, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private platformId = inject(PLATFORM_ID);

  // 1. Determine initial state safely
  private getInitialTheme(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem('theme');
      if (stored) return stored === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  }

  isDarkMode = signal<boolean>(this.getInitialTheme());

  constructor() {
    // 2. The Effect: This watches the signal and updates the DOM
    effect(() => {
      const dark = this.isDarkMode();
      if (isPlatformBrowser(this.platformId)) {
        this.applyTheme(dark);
      }
    });
  }

  toggleTheme(): void {
    this.isDarkMode.update((v) => !v);
  }

  private applyTheme(isDark: boolean): void {
    const root = document.documentElement; // This is the <html> tag
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }
}
