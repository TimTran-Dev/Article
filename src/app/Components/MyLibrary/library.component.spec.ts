import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LibraryComponent } from './library.component';
import { BookmarkService } from '../../Services/Bookmark/bookmark.service';
import { of, throwError } from 'rxjs';
import { Article } from '../../Models/content.interface';
import { ContentStatus } from '../../Models/common.enum';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';

describe('LibraryComponent', () => {
  let component: LibraryComponent;
  let fixture: ComponentFixture<LibraryComponent>;
  let bookmarkService: BookmarkService;

  const mockArticles: Article[] = [
    {
      id: 1,
      title: 'Saved Article 1',
      contentType: 'Article',
      contentStatus: ContentStatus.Published,
      isBookmarked: false, // Service might return false, but component should map to true
    } as Article,
    {
      id: 2,
      title: 'Saved Article 2',
      contentType: 'Article',
      contentStatus: ContentStatus.Published,
    } as Article,
  ];

  beforeEach(async () => {
    // Mocking the BookmarkService
    const bookmarkServiceMock = {
      getUsersBookmarks: vi.fn(),
      toggleBookmark: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [LibraryComponent],
      providers: [{ provide: BookmarkService, useValue: bookmarkServiceMock }, provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(LibraryComponent);
    component = fixture.componentInstance;
    bookmarkService = TestBed.inject(BookmarkService);
  });

  it('should load bookmarks on init and map isBookmarked to true', () => {
    // Arrange
    vi.spyOn(bookmarkService, 'getUsersBookmarks').mockReturnValue(of(mockArticles));

    // Act
    fixture.detectChanges(); // triggers ngOnInit

    // Assert
    expect(component.isLoading()).toBe(false);
    expect(component.bookmarks().length).toBe(2);
    // Verify the mapping logic works
    expect(component.bookmarks()[0].isBookmarked).toBe(true);
  });

  it('should handle error during initial load', () => {
    // Arrange
    vi.spyOn(bookmarkService, 'getUsersBookmarks').mockReturnValue(
      throwError(() => new Error('API Error')),
    );

    // Act
    fixture.detectChanges();

    // Assert
    expect(component.isLoading()).toBe(false);
    expect(component.bookmarks()).toEqual([]);
  });

  describe('handleRemoveBookmark (Optimistic UI)', () => {
    beforeEach(() => {
      // Set initial state
      vi.spyOn(bookmarkService, 'getUsersBookmarks').mockReturnValue(of(mockArticles));
      fixture.detectChanges();
    });

    it('should remove article from list immediately (optimistic update)', () => {
      // Arrange: Return the expected object shape instead of void 0
      vi.spyOn(bookmarkService, 'toggleBookmark').mockReturnValue(of({ bookmarked: false }));

      // Act
      component.handleRemoveBookmark(1);

      // Assert
      expect(component.bookmarks().length).toBe(1);
      expect(bookmarkService.toggleBookmark).toHaveBeenCalledWith(1);
    });

    it('should rollback the list if the delete API call fails', () => {
      // Arrange
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.spyOn(bookmarkService, 'toggleBookmark').mockReturnValue(
        throwError(() => new Error('Server Fail')),
      );

      // Act
      component.handleRemoveBookmark(1);

      // Assert
      expect(component.bookmarks().length).toBe(2); // Rolled back to original count
      expect(component.bookmarks().find((a) => a.id === 1)).toBeTruthy();
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });
});
