import {
  Component,
  computed,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { Article, ContentData } from '../../Models/content.interface';
import { ProductsService } from '../../Services/Products/products.service';
import { RouterModule } from '@angular/router';
import { LoadingComponent } from '../Tapestry/Loading/loading.component';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  standalone: true,
  imports: [RouterModule, LoadingComponent],
})
export class HomePageComponent implements OnInit, OnDestroy {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;

  featuredProducts = signal<ContentData[]>([]);
  isLoading = signal(false);

  private autoPlayInterval: ReturnType<typeof setInterval> | undefined;

  isPaused = signal(false);

  articles = computed(() =>
    this.featuredProducts().filter((p): p is Article => p.contentType === 'Article'),
  );

  comingSoon = computed(() => this.featuredProducts().filter((p) => p.contentType !== 'Article'));

  private readonly productService = inject(ProductsService);

  ngOnInit(): void {
    this.initializeProducts();
    this.startAutoPlay();
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
  }

  togglePause(state: boolean): void {
    this.isPaused.set(state);
  }

  private startAutoPlay(): void {
    this.autoPlayInterval = setInterval(() => {
      if (!this.isPaused() && this.scrollContainer) {
        this.moveNext();
      }
    }, 5000);
  }

  private stopAutoPlay(): void {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
    }
  }

  private moveNext(): void {
    const container = this.scrollContainer.nativeElement;

    const firstCard = container.querySelector('.snap-center') as HTMLElement;

    if (!firstCard) return;

    const cardWidth = firstCard.offsetWidth;
    const gap = 24;
    const step = cardWidth + gap;

    const isAtEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 50;

    if (isAtEnd) {
      container.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: step, behavior: 'smooth' });
    }
  }

  private initializeProducts(): void {
    this.isLoading.set(true);
    this.productService.getArticles(1, 10).subscribe({
      next: (response) => {
        this.featuredProducts.set(response.items);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching featured products', err);
        this.isLoading.set(false);
      },
    });
  }
}
