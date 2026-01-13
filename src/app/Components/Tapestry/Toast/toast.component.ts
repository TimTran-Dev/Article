import { CommonModule } from '@angular/common';
import { Component, inject, signal, effect, OnDestroy } from '@angular/core';
import { ToastService } from '../../../Services/Toast/toast.service';

@Component({
  selector: 'tap-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: 'toast.component.html',
})
export class ToastComponent implements OnDestroy {
  toastService = inject(ToastService);

  isVisible = signal(false);
  progressWidth = signal(100);

  // Total time the toast exists in the DOM
  totalDuration = 3000;
  // Bar finishes slightly before the slide-out starts
  progressBarDuration = 2500;

  private exitTimeout: any;

  constructor() {
    effect(() => {
      const toast = this.toastService.currentToast();

      if (toast) {
        // Reset state
        this.progressWidth.set(100);
        this.isVisible.set(false);

        // 1. Entrance
        setTimeout(() => {
          this.isVisible.set(true);
          // 2. Start Progress (finishes at 2500ms)
          this.progressWidth.set(0);
        }, 50);

        // 3. Start sliding out exactly when the bar hits 0%
        this.exitTimeout = setTimeout(() => {
          this.isVisible.set(false);
        }, this.progressBarDuration);
      }
    });
  }

  dismiss(): void {
    this.isVisible.set(false);
    setTimeout(() => {
      this.toastService.clear();
    }, 500);
  }

  getContainerClass(type: string): string {
    switch (type) {
      case 'success':
        return 'border-emerald-100 ring-1 ring-emerald-500/10';
      case 'error':
        return 'border-red-100 ring-1 ring-red-500/10';
      default:
        return 'border-blue-100 ring-1 ring-blue-500/10';
    }
  }

  getProgressClass(type: string): string {
    switch (type) {
      case 'success':
        return 'bg-emerald-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  }

  ngOnDestroy(): void {
    if (this.exitTimeout) {
      clearTimeout(this.exitTimeout);
    }
  }
}
