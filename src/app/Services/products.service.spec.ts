import { TestBed } from '@angular/core/testing';
import { ProductsService } from './products.service';
import { ContentStatus } from '../Models/common.enum';
import { mockDraftContent } from '../Mocks/content.mock';

describe('Products Service', () => {
  let service: ProductsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductsService],
    });

    service = TestBed.inject(ProductsService);
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  it('should assign owner to product', () => {
    const updatedContent = service.assignOwnerToProduct(mockDraftContent, 42);
    expect(updatedContent.ownerId).toBe(42);
  });

  it('should get featured products', () => {
    service.getFeaturedProducts().subscribe((products) => {
      expect(products.length).toBeGreaterThan(0);
    });
  });

  it('should update content status', () => {
    const updatedContent = service.updateContentStatus(mockDraftContent, ContentStatus.Published);
    expect(updatedContent.contentStatus).toBe(ContentStatus.Published);
  });
});
