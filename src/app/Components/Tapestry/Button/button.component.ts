import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'tap-button',
  templateUrl: 'button.component.html',
  imports: [CommonModule],
  standalone: true,
})
export class ButtonComponent {
  buttonText = input.required<string>();
  disabled = input<boolean>();

  variant = input<'primary' | 'secondary' | 'danger'>('secondary');
}
