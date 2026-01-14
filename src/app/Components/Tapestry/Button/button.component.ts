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

  // Logic moved out of template
  protected buttonClasses = computed(() => {
    const baseClasses = 'px-4 py-2 text-sm font-medium rounded-lg transition-colors';

    const variants = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700',
      secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
      danger: 'bg-red-600 text-white hover:bg-red-700',
    };

    return `${baseClasses} ${variants[this.variant()]}`;
  });
}
