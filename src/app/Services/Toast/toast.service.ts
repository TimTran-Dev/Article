import { Injectable, signal } from '@angular/core';
import { Toast, ToastType } from '../../Models/toast.interface';

@Injectable({ providedIn: 'root' })
export class ToastService {
  currentToast = signal<Toast | null>(null);

  show(message: string, type: ToastType = 'success', duration: number = 3000): void {
    this.currentToast.set({ message, type });

    setTimeout(() => {
      this.clear();
    }, duration);
  }

  clear(): void {
    setTimeout(() => {
      this.currentToast.set(null);
    }, 300);
  }
}
