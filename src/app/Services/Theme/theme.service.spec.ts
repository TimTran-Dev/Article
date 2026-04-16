import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';
import { PLATFORM_ID } from '@angular/core';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

describe('ThemeService', () => {
  let service: ThemeService;

  const setSystemTheme = (isDark: boolean) => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: isDark,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    });
  };

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();

    setSystemTheme(false);
  });

  afterEach(() => {
    document.documentElement.classList.remove('dark');
  });

  describe('Initialization', () => {
    it('should initialize with dark mode if localStorage is "dark"', () => {
      localStorage.setItem('theme', 'dark');

      service = TestBed.inject(ThemeService);

      expect(service.isDarkMode()).toBe(true);
    });

    it('should initialize with system preference when localStorage is empty', () => {
      setSystemTheme(true);

      service = TestBed.inject(ThemeService);

      expect(service.isDarkMode()).toBe(true);
    });
  });

  describe('Theme Toggling', () => {
    it('should toggle from light to dark and update side effects', () => {
      service = TestBed.inject(ThemeService);
      expect(service.isDarkMode()).toBe(false);

      service.toggleTheme();

      TestBed.flushEffects();

      expect(service.isDarkMode()).toBe(true);
      expect(localStorage.getItem('theme')).toBe('dark');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('should toggle from dark to light and remove side effects', () => {
      localStorage.setItem('theme', 'dark');
      service = TestBed.inject(ThemeService);

      service.toggleTheme();
      TestBed.flushEffects();

      expect(service.isDarkMode()).toBe(false);
      expect(localStorage.getItem('theme')).toBe('light');
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });
  });

  describe('Platform Safety', () => {
    it('should not update DOM or localStorage if running on Server', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [{ provide: PLATFORM_ID, useValue: 'server' }],
      });

      const rootSpy = vi.spyOn(document.documentElement.classList, 'add');
      const storageSpy = vi.spyOn(Storage.prototype, 'setItem');

      service = TestBed.inject(ThemeService);
      service.toggleTheme();
      TestBed.flushEffects();

      expect(service.isDarkMode()).toBe(true);
      expect(rootSpy).not.toHaveBeenCalled();
      expect(storageSpy).not.toHaveBeenCalled();
    });
  });
});
