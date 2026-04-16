import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'tap-button',
  templateUrl: 'button.component.html',
  imports: [CommonModule],
  standalone: true,
})
export class ButtonComponent {
  buttonText = input.required<string>();
  disabled = input<boolean>(false);
  variant = input<'primary' | 'secondary' | 'danger'>('secondary');

  protected buttonClasses = computed(() => {
    const baseClasses =
      'px-4 py-2 text-sm font-medium rounded-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      primary:
        'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 shadow-sm dark:shadow-blue-900/20',

      secondary:
        'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 border border-transparent dark:border-slate-700',

      danger: 'bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600',
    };

    return `${baseClasses} ${variants[this.variant()]}`;
  });
}
