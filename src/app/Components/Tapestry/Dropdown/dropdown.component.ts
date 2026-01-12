import { CommonModule } from '@angular/common';
import { Component, EventEmitter, input, Output, signal } from '@angular/core';

@Component({
  selector: 'tap-dropdown',
  template: `
    <div class="relative inline-block text-left">
      <!-- Dropdown Button -->
      <button
        type="button"
        (click)="toggleDropdown()"
        class="inline-flex items-center justify-between min-w-[140px] px-4 py-2 text-sm font-medium rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        [ngClass]="{
          'bg-white text-gray-700 border-gray-300 hover:bg-gray-50': !selectedValue(),
          'bg-green-50 text-green-700 border-green-200 hover:bg-green-100':
            selectedValue() === 'Published',
          'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100':
            selectedValue() === 'Review',
          'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100': selectedValue() === 'Draft',
        }"
        [attr.aria-expanded]="isOpen()"
        aria-haspopup="true"
      >
        <span class="flex items-center space-x-2">
          <!-- Status Icon -->
          @if (selectedValue() === 'Published') {
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              ></path>
            </svg>
          }
          @if (selectedValue() === 'Review') {
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clip-rule="evenodd"
              ></path>
            </svg>
          }
          @if (selectedValue() === 'Draft') {
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
              ></path>
            </svg>
          }
          @if (!selectedValue()) {
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clip-rule="evenodd"
              ></path>
            </svg>
          }
          <span>{{ selectedValue() || 'Select status' }}</span>
        </span>

        <!-- Chevron Icon -->
        <svg
          class="w-5 h-5 ml-2 transition-transform duration-200"
          [ngClass]="{ 'rotate-180': isOpen() }"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clip-rule="evenodd"
          ></path>
        </svg>
      </button>

      <!-- Dropdown Menu -->
      @if (isOpen()) {
        <div
          class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <div class="py-1" role="menu" aria-orientation="vertical">
            @for (option of options(); track option) {
              <button
                type="button"
                (click)="selectOption(option)"
                class="w-full text-left px-4 py-2 text-sm transition-colors flex items-center space-x-3"
                [ngClass]="{
                  'bg-green-50 text-green-700':
                    option === 'Published' && selectedValue() === option,
                  'text-green-700 hover:bg-green-50':
                    option === 'Published' && selectedValue() !== option,
                  'bg-yellow-50 text-yellow-700': option === 'Review' && selectedValue() === option,
                  'text-yellow-700 hover:bg-yellow-50':
                    option === 'Review' && selectedValue() !== option,
                  'bg-gray-50 text-gray-700': option === 'Draft' && selectedValue() === option,
                  'text-gray-700 hover:bg-gray-50':
                    option === 'Draft' && selectedValue() !== option,
                }"
                role="menuitem"
              >
                <!-- Status Icons in Menu -->
                @if (option === 'Published') {
                  <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                }
                @if (option === 'Review') {
                  <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                }
                @if (option === 'Draft') {
                  <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                    ></path>
                  </svg>
                }

                <div class="flex-1 flex items-center justify-between">
                  <span class="font-medium">{{ option }}</span>
                  @if (selectedValue() === option) {
                    <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  }
                </div>
              </button>
            }
          </div>
        </div>
      }

      <!-- Backdrop for closing dropdown when clicking outside -->
      @if (isOpen()) {
        <div class="fixed inset-0 z-0" (click)="toggleDropdown()" aria-hidden="true"></div>
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
