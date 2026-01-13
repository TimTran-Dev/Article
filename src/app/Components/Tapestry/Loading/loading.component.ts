import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'tap-loading',
  templateUrl: 'loading.component.html',
  standalone: true,
  imports: [CommonModule],
})
export class LoadingComponent {
  loadingText = input<string>('');
}
