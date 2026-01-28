import { TestBed } from '@angular/core/testing';
import { ToastService } from './toast.service';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ToastService],
    });
    service = TestBed.inject(ToastService);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should be created with a null initial state', () => {
    expect(service.currentToast()).toBeNull();
  });

  describe('show()', () => {
    it('should set the toast signal immediately', () => {
      service.show('Test Message', 'success', 3000);

      const toast = service.currentToast();
      expect(toast).not.toBeNull();
      expect(toast?.message).toBe('Test Message');
      expect(toast?.type).toBe('success');
    });

    it('should automatically call clear() after the specified duration', () => {
      const clearSpy = vi.spyOn(service, 'clear');

      service.show('Closing soon', 'error', 5000);

      vi.advanceTimersByTime(5000);

      expect(clearSpy).toHaveBeenCalled();
    });
  });

  describe('clear()', () => {
    it('should set the signal to null after a 300ms delay', () => {
      service.show('Manual Clear');
      expect(service.currentToast()).not.toBeNull();

      service.clear();

      vi.advanceTimersByTime(200);
      expect(service.currentToast()).not.toBeNull();

      vi.advanceTimersByTime(100);
      expect(service.currentToast()).toBeNull();
    });
  });
});
