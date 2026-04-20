import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserArticleService } from './user-article.service';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('UserArticleService', () => {
  let service: UserArticleService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserArticleService],
    });

    service = TestBed.inject(UserArticleService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getUserArticles', () => {
    it('should fetch user articles with pagination', () => {
      const mockResponse = {
        items: [
          {
            id: 1,
            title: 'Test Article',
            description: 'Test Description',
            url: 'https://example.com',
            urlToImage: 'https://example.com/image.jpg',
            author: 'Test Author',
            content: 'Test Content',
            isBookmarked: false,
            sourceName: 'Test Source',
          },
        ],
        totalCount: 1,
      };

      service.getUserArticles(1, 10, '').subscribe((result) => {
        expect(result.items.length).toBe(1);
        expect(result.items[0].title).toBe('Test Article');
        expect(result.totalCount).toBe(1);
      });

      const req = httpMock.expectOne((request) => request.url.includes('/UserArticle'));
      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('page')).toBe('1');
      expect(req.request.params.get('pageSize')).toBe('10');
      req.flush(mockResponse);
    });

    it('should support search term filtering', () => {
      const mockResponse = {
        items: [],
        totalCount: 0,
      };

      service.getUserArticles(1, 10, 'search-term').subscribe();

      const req = httpMock.expectOne((request) => request.url.includes('/UserArticle'));
      expect(req.request.params.get('searchTerm')).toBe('search-term');
      req.flush(mockResponse);
    });

    it('should handle pagination parameters correctly', () => {
      const mockResponse = {
        items: [],
        totalCount: 50,
      };

      service.getUserArticles(2, 20, '').subscribe();

      const req = httpMock.expectOne((request) => request.url.includes('/UserArticle'));
      expect(req.request.params.get('page')).toBe('2');
      expect(req.request.params.get('pageSize')).toBe('20');
      req.flush(mockResponse);
    });

    it('should handle empty response', () => {
      const mockResponse = {
        items: [],
        totalCount: 0,
      };

      service.getUserArticles(1, 10, '').subscribe((result) => {
        expect(result.items.length).toBe(0);
        expect(result.totalCount).toBe(0);
      });

      const req = httpMock.expectOne((request) => request.url.includes('/UserArticle'));
      req.flush(mockResponse);
    });

    it('should handle 401 unauthorized error', () => {
      let errorReceived = false;

      service.getUserArticles(1, 10, '').subscribe(
        () => {
          // should not reach here
        },
        (error) => {
          errorReceived = true;
          expect(error.status).toBe(401);
        },
      );

      const req = httpMock.expectOne((request) => request.url.includes('/UserArticle'));
      req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
      expect(errorReceived).toBe(true);
    });

    it('should handle 403 forbidden error', () => {
      let errorReceived = false;

      service.getUserArticles(1, 10, '').subscribe(
        () => {
          // should not reach here
        },
        (error) => {
          errorReceived = true;
          expect(error.status).toBe(403);
        },
      );

      const req = httpMock.expectOne((request) => request.url.includes('/UserArticle'));
      req.flush('Forbidden', { status: 403, statusText: 'Forbidden' });
      expect(errorReceived).toBe(true);
    });

    it('should map API response to Article model correctly', () => {
      const mockResponse = {
        items: [
          {
            id: 1,
            title: 'Article Title',
            description: 'Article Description',
            url: 'https://example.com',
            urlToImage: 'https://example.com/image.jpg',
            author: 'Article Author',
            content: 'Article Content',
            isBookmarked: true,
            sourceName: 'Example Source',
          },
        ],
        totalCount: 1,
      };

      service.getUserArticles(1, 10, '').subscribe((result) => {
        const article = result.items[0];
        expect(article.id).toBe(1);
        expect(article.title).toBe('Article Title');
        expect(article.author).toBe('Article Author');
        expect(article.isBookmarked).toBe(true);
        expect(article.contentType).toBe('Article');
        expect(article.isDeleted).toBe(false);
      });

      const req = httpMock.expectOne((request) => request.url.includes('/UserArticle'));
      req.flush(mockResponse);
    });

    it('should handle null author by providing default', () => {
      const mockResponse = {
        items: [
          {
            id: 1,
            title: 'Article',
            description: 'Description',
            url: 'https://example.com',
            urlToImage: null,
            author: null,
            content: null,
            isBookmarked: false,
            sourceName: null,
          },
        ],
        totalCount: 1,
      };

      service.getUserArticles(1, 10, '').subscribe((result) => {
        const article = result.items[0];
        expect(article.author).toBe('News Source');
        expect(article.sourceName).toBe('Unknown Source');
      });

      const req = httpMock.expectOne((request) => request.url.includes('/UserArticle'));
      req.flush(mockResponse);
    });
  });
});
