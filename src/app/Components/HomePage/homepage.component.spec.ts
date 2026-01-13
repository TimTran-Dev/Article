import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomePageComponent } from './homepage.component';
import { ProductsService } from '../../Services/Products/products.service';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { provideRouter } from '@angular/router';
// 1. Use your mock service to prevent real HTTP calls
import { mockProductsService } from '../../Mocks/product.service.mock';
// 2. Import child components to fix binding errors
import { DropdownComponent } from '../Tapestry/Dropdown/dropdown.component';
import { LoadingComponent } from '../Tapestry/Loading/loading.component';
import { Article } from '../../Models/content.interface';
import { ContentStatus } from '../../Models/common.enum';

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
    // 1. Arrange: Create strict mock data that matches the Article interface
    const mockArticles: Article[] = [
      {
        id: 1,
        ownerId: 0,
        contentType: 'Article',
        contentStatus: ContentStatus.Published,
        isDeleted: false,
        title: 'Featured Tech News',
        author: 'Author Name',
        description: 'Description here',
        body: 'Body content',
        imageUrl: 'image-url',
        url: 'test-url',
        content: 'test-content',
        sourceId: 'src-1',
        sourceName: 'Source 1',
      },
    ];

    // 2. Setup the spy BEFORE calling detectChanges
    vi.spyOn(productService, 'getFeaturedProducts').mockReturnValue(of(mockArticles));

    // 3. Act: Trigger ngOnInit
    fixture.detectChanges();

    // 4. Assert: Access the signal and check the values
    expect(component.featuredProducts()).toEqual(mockArticles);
    expect(component.featuredProducts().length).toBe(1);
    expect(component.isLoading()).toBe(false);
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
