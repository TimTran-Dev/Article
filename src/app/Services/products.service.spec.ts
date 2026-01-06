import { TestBed } from '@angular/core/testing';
import { ProductsService } from './products.service';

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
});
