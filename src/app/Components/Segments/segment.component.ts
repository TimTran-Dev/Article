import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { DropdownComponent } from '../Tapestry/Dropdown/dropdown.component';
import { RouterModule } from '@angular/router';
import { LoadingComponent } from '../Tapestry/Loading/loading.component';
import { ContentStatus } from '../../Models/common.enum';
import { Content } from '../../Models/content.interface';
import { ProductsService } from '../../Services/products.service';
import { map, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-segment',
  template: ` <!-- segment.component.html -->

    @if (isLoading()) {
      <tap-loading loadingText="Loading segments..."></tap-loading>
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

              <div class="flex items-center space-x-4">
                <button class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                  Search
                </button>
                <button
                  class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  New Segments
                </button>
              </div>
            </div>
          </div>
        </nav>

        <!-- Main Content -->
        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <!-- Header Section -->
          <div class="mb-8">
            <h1 class="text-4xl font-bold text-gray-900 mb-2">Segments</h1>
            <p class="text-gray-600 text-lg">Manage and review your segment content</p>
          </div>

          <!-- Filter/Actions Bar -->
          <div
            class="flex items-center justify-between mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200"
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
            <span class="text-sm text-gray-500">{{ segment().length }} segments</span>
          </div>

          <!-- Segment List -->
          <div class="space-y-4">
            @for (product of segment(); track product.id) {
              @if ('name' in product.content) {
                <article
                  class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div class="p-6">
                    <!-- Segment Header -->
                    <div class="flex items-start justify-between mb-4">
                      <div class="flex-1">
                        <div class="flex items-center space-x-3 mb-2">
                          <span
                            class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            Segment
                          </span>
                          <span class="text-xs text-gray-500">ID: {{ product.id }}</span>
                        </div>
                        <h2 class="text-2xl font-bold text-gray-900 mb-2">
                          {{ product.content.name }}
                        </h2>
                        <div class="flex items-center space-x-2 text-sm text-gray-600">
                          <div
                            class="flex items-center justify-center w-6 h-6 rounded-full bg-linear-to-br from-blue-500 to-blue-600 text-white text-xs font-medium"
                          >
                            {{ product.content.host.charAt(0).toUpperCase() }}
                          </div>
                          <span>{{ product.content.host }}</span>
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

                    <!-- Segment Description -->
                    <p class="text-gray-700 mb-4 leading-relaxed">
                      {{ product.description }}
                    </p>

                    <!-- Segment Preview/Body (truncated) -->
                    <!-- @if (product.content.body) {
                      <div class="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <p class="text-sm text-gray-600 line-clamp-3">
                          {{ product.content.body }}
                        </p>
                      </div>
                    } -->

                    <!-- Segment Footer -->
                    <div class="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div class="flex items-center space-x-4">
                        <!-- @if (product.content.imageUrl) {
                          <div class="flex items-center space-x-2 text-sm text-gray-500">
                            <svg
                              class="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              ></path>
                            </svg>
                            <span>Has image</span>
                          </div>
                        } -->
                        @if (product.ownerId) {
                          <span class="text-sm text-gray-500">Owner ID: {{ product.ownerId }}</span>
                        }
                      </div>

                      <div class="flex items-center space-x-3">
                        <button
                          class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          class="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          View Full Segment →
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              }
            }
          </div>

          <!-- Empty State -->
          @if (segment().length === 0) {
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
              <h3 class="text-lg font-medium text-gray-900 mb-2">No segments yet</h3>
              <p class="text-gray-500 mb-6">Start by creating your first segment.</p>
              <button
                class="px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Segment
              </button>
            </div>
          }
        </main>

        <!-- Router Outlet for Child Routes -->
        <router-outlet></router-outlet>
      </div>
    }`,
  standalone: true,
  imports: [RouterModule, DropdownComponent, LoadingComponent],
})
export class SegmentComponent implements OnInit, OnDestroy {
  segment = signal<(Content & { contentStatusSignal: WritableSignal<ContentStatus> })[]>([]);
  isLoading = signal(false);
  contentStatus: ContentStatus[] = Object.values(ContentStatus);

  productService = inject(ProductsService);

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.initializeSegments();
  }

  onStatusChange(newStatus: string): void {
    console.log('Status changed:', newStatus);
  }

  private initializeSegments(): void {
    this.isLoading.set(true);

    this.productService
      .getFeaturedProducts()
      .pipe(
        takeUntil(this.destroy$),
        map((items) => items.filter((item) => item.contentType === 'Segment')),
      )
      .subscribe({
        next: (segmentItems) => {
          const reactiveSegments = segmentItems.map((content) => ({
            ...content,
            contentStatusSignal: signal(content.contentStatus),
          }));
          this.segment.set(reactiveSegments);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.log('Error fetching segments:', error);
          this.isLoading.set(false);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
