import { TestBed } from '@angular/core/testing';
import { ProductsService } from './products.service';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { mockContent } from '../Mocks/content.mock';

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
      // Check for a specific property instead of deep equality of the whole object
      expect(products[0].id).toBe(mockContent[0].id);
      expect(products[0].contentType).toBe(mockContent[0].contentType);
    });

    const req = httpMock.expectOne('https://localhost:7164/api/news');
    expect(req.request.method).toBe('GET');

    // Flush the mock data
    req.flush(mockContent);
  });
});
