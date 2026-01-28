import { Component, inject, input, output } from '@angular/core';
import { Article } from '../../../Models/content.interface';
import { RouterModule } from '@angular/router';
import { BookmarkButtonComponent } from './Bookmark/bookmark-button.component';
import { AuthService } from '../../../Services/Authorization/auth.service';

@Component({
  selector: 'app-article-card',
  templateUrl: './article-card.component.html',
  standalone: true,
  imports: [RouterModule, BookmarkButtonComponent],
})
export class ArticleCardComponent {
  authService = inject(AuthService);
  article = input.required<Article>();

  edit = output<Article>();
  delete = output<number>();
  bookmark = output<number>();
}
