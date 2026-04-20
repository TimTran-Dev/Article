import { Component, inject, OnInit, signal, OnDestroy, viewChild, ElementRef } from '@angular/core';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { ArticleCardComponent } from '../Cards/article-card.component';
import { ArticleSkeletonComponent } from '../Skeleton/article-skeleton.component';
import { ReactiveArticle } from '../../../Models/content.interface';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { ProductsService } from '../../../Services/Products/products.service';
import { ToastService } from '../../../Services/Toast/toast.service';
import { NavigationService } from '../../../Services/NavigationService/navigation.service';
import { BookmarkService } from '../../../Services/Bookmark/bookmark.service';

@Component({
  selector: 'app-news-list',
  templateUrl: './news-list.component.html',
  standalone: true,
  animations: [
    trigger('staggerFade', [
      transition('* => *', [
        query(
          ':enter',
          [
            style({ opacity: 0, transform: 'translateY(20px)' }),
            stagger(60, [
              animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
            ]),
          ],
          { optional: true },
        ),
      ]),
    ]),
  ],
  imports: [ArticleCardComponent, ArticleSkeletonComponent],
})
export class NewsListComponent implements OnInit, OnDestroy {
  productService = inject(ProductsService);
  toastService = inject(ToastService);
  navService = inject(NavigationService);
  bookmarkService = inject(BookmarkService);

  isLoading = signal(false);
  articles = signal<ReactiveArticle[]>([]);
  searchTerm = signal('');

  currentPage = signal(1);
  pageSize = signal(10);
  totalItems = signal(0);
  hasMore = signal(true);
  isLoadingMore = signal(false);

  searchSubject = new Subject<string>();

  destroy$ = new Subject<void>();

  sentinelElement = viewChild('sentinel', { read: ElementRef });
  private intersectionObserver: IntersectionObserver | null = null;

  ngOnInit(): void {
    this.initializeArticles();
    this.setupSearchSubscription();
    this.setupInfiniteScroll();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.intersectionObserver?.disconnect();
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchSubject.next(input.value);
  }

  handleBookmarkToggle(articleId: number): void {
    const article = this.articles().find((a) => a.id === articleId);
    if (!article) return;

    this.bookmarkService.toggleBookmark(articleId).subscribe({
      next: (response) => {
        this.articles.update((items) =>
          items.map((item) =>
            item.id === articleId ? { ...item, isBookmarked: response.bookmarked } : item,
          ),
        );

        const message = response.bookmarked ? 'Saved to Library' : 'Removed from Library';
        this.toastService.show(message, 'success');
      },
      error: () => {
        this.toastService.show('Failed to update bookmark.', 'error');
      },
    });
  }

  loadMore(): void {
    const nextPage = this.currentPage() + 1;
    this.isLoadingMore.set(true);

    this.productService
      .getArticles(nextPage, this.pageSize(), this.searchTerm())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          const newReactive = res.items.map((art) => ({
            ...art,
            contentStatusSignal: signal(art.contentStatus),
          }));
          this.articles.update((curr) => [...curr, ...newReactive]);
          this.currentPage.set(nextPage);

          const totalLoaded = nextPage * this.pageSize();
          this.hasMore.set(totalLoaded < res.totalCount);

          this.isLoadingMore.set(false);
        },
        error: () => this.isLoadingMore.set(false),
      });
  }

  private initializeArticles(): void {
    this.isLoading.set(true);

    this.productService
      .getArticles(this.currentPage(), this.pageSize(), this.searchTerm())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          const reactiveArticles: ReactiveArticle[] = response.items.map((art) => ({
            ...art,
            contentStatusSignal: signal(art.contentStatus),
          }));

          this.articles.set(reactiveArticles);
          this.totalItems.set(response.totalCount);
          this.isLoading.set(false);
        },
      });
  }

  private setupSearchSubscription(): void {
    this.searchSubject
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((term) => {
        this.searchTerm.set(term);
        this.currentPage.set(1);
        this.initializeArticles();
      });
  }

  private setupInfiniteScroll(): void {
    setTimeout(() => {
      const sentinel = this.sentinelElement()?.nativeElement;
      if (!sentinel) return;

      this.intersectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && this.hasMore() && !this.isLoadingMore()) {
              this.loadMore();
            }
          });
        },
        { rootMargin: '100px' },
      );

      this.intersectionObserver.observe(sentinel);
    });
  }
}
