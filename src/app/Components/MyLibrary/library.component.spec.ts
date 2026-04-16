import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LibraryComponent } from './library.component';
import { BookmarkService } from '../../Services/Bookmark/bookmark.service';
import { AuthService } from '../../Services/Authorization/auth.service';
import { of, throwError } from 'rxjs';
import { Article } from '../../Models/content.interface';
import { ContentStatus } from '../../Models/common.enum';
import { provideRouter } from '@angular/router';
import { vi, describe, it, expect, beforeEach, Mock } from 'vitest';

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
      author: 'John Doe',
      body: 'Sample body text...',
      contentType: 'Article',
      contentStatus: ContentStatus.Published,
      isBookmarked: false,
    } as Article,
    {
      id: 2,
      title: 'Saved Article 2',
      author: 'Jane Doe',
      body: 'Sample body text...',
      contentType: 'Article',
      contentStatus: ContentStatus.Published,
    } as Article,
  ];

  beforeEach(async () => {
    const bookmarkServiceMock: MockBookmarkService = {
      getUsersBookmarks: vi.fn(),
      toggleBookmark: vi.fn(),
    };

    const authServiceMock = {
      init: vi.fn().mockResolvedValue(undefined),
      getToken: vi.fn().mockResolvedValue('mock-token'),
      user: vi.fn().mockReturnValue(null),
    };

    await TestBed.configureTestingModule({
      imports: [LibraryComponent],
      providers: [
        { provide: BookmarkService, useValue: bookmarkServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LibraryComponent);
    component = fixture.componentInstance;

    bookmarkService = TestBed.inject(BookmarkService) as unknown as MockBookmarkService;
  });

  it('should load bookmarks on init and map isBookmarked to true', () => {
    bookmarkService.getUsersBookmarks.mockReturnValue(of(mockArticles));

    fixture.detectChanges();

    expect(component.isLoading()).toBe(false);
    expect(component.bookmarks().length).toBe(2);
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
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {
        /* empty */
      });

      bookmarkService.toggleBookmark.mockReturnValue(throwError(() => new Error('Server Fail')));

      component.handleRemoveBookmark(1);

      expect(component.bookmarks().length).toBe(2);
      expect(component.bookmarks().find((a) => a.id === 1)).toBeTruthy();
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });
});
