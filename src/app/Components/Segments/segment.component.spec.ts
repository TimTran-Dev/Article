import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductsService } from '../../Services/products.service';
import { SegmentComponent } from './segment.component';
import { provideRouter } from '@angular/router';
import { mockProductsService } from '../../Mocks/product.service.mock';
import { throwError } from 'rxjs';
import { vi } from 'vitest';
// Import child components
import { DropdownComponent } from '../Tapestry/Dropdown/dropdown.component';
import { LoadingComponent } from '../Tapestry/Loading/loading.component';

describe('Segment Component', () => {
  let fixture: ComponentFixture<SegmentComponent>;
  let component: SegmentComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // 1. Add child components to imports
      imports: [SegmentComponent, DropdownComponent, LoadingComponent],
      providers: [{ provide: ProductsService, useValue: mockProductsService }, provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(SegmentComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges(); // Triggers ngOnInit
  });

  it('should create the component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should have loading state as false after initialization', () => {
    fixture.detectChanges();
    expect(component.isLoading()).toBeFalsy();
  });

  it('should load segments on initialization', () => {
    fixture.detectChanges();
    expect(component.segment().length).toBeGreaterThan(0);
    // Ensure this matches your mock data's type
    expect(component.segment()[0].contentType).toBe('Segment');
  });

  it('should handle error during segment loading', () => {
    const productService = TestBed.inject(ProductsService);

    // 2. IMPORTANT: Spy on the actual method the component calls.
    // In your Article component it was 'getArticles'.
    // Check if SegmentComponent calls 'getArticles' or 'getFeaturedProducts'.
    vi.spyOn(productService, 'getArticles').mockReturnValue(
      throwError(() => new Error('Service error')),
    );

    component.ngOnInit();
    expect(component.isLoading()).toBeFalsy();
  });
});
