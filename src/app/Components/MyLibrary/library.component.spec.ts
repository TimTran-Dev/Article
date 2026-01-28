import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LibraryComponent } from './library.component';
import { BookmarkService } from '../../Services/Bookmark/bookmark.service';
import { AuthService } from '../../Services/Authorization/auth.service';
import { of, throwError } from 'rxjs';
import { Article } from '../../Models/content.interface';
import { ContentStatus } from '../../Models/common.enum';
import { provideRouter } from '@angular/router';
import { vi, describe, it, expect, beforeEach, Mock } from 'vitest';

// 1. Define a strict mock interface for the BookmarkService
interface MockBookmarkService {
  getUsersBookmarks: Mock;
  toggleBookmark: Mock;
}

describe('LibraryComponent', () => {
  let component: LibraryComponent;
  let fixture: ComponentFixture<LibraryComponent>;
  let bookmarkService: MockBookmarkService;

  const mockArticles: Article[] = [
    {
      id: 1,
      title: 'Saved Article 1',
      author: 'John Doe', // Added this
      body: 'Sample body text...', // Added this
      contentType: 'Article',
      contentStatus: ContentStatus.Published,
      isBookmarked: false,
    } as Article,
    {
      id: 2,
      title: 'Saved Article 2',
      author: 'Jane Doe', // Added this
      body: 'Sample body text...', // Added this
      contentType: 'Article',
      contentStatus: ContentStatus.Published,
    } as Article,
  ];

  beforeEach(async () => {
    // 2. Create the Mock Objects
    const bookmarkServiceMock: MockBookmarkService = {
      getUsersBookmarks: vi.fn(),
      toggleBookmark: vi.fn(),
    };

    // This mock prevents the real AuthService and Clerk SDK from loading
    const authServiceMock = {
      init: vi.fn().mockResolvedValue(undefined),
      getToken: vi.fn().mockResolvedValue('mock-token'),
      user: vi.fn().mockReturnValue(null),
    };

    await TestBed.configureTestingModule({
      imports: [LibraryComponent],
      providers: [
        { provide: BookmarkService, useValue: bookmarkServiceMock },
        { provide: AuthService, useValue: authServiceMock }, // Crucial fix
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LibraryComponent);
    component = fixture.componentInstance;

    // 3. Inject and cast to our Mock interface for type-safe spies
    bookmarkService = TestBed.inject(BookmarkService) as unknown as MockBookmarkService;
  });

  it('should load bookmarks on init and map isBookmarked to true', () => {
    bookmarkService.getUsersBookmarks.mockReturnValue(of(mockArticles));

    fixture.detectChanges(); // triggers ngOnInit

    expect(component.isLoading()).toBe(false);
    expect(component.bookmarks().length).toBe(2);
    // Logic check: component should map isBookmarked to true
    expect(component.bookmarks()[0].isBookmarked).toBe(true);
  });

  it('should handle error during initial load', () => {
    bookmarkService.getUsersBookmarks.mockReturnValue(throwError(() => new Error('API Error')));

    fixture.detectChanges();

    expect(component.isLoading()).toBe(false);
    expect(component.bookmarks()).toEqual([]);
  });

  describe('handleRemoveBookmark (Optimistic UI)', () => {
    beforeEach(() => {
      bookmarkService.getUsersBookmarks.mockReturnValue(of(mockArticles));
      fixture.detectChanges();
    });

    it('should remove article from list immediately (optimistic update)', () => {
      bookmarkService.toggleBookmark.mockReturnValue(of({ bookmarked: false }));

      component.handleRemoveBookmark(1);

      expect(component.bookmarks().length).toBe(1);
      expect(bookmarkService.toggleBookmark).toHaveBeenCalledWith(1);
    });

    it('should rollback the list if the delete API call fails', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      bookmarkService.toggleBookmark.mockReturnValue(throwError(() => new Error('Server Fail')));

      component.handleRemoveBookmark(1);

      // Verify rollback
      expect(component.bookmarks().length).toBe(2);
      expect(component.bookmarks().find((a) => a.id === 1)).toBeTruthy();
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });
});
