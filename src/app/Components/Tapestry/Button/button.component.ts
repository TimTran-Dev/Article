import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'tap-button',
  template: `
    <button
      [disabled]="disabled()"
      class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
    >
      {{ buttonText() }}
    </button>
  `,
  imports: [CommonModule],
  standalone: true,
})
export class ButtonComponent {
  buttonText = input.required<string>();
  disabled = input<boolean>();

  variant = input<'primary' | 'secondary' | 'danger'>('secondary');
}
