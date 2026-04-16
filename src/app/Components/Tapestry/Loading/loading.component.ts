import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: 'loading.component.html',
  standalone: true,
  imports: [CommonModule],
})
export class LoadingComponent {
  loadingText = input<string>('Loading content...');
}
