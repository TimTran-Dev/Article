import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomePageComponent } from './homepage.component';
import { ProductsService } from '../../Services/products.service';
import { mockContent } from '../../Mocks/content.mock';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { provideRouter } from '@angular/router';

describe('HomePage Component', () => {
  let fixture: ComponentFixture<HomePageComponent>;
  let component: HomePageComponent;
  let productService: ProductsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePageComponent],
      providers: [ProductsService, provideRouter([])],
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
    vi.spyOn(productService, 'getFeaturedProducts').mockReturnValue(
      throwError(() => new Error('Service error')),
    );
    fixture.detectChanges();
    expect(component.isLoading()).toBeFalsy();
  });
});
