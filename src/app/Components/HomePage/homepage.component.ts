import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ContentData } from '../../Models/content.interface';
import { ProductsService } from '../../Services/Products/products.service';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { LoadingComponent } from '../Tapestry/Loading/loading.component';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  standalone: true,
  imports: [RouterModule, LoadingComponent],
})
export class HomePageComponent implements OnInit, OnDestroy {
  // Signal now holds the flat Union type (Article | Segment | Episode)
  featuredProducts = signal<ContentData[]>([]);
  isLoading = signal(false);

  private readonly productService = inject(ProductsService);
  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.initializeProducts();
  }

  private initializeProducts(): void {
    this.isLoading.set(true);

    this.productService
      .getFeaturedProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (products: ContentData[]) => {
          this.featuredProducts.set(products);
          this.isLoading.set(false);
        },
        error: (err: Error) => {
          console.error('Failed to load featured products', err);
          this.isLoading.set(false);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
