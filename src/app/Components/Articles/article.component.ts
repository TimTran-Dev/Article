import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { Content } from '../../Models/content.interface';
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

@Component({
  selector: 'app-article',
  template: `
    <!-- article.component.html -->

    <!-- Header Section -->
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-8">
            <a routerLink="/" class="text-2xl font-bold text-gray-900"> NewsApp </a>
            <div class="hidden md:flex space-x-6">
              <a
                routerLink="/"
                routerLinkActive="text-blue-600 border-b-2 border-blue-600"
                [routerLinkActiveOptions]="{ exact: true }"
                class="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                Home
              </a>
              <a
                routerLink="/articles"
                routerLinkActive="text-blue-600 border-b-2 border-blue-600"
                class="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                Articles
              </a>
              <a
                routerLink="/segments"
                routerLinkActive="text-blue-600 border-b-2 border-blue-600"
                class="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                Segments
              </a>
              <a
                routerLink="/episodes"
                routerLinkActive="text-blue-600 border-b-2 border-blue-600"
                class="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                Episodes
              </a>
            </div>
          </div>

          <div class="flex items-center space-x-4">
            <button class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
              Search
            </button>
            <button
              (click)="openCreateModal()"
              class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-sm active:scale-95"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span class="font-semibold text-sm">New Article</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
    <div class="bg-gray-50 py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Navigation Bar -->
        <div class="mb-8">
          <h1 class="text-4xl font-bold text-gray-900 mb-2">Articles</h1>
          <p class="text-gray-600 text-lg">Manage and review your article content</p>
        </div>

        <div class="relative max-w-md mb-6">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              class="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            [value]="searchTerm()"
            (input)="onSearch($event)"
            placeholder="Search titles or descriptions..."
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
          />
        </div>

        <!-- Filter/Actions Bar -->
        <div
          class="flex items-center justify-between mt-8 p-4 bg-white rounded-lg shadow-sm border border-gray-200"
        >
          <div class="flex items-center space-x-4">
            <span class="text-sm font-medium text-gray-700">Filter by status:</span>
            <button
              class="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              All
            </button>
            <button
              class="px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              Draft
            </button>
            <button
              class="px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              Review
            </button>
            <button
              class="px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              Published
            </button>
          </div>

          <div class="flex items-center space-x-6">
            <div class="flex items-center space-x-3">
              <span class="text-sm font-medium text-gray-700">Per page:</span>
              <tap-dropdown
                [options]="[5, 10, 25, 50]"
                [selectedValue]="pageSize()"
                (selectionChange)="onPageSizeChange($event)"
              ></tap-dropdown>
            </div>

            <div class="text-right border-l pl-6 border-gray-200">
              <span class="block text-sm font-bold text-gray-900">{{ totalItems() }} Articles</span>
              <!-- <span class="block text-xs text-gray-500">Page {{ currentPage() }}</span> -->
            </div>

            <!-- <span class="text-sm text-gray-500">{{ article().length }} articles</span> -->
          </div>
        </div>
      </div>
    </div>

    @if (isLoading()) {
      <tap-loading loadingText="Loading articles..."></tap-loading>
    }

    @if (!isLoading()) {
      <div class="min-h-screen bg-gray-50">
        <!-- Main Content -->
        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <!-- Articles List -->
          <div class="space-y-4">
            @for (product of article(); track product.id) {
              @if ('author' in product.content) {
                <article
                  class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <!-- Article Header -->
                  <div class="flex items-start justify-between mb-4 p-6">
                    <div class="flex-1">
                      <div class="flex items-center space-x-3 mb-2">
                        <span
                          class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          Article
                        </span>
                        <!-- <span class="text-xs text-gray-500">ID: {{ product.id }}</span> -->
                      </div>
                      <h2 class="text-2xl font-bold text-gray-900 mb-2">
                        {{ product.content.title }}
                      </h2>
                      <div class="flex items-center space-x-2 text-sm text-gray-600">
                        <div
                          class="flex items-center justify-center w-6 h-6 rounded-full bg-linear-to-br from-blue-500 to-blue-600 text-white text-xs font-medium"
                        >
                          {{ product.content.author.charAt(0).toUpperCase() }}
                        </div>
                        <span>{{ product.content.author }}</span>
                      </div>
                    </div>

                    <!-- Status Dropdown -->
                    <div class="ml-4">
                      <tap-dropdown
                        [options]="contentStatus"
                        [selectedValue]="product.contentStatusSignal()"
                        (selectionChange)="product.contentStatusSignal.set($event)"
                      ></tap-dropdown>
                    </div>
                  </div>
                  @if (product.content.imageUrl) {
                    <img
                      [src]="product.content.imageUrl"
                      alt="Article thumbnail"
                      class="w-full h-auto block max-h-100 object-contain"
                    />
                  }
                  <div class="p-6">
                    <!-- Article Description -->
                    <p class="text-gray-700 mb-4 leading-relaxed">
                      {{ product.content.body }}
                    </p>

                    <!-- Article Preview/Body (truncated) -->
                    @if (product.content.content) {
                      <div class="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <p class="text-sm text-gray-600 line-clamp-3">
                          {{ product.content.content }}
                        </p>
                      </div>
                    }

                    <!-- Article Footer -->
                    <div class="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div class="flex items-center space-x-4">
                        @if (product.ownerId) {
                          <span class="text-sm text-gray-500">Owner ID: {{ product.ownerId }}</span>
                        }
                      </div>

                      <div class="flex items-center space-x-3">
                        <button
                          (click)="openEditModal(product)"
                          class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Edit
                        </button>
                        <tap-button
                          buttonText="Delete"
                          (click)="openDeleteModal(product.id)"
                        ></tap-button>
                        <a
                          class="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                          [href]="product.url"
                          target="_blank"
                        >
                          View Full Article →
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
              }
            }
          </div>

          <!-- Empty State -->
          @if (article().length === 0) {
            <div class="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
              <div
                class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4"
              >
                <svg
                  class="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  ></path>
                </svg>
              </div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">No articles yet</h3>
              <p class="text-gray-500 mb-6">Start by creating your first article.</p>
              <button
                class="px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Article
              </button>
            </div>
          }
        </main>

        @if (showModal()) {
          <tap-modal (confirmed)="handleDelete()" (cancelled)="closeModal()"></tap-modal>
        }

        @if (showEditModal()) {
          <tap-edit-modal
            [editArticle]="selectedArticle()"
            [isLoading]="isEditLoading()"
            (confirm)="handleFormSubmit($event)"
            (closeModal)="closeEditModal()"
          >
          </tap-edit-modal>
        }

        <!-- Router Outlet for Child Routes -->
        <router-outlet></router-outlet>
      </div>
    }
  `,
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
  article = signal<(Content & { contentStatusSignal: WritableSignal<ContentStatus> })[]>([]);
  isLoading = signal(false);

  searchTerm = signal('');

  pageSize = signal(10);
  currentPage = signal(1);
  totalItems = signal(0);

  showModal = signal(false);
  articleToDeleteId = signal(0);

  showEditModal = signal(false);
  selectedArticle = signal<Content | null>(null);
  isEditLoading = signal(false);

  contentStatus: ContentStatus[] = Object.values(ContentStatus);

  productService = inject(ProductsService);
  toastService = inject(ToastService);

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    // Initialization logic here
    this.initializeArticles();
    this.setupSearchSubscription();
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchSubject.next(input.value);
  }

  onStatusChange(newStatus: string): void {
    console.log('Status changed:', newStatus);
  }

  openDeleteModal(id: number): void {
    this.articleToDeleteId.set(id);
    this.showModal.set(true);
  }

  handleUpdate(formData: any) {
    const { id, ...dto } = formData;
    this.isEditLoading.set(true);

    this.productService.updateArticle(id, dto).subscribe({
      next: () => {
        // Update the signal locally so the UI refreshes instantly
        this.article.update((currentArticles) =>
          currentArticles.map((item) => {
            if (item.id === id) {
              // 1. Update the wrapper properties (Content interface)
              const updatedWrapper = {
                ...item,
                description: dto.description,
                url: dto.url,
              };

              // 2. Type Guard: Only update nested fields if it's an Article
              if (updatedWrapper.content && 'author' in updatedWrapper.content) {
                updatedWrapper.content = {
                  ...updatedWrapper.content,
                  title: dto.title,
                  author: dto.author,
                  imageUrl: dto.urlToImage,
                  body: dto.content, // Mapping form 'content' to model 'body'
                };
              }
              return updatedWrapper;
            }
            return item;
          }),
        );

        this.toastService.show('Article updated successfully!', 'success');
        this.closeEditModal();
      },
      error: (err) => {
        this.isEditLoading.set(false);
        this.toastService.show('Failed to save changes.', 'error');
      },
    });
  }

  handleDelete(): void {
    const id = this.articleToDeleteId();

    if (id > 0) {
      this.productService.deleteArticle(id).subscribe({
        next: () => {
          this.article.update((currentArticles) => currentArticles.filter((a) => a.id != id));

          this.totalItems.update((total) => total - 1);

          this.closeModal();

          this.toastService.show('Article successfully deleted!', 'success');
        },
        error: (err) => {
          this.toastService.show('Failed to delete article. Please try again.', 'error');
          this.closeModal();
        },
      });
    }
  }

  // In ArticleComponent.ts

  openCreateModal(): void {
    this.selectedArticle.set(null); // Setting to null triggers "Create" mode in modal
    this.showEditModal.set(true);
    console.log('opened modal');
  }

  // article.component.ts

  // 1. Logic to coordinate between Create and Update
  handleFormSubmit(formData: any) {
    if (this.selectedArticle()) {
      // If we have a selected article, we are updating
      this.handleUpdate(formData);
    } else {
      // If selectedArticle is null, we are creating
      this.handleCreate(formData);
    }
  }

  // 2. Logic to handle the POST request
  handleCreate(formData: any) {
    this.isEditLoading.set(true);

    // Map form data to NewsArticleCreateDto
    const createDto: NewsArticleCreateDto = {
      title: formData.title,
      url: formData.url,
      author: formData.author,
      description: formData.description,
      urlToImage: formData.urlToImage,
      content: formData.content,
      sourceId: formData.sourceId || 'manual',
      sourceName: formData.sourceName || 'User Contributed',
    };

    this.productService.createArticle(createDto).subscribe({
      next: () => {
        this.toastService.show('Article created successfully!', 'success');

        // Refresh the list to show the new article (usually at the top)
        this.currentPage.set(1);
        this.initializeArticles();

        this.closeEditModal();
      },
      error: (err) => {
        this.isEditLoading.set(false);
        // Handle the "Url already exists" error from your C# repository
        const message =
          err.status === 400
            ? 'An article with this URL already exists.'
            : 'Failed to create article.';
        this.toastService.show(message, 'error');
      },
    });
  }

  openEditModal(product: any): void {
    this.selectedArticle.set(product);
    this.showEditModal.set(true);
  }

  closeEditModal(): void {
    this.showEditModal.set(false);
    this.selectedArticle.set(null);
    this.isEditLoading.set(false);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.articleToDeleteId.set(0);
  }

  public onPageSizeChange(newSize: string | number): void {
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
        next: (articleItems) => {
          const reactiveArticles = articleItems.items.map((content) => ({
            ...content,
            contentStatusSignal: signal(content.contentStatus),
          }));

          this.article.set(reactiveArticles);
          this.totalItems.set(articleItems.totalCount);
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
