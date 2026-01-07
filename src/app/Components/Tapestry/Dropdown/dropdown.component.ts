import { CommonModule } from '@angular/common';
import { Component, EventEmitter, input, Output, signal } from '@angular/core';

@Component({
  selector: 'tap-dropdown',
  template: `
    <div>
      <button (click)="toggleDropdown()">
        {{ selectedValue() || 'Select an option' }}
      </button>
      @if (isOpen()) {
        <ul>
          @for (option of options(); track option) {
            <li>
              <button (click)="selectOption(option)">{{ option }}</button>
            </li>
          }
        </ul>
      }
    </div>
  `,
  imports: [CommonModule],
  standalone: true,
})
export class DropdownComponent<T extends string | number = string> {
  // dropdown content
  readonly options = input<T[]>([]);
  selectedValue = input<T | null>(null);

  @Output() selectionChange = new EventEmitter<T>();

  isOpen = signal(false);

  toggleDropdown(): void {
    this.isOpen.set(!this.isOpen());
    console.log('Dropdown toggled. Is open:', this.isOpen());
  }

  selectOption(option: T): void {
    console.log('Selected option:', option);
    this.selectionChange.emit(option);
    this.isOpen.set(false);
  }
}
