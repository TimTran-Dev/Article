import { Component, input, output } from '@angular/core';
import { Article } from '../../../Models/content.interface';
import { RouterModule } from '@angular/router';
import { DropdownComponent } from '../../Tapestry/Dropdown/dropdown.component';
import { ContentStatus } from '../../../Models/common.enum';

@Component({
  selector: 'app-article-card',
  templateUrl: './article-card.component.html',
  standalone: true,
  imports: [RouterModule, DropdownComponent],
})
export class ArticleCardComponent {
  article = input.required<Article>();

  edit = output<Article>();
  delete = output<number>();
  statusChange = output<{ id: number; status: ContentStatus }>();

  contentStatus: ContentStatus[] = Object.values(ContentStatus);
}
