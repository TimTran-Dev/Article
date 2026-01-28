import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewsListComponent } from './news-list.component';
import { ProductsService } from '../../../Services/Products/products.service';
import { ToastService } from '../../../Services/Toast/toast.service';
import { NavigationService } from '../../../Services/NavigationService/navigation.service';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

// Import your dedicated mock files
import { createArticleMock } from '../../../Mocks/article.mock';
import { createToastServiceMock } from '../../../Mocks/toast.service.mock';
import { createProductsServiceMock } from '../../../Mocks/product.service.mock';
import { createNavigationServiceMock } from '../../../Mocks/nav.service.mock';

describe('NewsListComponent', () => {
  let component: NewsListComponent;
  let fixture: ComponentFixture<NewsListComponent>;

  // Use the return types of your factory functions for strict typing
  let mockProductService: ReturnType<typeof createProductsServiceMock>;
  let mockToastService: ReturnType<typeof createToastServiceMock>;
  let mockNavService: ReturnType<typeof createNavigationServiceMock>;

  const mockArticleResponse = {
    items: [createArticleMock()],
    totalCount: 1,
  };

  beforeEach(async () => {
    // Initialize fresh mocks for every test
    mockProductService = createProductsServiceMock();
    mockToastService = createToastServiceMock();
    mockNavService = createNavigationServiceMock();

    // Setup the default successful response for initialization
    mockProductService.getArticles.mockReturnValue(of(mockArticleResponse));

    await TestBed.configureTestingModule({
      imports: [NewsListComponent, NoopAnimationsModule],
      providers: [
        { provide: ProductsService, useValue: mockProductService },
        { provide: ToastService, useValue: mockToastService },
        { provide: NavigationService, useValue: mockNavService },
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NewsListComponent);
    component = fixture.componentInstance;
  });

  it('should create and initialize articles on init', () => {
    fixture.detectChanges(); // triggers ngOnInit

    expect(component.isLoading()).toBe(false);
    expect(component.articles().length).toBe(1);
    expect(mockProductService.getArticles).toHaveBeenCalled();
  });

  describe('Search Logic', () => {
    it('should update search term and reload articles after debounce', async () => {
      // 1. Setup Vitest Fake Timers
      vi.useFakeTimers();
      fixture.detectChanges(); // ngOnInit

      const newSearchTerm = 'Angular Testing';

      // 2. Trigger Search
      component.onSearch({ target: { value: newSearchTerm } } as any);

      // 3. Verify debounce is active (term not updated yet)
      expect(component.searchTerm()).toBe('');

      // 4. Advance time by 400ms
      vi.advanceTimersByTime(400);

      // 5. Important: flush microtasks so the RxJS debounce emits
      await Promise.resolve();

      expect(component.searchTerm()).toBe(newSearchTerm);
      expect(component.currentPage()).toBe(1);

      // Total calls: 1 (init) + 1 (search) = 2
      expect(mockProductService.getArticles).toHaveBeenCalledTimes(2);

      vi.useRealTimers();
    });
  });

  describe('Modal Management', () => {
    it('should open delete modal and set article ID', () => {
      const idToDelete = 99;
      component.openDeleteModal(idToDelete);

      expect(component.showModal()).toBe(true);
      expect(component.articleToDeleteId()).toBe(idToDelete);
    });

    it('should remove article from list upon successful deletion', () => {
      fixture.detectChanges();
      const article = component.articles()[0];
      component.articleToDeleteId.set(article.id);

      // Ensure the delete call returns success
      mockProductService.deleteArticle.mockReturnValue(of(undefined));

      component.handleDelete();

      expect(mockProductService.deleteArticle).toHaveBeenCalledWith(article.id);
      expect(component.articles().length).toBe(0);
      expect(mockToastService.show).toHaveBeenCalledWith('Article removed', 'success');
    });

    it('should open edit modal and set selected article', () => {
      const article = createArticleMock();
      component.openEditModal(article);

      expect(component.selectedArticle()).toEqual(article);
      expect(component.showEditModal()).toBe(true);
    });
  });

  describe('Pagination', () => {
    it('should load more articles and append to existing list', () => {
      fixture.detectChanges();
      const initialCount = component.articles().length;

      const secondPageArticle = createArticleMock();
      secondPageArticle.id = 2;

      mockProductService.getArticles.mockReturnValue(
        of({
          items: [secondPageArticle],
          totalCount: 2,
        }),
      );

      component.loadMore();

      expect(component.isLoadingMore()).toBe(false);
      expect(component.articles().length).toBe(initialCount + 1);
      expect(component.currentPage()).toBe(2);
    });

    it('should set hasMore to false if response items are less than page size', () => {
      fixture.detectChanges();
      component.pageSize.set(10);

      mockProductService.getArticles.mockReturnValue(
        of({
          items: [createArticleMock()],
          totalCount: 1,
        }),
      );

      component.loadMore();

      expect(component.hasMore()).toBe(false);
    });
  });
});
