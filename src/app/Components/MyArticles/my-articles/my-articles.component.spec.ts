import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MyArticlesComponent } from './my-articles.component';
import { UserArticleService } from '../../../Services/MyArticles/user-article.service';
import { ProductsService } from '../../../Services/Products/products.service';
import { ToastService } from '../../../Services/Toast/toast.service';
import { BookmarkService } from '../../../Services/Bookmark/bookmark.service';
import { of, throwError } from 'rxjs';
import { Article } from '../../../Models/content.interface';
import { ContentStatus } from '../../../Models/common.enum';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { createIntersectionObserverMock } from '../../../Mocks/intersectionObserver.mock';

describe('MyArticlesComponent', () => {
  let component: MyArticlesComponent;
  let fixture: ComponentFixture<MyArticlesComponent>;
  let userArticleService: ReturnType<typeof createUserArticleServiceMock>;
  let productService: ReturnType<typeof createProductsServiceMock>;
  let toastService: ReturnType<typeof createToastServiceMock>;
  let bookmarkService: ReturnType<typeof createBookmarkServiceMock>;

  const mockArticles: Article[] = [
    {
      id: 1,
      title: 'Test Article 1',
      description: 'Test Description 1',
      author: 'Author 1',
      url: 'https://example.com/1',
      imageUrl: 'https://example.com/image1.jpg',
      body: 'Body content 1',
      contentStatus: ContentStatus.Published,
      content: 'Content 1',
      isBookmarked: false,
      isDeleted: false,
      sourceName: 'Source 1',
      contentType: 'Article',
      ownerId: 1,
    },
    {
      id: 2,
      title: 'Test Article 2',
      description: 'Test Description 2',
      author: 'Author 2',
      url: 'https://example.com/2',
      imageUrl: 'https://example.com/image2.jpg',
      body: 'Body content 2',
      contentStatus: ContentStatus.Published,
      content: 'Content 2',
      isBookmarked: false,
      isDeleted: false,
      sourceName: 'Source 2',
      contentType: 'Article',
      ownerId: 1,
    },
  ];

  function createUserArticleServiceMock() {
    return {
      getUserArticles: vi.fn().mockReturnValue(of({ items: [], totalCount: 0 })),
    };
  }

  function createProductsServiceMock() {
    return {
      createArticle: vi.fn().mockReturnValue(of(undefined)),
      updateArticle: vi.fn().mockReturnValue(of(undefined)),
      deleteArticle: vi.fn().mockReturnValue(of(undefined)),
    };
  }

  function createToastServiceMock() {
    return {
      show: vi.fn(),
    };
  }

  function createBookmarkServiceMock() {
    return {
      toggleBookmark: vi.fn().mockReturnValue(of({ bookmarked: true })),
    };
  }

  beforeEach(async () => {
    global.IntersectionObserver = createIntersectionObserverMock();

    userArticleService = createUserArticleServiceMock();
    productService = createProductsServiceMock();
    toastService = createToastServiceMock();
    bookmarkService = createBookmarkServiceMock();

    await TestBed.configureTestingModule({
      imports: [MyArticlesComponent, HttpClientTestingModule, NoopAnimationsModule],
      providers: [
        { provide: UserArticleService, useValue: userArticleService },
        { provide: ProductsService, useValue: productService },
        { provide: ToastService, useValue: toastService },
        { provide: BookmarkService, useValue: bookmarkService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MyArticlesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should load user articles on init', () => {
      userArticleService.getUserArticles.mockReturnValue(
        of({ items: mockArticles, totalCount: 2 }),
      );

      fixture.detectChanges();

      expect(userArticleService.getUserArticles).toHaveBeenCalledWith(1, 10, '');
      expect(component.articles().length).toBe(2);
      expect(component.totalItems()).toBe(2);
    });

    it('should initialize with loading state', () => {
      userArticleService.getUserArticles.mockReturnValue(
        of({ items: mockArticles, totalCount: 2 }),
      );

      fixture.detectChanges();

      expect(userArticleService.getUserArticles).toHaveBeenCalled();
    });
  });

  describe('Edit Functionality', () => {
    it('should open edit modal with article', () => {
      component.openEditModal(mockArticles[0]);

      expect(component.showEditModal()).toBe(true);
      expect(component.selectedArticle()).toEqual(mockArticles[0]);
    });

    it('should close edit modal', () => {
      component.showEditModal.set(true);
      component.selectedArticle.set(mockArticles[0]);

      component.closeEditModal();

      expect(component.showEditModal()).toBe(false);
      expect(component.selectedArticle()).toBeNull();
    });

    it('should handle update submission', () => {
      userArticleService.getUserArticles.mockReturnValue(
        of({ items: mockArticles, totalCount: 2 }),
      );
      productService.updateArticle.mockReturnValue(of(void 0));

      fixture.detectChanges();
      component.handleUpdate(mockArticles[0]);

      expect(productService.updateArticle).toHaveBeenCalledWith(1, expect.any(Object));
      expect(toastService.show).toHaveBeenCalledWith('Article updated successfully!', 'success');
    });

    it('should handle update error', () => {
      productService.updateArticle.mockReturnValue(throwError(() => new Error('Update failed')));

      component.handleUpdate(mockArticles[0]);

      expect(toastService.show).toHaveBeenCalledWith('Failed to save changes.', 'error');
    });
  });

  describe('Delete Functionality', () => {
    it('should open delete modal with article id', () => {
      component.openDeleteModal(1);

      expect(component.showModal()).toBe(true);
      expect(component.articleToDeleteId()).toBe(1);
    });

    it('should close delete modal', () => {
      component.showModal.set(true);
      component.articleToDeleteId.set(1);

      component.closeDeleteModal();

      expect(component.showModal()).toBe(false);
      expect(component.articleToDeleteId()).toBe(0);
    });

    it('should handle delete submission', () => {
      userArticleService.getUserArticles.mockReturnValue(
        of({ items: mockArticles, totalCount: 2 }),
      );
      productService.deleteArticle.mockReturnValue(of(void 0));

      fixture.detectChanges();
      component.openDeleteModal(1);
      component.handleDelete();

      expect(productService.deleteArticle).toHaveBeenCalledWith(1);
      expect(toastService.show).toHaveBeenCalledWith('Article removed', 'success');
    });
  });

  describe('Create Functionality', () => {
    it('should open create modal', () => {
      component.openCreateModal();

      expect(component.showEditModal()).toBe(true);
      expect(component.selectedArticle()).toBeNull();
    });

    it('should handle create submission', () => {
      userArticleService.getUserArticles.mockReturnValue(
        of({ items: mockArticles, totalCount: 2 }),
      );
      productService.createArticle.mockReturnValue(of(void 0));

      fixture.detectChanges();

      const formData = {
        title: 'New Article',
        author: 'New Author',
        description: 'New Description',
        url: 'https://newexample.com',
        urlToImage: 'https://newexample.com/image.jpg',
        content: 'New Content',
        sourceId: 'manual',
        sourceName: 'User Contributed',
      };

      component.handleFormSubmit(formData);

      expect(productService.createArticle).toHaveBeenCalledWith(expect.any(Object));
      expect(toastService.show).toHaveBeenCalledWith('Article created successfully!', 'success');
    });

    it('should handle create error', () => {
      const error = { status: 400 };
      productService.createArticle.mockReturnValue(throwError(() => error));

      component.handleCreate({
        title: 'New Article',
        author: 'Author',
        description: 'Description',
        url: 'https://example.com',
        urlToImage: 'image.jpg',
        content: 'Content',
        sourceId: 'manual',
        sourceName: 'Source',
      });

      expect(toastService.show).toHaveBeenCalledWith('URL already exists.', 'error');
    });
  });

  describe('Bookmark Functionality', () => {
    it('should toggle bookmark', () => {
      userArticleService.getUserArticles.mockReturnValue(
        of({ items: mockArticles, totalCount: 2 }),
      );
      bookmarkService.toggleBookmark.mockReturnValue(of({ bookmarked: true }));

      fixture.detectChanges();
      component.handleBookmarkToggle(1);

      expect(bookmarkService.toggleBookmark).toHaveBeenCalledWith(1);
      expect(toastService.show).toHaveBeenCalledWith('Saved to Library', 'success');
    });

    it('should handle bookmark error', () => {
      userArticleService.getUserArticles.mockReturnValue(
        of({ items: mockArticles, totalCount: 2 }),
      );
      bookmarkService.toggleBookmark.mockReturnValue(throwError(() => new Error('Failed')));

      fixture.detectChanges();
      component.handleBookmarkToggle(1);

      expect(toastService.show).toHaveBeenCalledWith('Failed to update bookmark.', 'error');
    });
  });

  describe('Search Functionality', () => {
    it('should handle search input', async () => {
      userArticleService.getUserArticles.mockReturnValue(of({ items: [], totalCount: 0 }));

      fixture.detectChanges();

      const input = document.createElement('input');
      input.value = 'test search';

      component.onSearch({ target: input } as unknown as Event);

      await new Promise((resolve) => setTimeout(resolve, 500));

      expect(component.searchTerm()).toBe('test search');
      expect(component.currentPage()).toBe(1);
    });
  });

  describe('Infinite Scroll', () => {
    it('should load more articles on scroll', () => {
      userArticleService.getUserArticles.mockReturnValue(
        of({ items: mockArticles, totalCount: 20 }),
      );

      fixture.detectChanges();
      const initialPage = component.currentPage();

      component.loadMore();

      expect(userArticleService.getUserArticles).toHaveBeenCalled();
      expect(component.currentPage()).toBe(initialPage + 1);
    });
  });
});
