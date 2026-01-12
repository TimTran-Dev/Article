import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductsService } from '../../Services/products.service';
import { SegmentComponent } from './segment.component';
import { provideRouter } from '@angular/router';
import { mockProductsService } from '../../Mocks/product.service.mock';
import { throwError } from 'rxjs';
import { vi } from 'vitest';

describe('Segment Component', () => {
  let fixture: ComponentFixture<SegmentComponent>;
  let component: SegmentComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SegmentComponent],
      providers: [{ provide: ProductsService, useValue: mockProductsService }, provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(SegmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have loading state as false after initialization', () => {
    expect(component.isLoading()).toBeFalsy();
  });

  it('should load segments on initialization', () => {
    expect(component.segment().length).toBeGreaterThan(0);
    expect(component.segment()[0].contentType).toBe('Segment');
  });

  it('should handle error during segment loading', () => {
    const productService = TestBed.inject(ProductsService);
    vi.spyOn(productService, 'getFeaturedProducts').mockReturnValue(
      throwError(() => new Error('Service error')),
    );
    component.ngOnInit();
    expect(component.isLoading()).toBeFalsy();
  });
});
