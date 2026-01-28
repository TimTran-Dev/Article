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

  // 1. Separate articles for the "Main" view
  // Using a type guard (isArticle) makes the 'title' property accessible
  articles = computed(() =>
    this.featuredProducts().filter((p): p is Article => p.contentType === 'Article'),
  );

  // 2. Identify coming soon content
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

    // 1. Grab the actual width of the first card found in the container
    const firstCard = container.querySelector('.snap-center') as HTMLElement;

    if (!firstCard) return;

    // 2. Calculate the step based on the real rendered width + the CSS gap
    const cardWidth = firstCard.offsetWidth;
    const gap = 24;
    const step = cardWidth + gap;

    // 3. Logic for looping back to start or moving forward
    const isAtEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 50;

    if (isAtEnd) {
      container.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: step, behavior: 'smooth' });
    }
  }

  private initializeProducts(): void {
    this.isLoading.set(true);
    this.productService.getFeaturedProducts().subscribe({
      next: (products) => {
        this.featuredProducts.set(products);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }
}
