import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Article } from '../../../../Models/content.interface';

@Component({
  selector: 'app-bookmark-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bookmark-button.component.html',
})
export class BookmarkButtonComponent {
  article = input.required<Article>();

  toggled = output<number>();

  onToggle(event: Event): void {
    event.stopPropagation();
    this.toggled.emit(this.article().id);
  }
}
