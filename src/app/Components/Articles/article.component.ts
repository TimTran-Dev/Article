import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { Content } from '../../Models/content.interface';
import { map, Subject, takeUntil } from 'rxjs';
import { ProductsService } from '../../Services/products.service';
import { RouterModule } from '@angular/router';
import { DropdownComponent } from '../Tapestry/Dropdown/dropdown.component';
import { ContentStatus } from '../../Models/common.enum';

@Component({
  selector: 'app-article',
  templateUrl: './article.html',
  standalone: true,
  imports: [RouterModule, DropdownComponent],
})
export class ArticleComponent implements OnInit, OnDestroy {
  article = signal<(Content & { contentStatusSignal: WritableSignal<ContentStatus> })[]>([]);
  isLoading = signal(false);
  contentStatus: ContentStatus[] = Object.values(ContentStatus);

  productService = inject(ProductsService);

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    // Initialization logic here
    this.initializeArticles();
  }

  onStatusChange(newStatus: string): void {
    console.log('Status changed:', newStatus);
  }

  private initializeArticles(): void {
    this.isLoading.set(true);

    this.productService
      .getFeaturedProducts()
      .pipe(
        takeUntil(this.destroy$),
        map((items) => items.filter((item) => item.contentType === 'Article')),
      )
      .subscribe({
        next: (articleItems) => {
          const reactiveArticles = articleItems.map((content) => ({
            ...content,
            contentStatusSignal: signal(content.contentStatus),
          }));
          this.article.set(reactiveArticles);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error fetching articles:', error);
          this.isLoading.set(false);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
