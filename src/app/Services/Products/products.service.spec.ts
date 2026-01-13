import { TestBed } from '@angular/core/testing';
import { ProductsService } from './products.service';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { mockContent } from '../../Mocks/content.mock';

describe('Products Service', () => {
  let service: ProductsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductsService,
        provideHttpClient(),
        provideHttpClientTesting(), // Intercepts all HttpClient calls
      ],
    });

    service = TestBed.inject(ProductsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verifies that no unexpected requests were made
    httpMock.verify();
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  it('should get featured products', () => {
    service.getFeaturedProducts().subscribe((products) => {
      expect(products.length).toBeGreaterThan(0);
      expect(products[0].id).toBe(mockContent[0].id);
    });

    // Option A: Use the exact URL from the error message
    // const req = httpMock.expectOne('https://my-news-backend-ategd4fkehazh8d4.centralus-01.azurewebsites.net/api/news');

    // Option B (Recommended): Use a predicate to match the end of the URL
    const req = httpMock.expectOne(
      (request) => request.url.endsWith('/api/news') && request.method === 'GET',
    );

    expect(req.request.method).toBe('GET');
    req.flush(mockContent);
  });
});
