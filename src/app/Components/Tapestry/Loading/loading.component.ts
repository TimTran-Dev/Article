import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'tap-loading',
  template: `
    <div class="flex py-8 justify-center min-h-screen bg-gray-50">
      <div class="text-center">
        <div
          class="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"
        ></div>
        <p class="mt-4 text-gray-600 text-lg">{{ loadingText() }}</p>
      </div>
    </div>
  `,
  standalone: true,
  imports: [CommonModule],
})
export class LoadingComponent {
  loadingText = input<string>('');
}
