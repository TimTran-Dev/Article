import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { Article } from '../../Models/content.interface';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { ProductsService } from '../../Services/Products/products.service';
import { RouterModule } from '@angular/router';
import { DropdownComponent } from '../Tapestry/Dropdown/dropdown.component';
import { ContentStatus } from '../../Models/common.enum';
import { LoadingComponent } from '../Tapestry/Loading/loading.component';
import { ButtonComponent } from '../Tapestry/Button/button.component';
import { ToastService } from '../../Services/Toast/toast.service';
import { ModalComponent } from '../Tapestry/Modal/Confirm/modal.component';
import { EditModalComponent } from '../Tapestry/Modal/Edit/edit.component';
import { NewsArticleCreateDto } from '../../Models/NewsArticleCreate.interface';

/**
 * Local interface for the reactive table state.
 * No nested 'content' property—everything is top-level.
 */
interface ReactiveArticle extends Article {
  contentStatusSignal: WritableSignal<ContentStatus>;
}

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  standalone: true,
  imports: [
    RouterModule,
    DropdownComponent,
    LoadingComponent,
    ModalComponent,
    ButtonComponent,
    EditModalComponent,
  ],
})
export class ArticleComponent implements OnInit, OnDestroy {
  // Now strictly Article-based
  article = signal<ReactiveArticle[]>([]);
  isLoading = signal(false);
  searchTerm = signal('');

  // Pagination
  pageSize = signal(10);
  currentPage = signal(1);
  totalItems = signal(0);

  // Modals
  showModal = signal(false);
  articleToDeleteId = signal(0);
  showEditModal = signal(false);
  selectedArticle = signal<Article | null>(null);
  isEditLoading = signal(false);

  contentStatus: ContentStatus[] = Object.values(ContentStatus);

  private readonly productService = inject(ProductsService);
  private readonly toastService = inject(ToastService);

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.initializeArticles();
    this.setupSearchSubscription();
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchSubject.next(input.value);
  }

  handleFormSubmit(eventData: object): void {
    const formData = eventData as Record<string, unknown>;
    const current = this.selectedArticle();

    if (current) {
      // Update Mode
      const updatedArticle = this.mapFormToArticle(formData, current);
      this.handleUpdate(updatedArticle);
    } else {
      // Create Mode
      const createDto = this.mapFormToDto(formData);
      this.handleCreate(createDto);
    }
  }

  handleUpdate(dto: Article): void {
    const id = dto.id;
    this.isEditLoading.set(true);

    // Create a clean DTO that ensures 'url' is a string
    const updateDto = {
      ...dto,
      url: dto.url ?? '', // Fallback to empty string if undefined
      // If your API expects 'urlToImage' instead of 'imageUrl', map it here:
      urlToImage: dto.imageUrl,
    };

    this.productService.updateArticle(id, updateDto).subscribe({
      next: () => {
        this.article.update((current) =>
          current.map((item) => (item.id === id ? { ...item, ...dto } : item)),
        );
        this.toastService.show('Article updated successfully!', 'success');
        this.closeEditModal();
      },
      error: () => {
        this.isEditLoading.set(false);
        this.toastService.show('Failed to save changes.', 'error');
      },
    });
  }

  handleCreate(dto: NewsArticleCreateDto): void {
    this.isEditLoading.set(true);

    this.productService.createArticle(dto).subscribe({
      next: () => {
        this.toastService.show('Article created successfully!', 'success');
        this.currentPage.set(1);
        this.initializeArticles();
        this.closeEditModal();
      },
      error: (err) => {
        this.isEditLoading.set(false);
        const message = err.status === 400 ? 'URL already exists.' : 'Creation failed.';
        this.toastService.show(message, 'error');
      },
    });
  }

  handleDelete(): void {
    const id = this.articleToDeleteId();
    if (id <= 0) return;

    this.productService.deleteArticle(id).subscribe({
      next: () => {
        this.article.update((items) => items.filter((a) => a.id !== id));
        this.totalItems.update((total) => total - 1);
        this.closeModal();
        this.toastService.show('Article deleted!', 'success');
      },
      error: () => {
        this.toastService.show('Delete failed.', 'error');
        this.closeModal();
      },
    });
  }

  // Modal Controls
  openEditModal(article: Article): void {
    this.selectedArticle.set(article);
    this.showEditModal.set(true);
  }

  openCreateModal(): void {
    this.selectedArticle.set(null);
    this.showEditModal.set(true);
  }

  closeEditModal(): void {
    this.showEditModal.set(false);
    this.selectedArticle.set(null);
    this.isEditLoading.set(false);
  }

  openDeleteModal(id: number): void {
    this.articleToDeleteId.set(id);
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.articleToDeleteId.set(0);
  }

  onPageSizeChange(newSize: string | number): void {
    this.pageSize.set(Number(newSize));
    this.currentPage.set(1);
    this.initializeArticles();
  }

  private initializeArticles(): void {
    this.isLoading.set(true);

    this.productService
      .getArticles(this.currentPage(), this.pageSize(), this.searchTerm())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          // response.items is Article[]
          const reactiveArticles: ReactiveArticle[] = response.items.map((art) => ({
            ...art,
            contentStatusSignal: signal(art.contentStatus),
          }));

          this.article.set(reactiveArticles);
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

  private mapFormToDto(formData: Record<string, unknown>): NewsArticleCreateDto {
    return {
      title: String(formData['title'] ?? ''),
      author: String(formData['author'] ?? ''),
      description: String(formData['description'] ?? ''),
      url: String(formData['url'] ?? ''),
      urlToImage: String(formData['urlToImage'] ?? ''),
      content: String(formData['content'] ?? ''),
      sourceId: String(formData['sourceId'] ?? 'manual'),
      sourceName: String(formData['sourceName'] ?? 'User Contributed'),
    };
  }

  private mapFormToArticle(formData: Record<string, unknown>, existing: Article): Article {
    const getString = (key: string, fallback: string = ''): string =>
      String(formData[key] ?? fallback);

    return {
      ...existing,
      description: getString('description'),
      url: getString('url'),
      title: getString('title'),
      author: getString('author'),
      body: getString('content'), // Remap content -> body
      imageUrl: getString('urlToImage'), // Remap urlToImage -> imageUrl
      sourceId: getString('sourceId', 'manual'),
      sourceName: getString('sourceName', 'User Contributed'),
      content: getString('content'), // satisfy interface 'content' field
    };
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
