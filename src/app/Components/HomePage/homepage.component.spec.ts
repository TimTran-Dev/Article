import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomePageComponent } from './homepage.component';
import { ProductsService } from '../../Services/Products/products.service';
import { mockContent } from '../../Mocks/content.mock';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { provideRouter } from '@angular/router';
// 1. Use your mock service to prevent real HTTP calls
import { mockProductsService } from '../../Mocks/product.service.mock';
// 2. Import child components to fix binding errors
import { DropdownComponent } from '../Tapestry/Dropdown/dropdown.component';
import { LoadingComponent } from '../Tapestry/Loading/loading.component';

describe('HomePage Component', () => {
  let fixture: ComponentFixture<HomePageComponent>;
  let component: HomePageComponent;
  let productService: ProductsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Add HomePage plus children
      imports: [HomePageComponent, DropdownComponent, LoadingComponent],
      providers: [
        // 3. ALWAYS provide the mock, not the real service
        { provide: ProductsService, useValue: mockProductsService },
        provideRouter([]),
      ],
    }).compileComponents();

    productService = TestBed.inject(ProductsService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    vi.spyOn(productService, 'getFeaturedProducts').mockReturnValue(of([]));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should have loading state as false after loading products', () => {
    vi.spyOn(productService, 'getFeaturedProducts').mockReturnValue(of([]));
    fixture.detectChanges();
    expect(component.isLoading()).toBeFalsy();
  });

  it('should load featured products', () => {
    vi.spyOn(productService, 'getFeaturedProducts').mockReturnValue(of(mockContent));
    fixture.detectChanges();
    expect(component.featuredProducts()).toEqual(mockContent);
    expect(component.isLoading()).toBeFalsy();
  });

  it('should handle error loading featured products', () => {
    // This is the correct way to test the error path
    vi.spyOn(productService, 'getFeaturedProducts').mockReturnValue(
      throwError(() => new Error('Service error')),
    );
    fixture.detectChanges();
    expect(component.isLoading()).toBeFalsy();
  });
});
