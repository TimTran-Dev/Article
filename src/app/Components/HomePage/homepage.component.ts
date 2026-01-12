import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Content } from '../../Models/content.interface';
import { ProductsService } from '../../Services/products.service';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { LoadingComponent } from '../Tapestry/Loading/loading.component';

@Component({
  selector: 'app-homepage',
  template: `
    <!-- homepage.component.html -->

    @if (isLoading()) {
      <tap-loading loadingText="Loading homepage..."></tap-loading>
    }

    @if (!isLoading()) {
      <div class="min-h-screen bg-gray-50">
        <!-- Navigation Bar -->
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

              <!-- Optional: User actions -->
              <div class="flex items-center space-x-4">
                <button class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                  Search
                </button>
                <button
                  class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  New Article
                </button>
              </div>
            </div>
          </div>
        </nav>

        <!-- Main Content -->
        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <!-- Header Section -->
          <div class="mb-8">
            <h1 class="text-4xl font-bold text-gray-900 mb-2">Featured Content</h1>
            <p class="text-gray-600 text-lg">
              Discover the latest articles, segments, and episodes
            </p>
          </div>

          <!-- Filter/Sort Bar -->
          <div
            class="flex items-center justify-between mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200"
          >
            <div class="flex items-center space-x-4">
              <span class="text-sm font-medium text-gray-700">Filter by:</span>
              <button
                class="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                All Types
              </button>
              <button
                class="px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                Articles
              </button>
              <button
                class="px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                Segments
              </button>
              <button
                class="px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                Episodes
              </button>
            </div>
            <span class="text-sm text-gray-500">{{ featuredProducts().length }} items</span>
          </div>

          <!-- Featured Products Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (product of featuredProducts(); track product.id) {
              <article
                class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              >
                <!-- Content Type Badge -->
                <div class="p-4 pb-3">
                  <div class="flex items-center justify-between mb-3">
                    <span
                      class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                  {{
                        product.contentType === 'Article'
                          ? 'bg-blue-100 text-blue-800'
                          : product.contentType === 'Segment'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-green-100 text-green-800'
                      }}"
                    >
                      {{ product.contentType }}
                    </span>

                    <!-- Status Badge -->
                    <span
                      class="inline-flex items-center px-2 py-1 rounded text-xs font-medium
                  {{
                        product.contentStatus === 'Published'
                          ? 'bg-green-50 text-green-700 border border-green-200'
                          : product.contentStatus === 'Review'
                            ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                            : 'bg-gray-50 text-gray-700 border border-gray-200'
                      }}"
                    >
                      {{ product.contentStatus }}
                    </span>
                  </div>

                  <!-- Article Content -->
                  @if (product.contentType === 'Article' && 'author' in product.content) {
                    <h3 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {{ product.content.title }}
                    </h3>

                    <p class="text-gray-600 text-sm mb-4 line-clamp-3">
                      {{ product.description }}
                    </p>

                    <div class="flex items-center space-x-2 pt-3 border-t border-gray-100">
                      <div
                        class="flex items-center justify-center w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-blue-600 text-white text-sm font-medium"
                      >
                        {{ product.content.author.charAt(0).toUpperCase() }}
                      </div>
                      <div>
                        <p class="text-sm font-medium text-gray-900">
                          {{ product.content.author }}
                        </p>
                        <p class="text-xs text-gray-500">Author</p>
                      </div>
                    </div>
                  }

                  <!-- Segment Content -->
                  @if (product.contentType === 'Segment' && 'name' in product.content) {
                    <h3 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {{ product.content.name }}
                    </h3>

                    <p class="text-gray-600 text-sm mb-4 line-clamp-3">
                      {{ product.description }}
                    </p>

                    <div class="pt-3 border-t border-gray-100">
                      <div class="flex items-center justify-between">
                        <span class="text-xs text-gray-500">Content Items</span>
                        <span
                          class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700"
                        >
                          {{ product.content.contents.length || 0 }}
                        </span>
                      </div>
                    </div>
                  }

                  <!-- Episode Content -->
                  @if (product.contentType === 'Episode' && 'segments' in product.content) {
                    <h3 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {{ product.content.title }}
                    </h3>

                    <p class="text-gray-600 text-sm mb-4 line-clamp-3">
                      {{ product.description }}
                    </p>

                    <div class="pt-3 border-t border-gray-100">
                      <div class="flex items-center justify-between">
                        <span class="text-xs text-gray-500">Segments</span>
                        <span
                          class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700"
                        >
                          {{ product.content.segments.length || 0 }}
                        </span>
                      </div>
                    </div>
                  }
                </div>

                <!-- Card Footer -->
                <div class="px-4 py-3 bg-gray-50 border-t border-gray-100">
                  <div class="flex items-center justify-between">
                    <span class="text-xs text-gray-500"> ID: {{ product.id }} </span>
                    <button
                      class="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                      View Details →
                    </button>
                  </div>
                </div>
              </article>
            }
          </div>

          <!-- Empty State -->
          @if (featuredProducts().length === 0) {
            <div class="text-center py-12">
              <div
                class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4"
              >
                <svg
                  class="w-8 h-8 text-gray-400"
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
              <h3 class="text-lg font-medium text-gray-900 mb-2">No content available</h3>
              <p class="text-gray-500 mb-6">
                Get started by creating your first article, segment, or episode.
              </p>
              <button
                class="px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Content
              </button>
            </div>
          }
        </main>

        <!-- Router Outlet for Child Routes -->
        <router-outlet></router-outlet>
      </div>
    }
  `,
  standalone: true,
  imports: [RouterModule, LoadingComponent],
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
