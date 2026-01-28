import { Component, input, output } from '@angular/core';
import { Article } from '../../../Models/content.interface';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-article-card',
  templateUrl: './article-card.component.html',
  standalone: true,
  imports: [RouterModule],
})
export class ArticleCardComponent {
  article = input.required<Article>();

  edit = output<Article>();
  delete = output<number>();
}
