import { Injectable, signal } from '@angular/core';
import { Toast, ToastType } from '../../Models/toast.interface';

@Injectable({ providedIn: 'root' })
export class ToastService {
  currentToast = signal<Toast | null>(null);

  show(message: string, type: ToastType = 'success', duration: number = 3000): void {
    this.currentToast.set({ message, type });

    // Auto-close logic
    setTimeout(() => {
      this.clear();
    }, duration);
  }

  clear(): void {
    // We don't null it immediately. We let the component handle the exit first.
    // If you want to keep the service simple, you can handle the nulling here
    // after a 300ms delay.
    setTimeout(() => {
      this.currentToast.set(null);
    }, 300);
  }
}
