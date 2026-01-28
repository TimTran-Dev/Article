import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { BookmarkService } from './bookmark.service';
import { environment } from '../../../environments/environment';
import { ArticleAPIResponse } from '../../Models/ArticleAPIResponse.interface';
import { ContentStatus } from '../../Models/common.enum';

describe('BookmarkService', () => {
  let service: BookmarkService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl;

  const mockApiResponse: ArticleAPIResponse = {
    id: 99,
    title: 'Test Bookmark',
    description: 'Test Desc',
    url: 'https://test.com',
    urlToImage: 'img.jpg',
    author: 'Jane Doe',
    content: 'Full Content',
    isBookmarked: true,
    publishedAt: '',
    source: { id: 'tech-crunch', name: 'TechCrunch' },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BookmarkService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(BookmarkService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#getUsersBookmarks', () => {
    it('should GET and map bookmarks to Article objects', () => {
      service.getUsersBookmarks().subscribe((articles) => {
        expect(articles.length).toBe(1);
        const article = articles[0];

        // Verify Mapping Logic
        expect(article.id).toBe(99);
        expect(article.sourceName).toBe('TechCrunch');
        expect(article.contentType).toBe('Article');
        expect(article.contentStatus).toBe(ContentStatus.Published);
        expect(article.author).toBe('Jane Doe');
      });

      const req = httpMock.expectOne(`${apiUrl}/bookmarks/my-bookmarks`);
      expect(req.request.method).toBe('GET');
      req.flush([mockApiResponse]);
    });

    it('should use default values when mapping optional fields', () => {
      const incompleteResponse: ArticleAPIResponse = {
        id: 1,
        title: 'Minimal',
        url: 'url',
        source: null, // Testing safe navigation for source
      } as any;

      service.getUsersBookmarks().subscribe((articles) => {
        expect(articles[0].author).toBe('Anonymous');
        expect(articles[0].sourceName).toBe('Unknown Source');
      });

      const req = httpMock.expectOne(`${apiUrl}/bookmarks/my-bookmarks`);
      req.flush([incompleteResponse]);
    });
  });

  describe('#toggleBookmark', () => {
    it('should POST to the toggle endpoint with correct articleId', () => {
      const articleId = 123;
      const mockResult = { bookmarked: true };

      service.toggleBookmark(articleId).subscribe((res) => {
        expect(res.bookmarked).toBe(true);
      });

      const req = httpMock.expectOne(`${apiUrl}/bookmarks/bookmark/${articleId}`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({}); // Verifies empty body as per service
      req.flush(mockResult);
    });
  });
});
