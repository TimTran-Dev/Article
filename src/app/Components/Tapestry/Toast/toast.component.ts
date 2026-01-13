import { CommonModule } from '@angular/common';
import { Component, inject, signal, effect, OnDestroy } from '@angular/core';
import { ToastService } from '../../../Services/Toast/toast.service';

@Component({
  selector: 'tap-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (toastService.currentToast(); as toast) {
      <div
        class="fixed bottom-5 right-5 z-[100] min-w-[320px] overflow-hidden rounded-xl shadow-2xl border bg-white transition-all duration-500 ease-in-out transform"
        [ngClass]="{
          'translate-x-0 opacity-100': isVisible(),
          'translate-x-[110%] opacity-0': !isVisible(),
        }"
        [class]="getContainerClass(toast.type)"
      >
        <div class="flex items-start p-4">
          <div class="flex-shrink-0 mr-3">
            @switch (toast.type) {
              @case ('success') {
                <svg
                  class="h-6 w-6 text-emerald-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
              @case ('error') {
                <svg
                  class="h-6 w-6 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
              @case ('info') {
                <svg
                  class="h-6 w-6 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
            }
          </div>

          <div class="flex-1 pt-0.5">
            <p class="text-sm font-bold text-gray-900 capitalize">{{ toast.type }}</p>
            <p class="text-sm text-gray-600 mt-1 leading-relaxed">{{ toast.message }}</p>
          </div>

          <button
            (click)="dismiss()"
            class="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div class="h-1 w-full bg-gray-100">
          <div
            [class]="getProgressClass(toast.type)"
            class="h-full transition-all ease-linear"
            [style.width.%]="progressWidth()"
            [style.transition-duration.ms]="progressBarDuration"
          ></div>
        </div>
      </div>
    }
  `,
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

  dismiss() {
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

  ngOnDestroy() {
    if (this.exitTimeout) {
      clearTimeout(this.exitTimeout);
    }
  }
}
