import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Content } from '../../Models/content.interface';
import { ProductsService } from '../../Services/products.service';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.html',
  standalone: true,
  imports: [RouterModule],
  // styleUrls: ['./homepage.component.css']
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
