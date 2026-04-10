import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ProductsService } from './products.service';
import { ArticleAPIResponse } from '../../Models/ArticleAPIResponse.interface';
import { environment } from '../../../environments/environment';
import { NewsArticleUpdateDto } from '../../Models/NewsArticleUpdate.interface';

describe('ProductsService', () => {
  let service: ProductsService;
  let httpMock: HttpTestingController;

  // 1. Setup a helper to create raw API data (mirrors your ArticleAPIResponse)
  const createRawArticle = (overrides: Partial<ArticleAPIResponse> = {}): ArticleAPIResponse => ({
    source: { id: 'test-id', name: 'Test Source' },
    author: 'Test Author',
    title: 'Test Title',
    description: 'Test Description',
    url: 'https://test.com',
    urlToImage: 'https://test.com/image.png',
    publishedAt: '2024-01-01',
    content: 'Test Content',
    ...overrides,
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductsService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(ProductsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensures no outstanding HTTP requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getArticles', () => {
    it('should fetch articles and map them correctly with totalCount from headers', () => {
      const mockRawData: ArticleAPIResponse[] = [createRawArticle()];

      service.getArticles(1, 10, 'test').subscribe((result) => {
        expect(result.items.length).toBe(1);
        expect(result.totalCount).toBe(100);
        // Verify Mapping logic (e.g., urlToImage -> imageUrl)
        expect(result.items[0].imageUrl).toBe(mockRawData[0].urlToImage);
        expect(result.items[0].sourceName).toBe(mockRawData[0].source.name);
      });

      const req = httpMock.expectOne((r) => r.url.includes('/news'));
      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('searchTerm')).toBe('test');

      // Flush with custom headers
      req.flush(mockRawData, {
        headers: { 'X-Total-Count': '100' },
      });
    });
  });

  describe('getFeaturedProducts', () => {
    it('should map raw API response to flat Article structure', () => {
      const mockRawData: ArticleAPIResponse[] = [
        createRawArticle({ title: 'Featured 1' }),
        createRawArticle({ title: 'Featured 2' }),
      ];

      service.getFeaturedProducts().subscribe((articles) => {
        expect(articles.length).toBe(2);
        expect(articles[0].title).toBe('Featured 1');
        expect(articles[0].contentType).toBe('Article'); // Verified by mapper
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/news`);
      req.flush(mockRawData);
    });
  });

  describe('CRUD operations', () => {
    it('should call delete with correct ID', () => {
      service.deleteArticle(123).subscribe();
      const req = httpMock.expectOne(`${environment.apiUrl}/news/delete/123`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('should call update with correct payload', () => {
      // Add the missing 'url' property required by NewsArticleUpdateDto
      const updateDto: NewsArticleUpdateDto = {
        title: 'New Title',
        url: 'https://test.com/updated-url',
      };

      service.updateArticle(1, updateDto).subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/news/update?id=1`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(updateDto);
      req.flush(null);
    });
  });
});
