import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ProductsService } from './products.service';
import { environment } from '../../../environments/environment';
import { ContentStatus } from '../../Models/common.enum';
import {
  PaginatedArticleResponse,
  ArticleAPIResponse,
} from '../../Models/ArticleAPIResponse.interface';

describe('ProductsService', () => {
  let service: ProductsService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl;

  // Mock Data
  const mockApiArticle: ArticleAPIResponse = {
    id: 1,
    title: 'Test Article',
    description: 'Test Description',
    url: 'https://test.com',
    urlToImage: 'https://test.com/image.jpg',
    author: 'John Doe',
    content: 'Full content here',
    isBookmarked: false,
    publishedAt: '',
    source: { id: 'cnn', name: 'CNN' },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductsService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(ProductsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensures no outstanding requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#getArticles', () => {
    it('should return mapped articles and total count', () => {
      const mockResponse: PaginatedArticleResponse = {
        items: [mockApiArticle],
        totalCount: 1,
      };

      service.getArticles(1, 10, 'Angular').subscribe((result) => {
        expect(result.items.length).toBe(1);
        expect(result.totalCount).toBe(1);
        expect(result.items[0].title).toBe('Test Article');
        expect(result.items[0].sourceName).toBe('CNN'); // Verifies mapping
        expect(result.items[0].contentStatus).toBe(ContentStatus.Published);
      });

      const req = httpMock.expectOne(
        (request) =>
          request.url === `${apiUrl}/news` && request.params.get('searchTerm') === 'Angular',
      );

      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('#createArticle', () => {
    it('should send a POST request to create an article', () => {
      const newArticle = { title: 'New', description: 'Desc' } as any;

      service.createArticle(newArticle).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/news/create`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newArticle);
      req.flush(null);
    });
  });

  describe('#updateArticle', () => {
    it('should send a PATCH request with update DTO', () => {
      const updateDto = { title: 'Updated Title' } as any;

      service.updateArticle(123, updateDto).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/news/update/123`);
      expect(req.request.method).toBe('PATCH');
      req.flush(null);
    });
  });

  describe('#deleteArticle', () => {
    it('should send a DELETE request', () => {
      service.deleteArticle(123).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/news/delete/123`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('#getFeaturedProducts', () => {
    it('should return mapped articles from a simple array response', () => {
      const mockList: ArticleAPIResponse[] = [mockApiArticle];

      service.getFeaturedProducts().subscribe((articles) => {
        expect(articles.length).toBe(1);
        expect(articles[0].author).toBe('John Doe');
      });

      const req = httpMock.expectOne(`${apiUrl}/news`);
      req.flush(mockList);
    });
  });

  describe('Mapping Logic', () => {
    it('should provide default values if optional API fields are missing', () => {
      const incompleteArticle: ArticleAPIResponse = {
        id: 2,
        title: 'Minimal',
        url: 'url',
        source: null, // Testing safe navigation
      } as any;

      service['getArticles'](1, 1).subscribe((res) => {
        const item = res.items[0];
        expect(item.author).toBe('News Source'); // Default from mapToArticle
        expect(item.sourceName).toBe('Unknown Source'); // Default from mapToArticle
      });

      const req = httpMock.expectOne((r) => r.url.includes('/news'));
      req.flush({ items: [incompleteArticle], totalCount: 1 });
    });
  });
});
