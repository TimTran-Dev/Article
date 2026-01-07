import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Content } from '../../Models/content.interface';
import { ProductsService } from '../../Services/products.service';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-homepage',
  template: `
    @if (isLoading()) {
      <p>Loading...</p>
    }
    @if (!isLoading()) {
      <div>
        <nav><a routerLink="/">Home</a> | <a routerLink="/articles">Articles</a></nav>
        <h1>Featured Products</h1>
        @for (product of featuredProducts(); track product.id) {
          <ul></ul>
          <h2>{{ product.contentType }}</h2>
          @if (
            product.contentType === 'Article' && product.content && 'author' in product.content
          ) {
            <ul>
              <li>
                {{ product.description }}
              </li>
              <li>
                {{ product.content.author }}
              </li>
            </ul>
          }
        }
      </div>

      <router-outlet></router-outlet>
    }
  `,
  standalone: true,
  imports: [RouterModule],
})
export class HomePageComponent implements OnInit, OnDestroy {
  featuredProducts = signal<Content[]>([]);
  isLoading = signal(false);
  private destroy$ = new Subject<void>();

  productService = inject(ProductsService);

  ngOnInit(): void {
    this.initializeProducts();
  }

  private initializeProducts(): void {
    this.isLoading.set(true);
    this.productService
      .getFeaturedProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (products: Content[]) => {
          this.featuredProducts.set(products);
          this.isLoading.set(false);
          console.log(this.featuredProducts());
        },
        error: () => {
          this.isLoading.set(false);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
