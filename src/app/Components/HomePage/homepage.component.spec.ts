import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomePageComponent } from './homepage.component';
import { ProductsService } from '../../Services/Products/products.service';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { provideRouter } from '@angular/router';
import { LoadingComponent } from '../Tapestry/Loading/loading.component';
import { Article } from '../../Models/content.interface';
import { ContentStatus } from '../../Models/common.enum';

describe('HomePage Component', () => {
  let fixture: ComponentFixture<HomePageComponent>;
  let component: HomePageComponent;
  let productService: ProductsService;

  // Reusable Mock Response
  const mockPaginatedResponse = {
    items: [
      {
        id: 1,
        ownerId: 0,
        contentType: 'Article',
        contentStatus: ContentStatus.Published,
        isDeleted: false,
        title: 'Featured Tech News',
        author: 'Author Name',
        description: 'Description',
        body: 'Body',
        imageUrl: 'url',
        url: 'url',
        content: 'content',
        sourceId: '1',
        sourceName: 'Source',
      } as Article,
    ],
    totalCount: 1,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePageComponent, LoadingComponent],
      providers: [
        {
          provide: ProductsService,
          useValue: { getArticles: () => of({ items: [], totalCount: 0 }) },
        },
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
    vi.spyOn(productService, 'getArticles').mockReturnValue(of({ items: [], totalCount: 0 }));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load featured products using paginated service', () => {
    // Arrange: Setup spy for the correct method
    const spy = vi.spyOn(productService, 'getArticles').mockReturnValue(of(mockPaginatedResponse));

    // Act
    fixture.detectChanges();

    // Assert
    expect(spy).toHaveBeenCalledWith(1, 10);
    expect(component.featuredProducts()).toEqual(mockPaginatedResponse.items);
    expect(component.isLoading()).toBe(false);
  });

  it('should handle error loading featured products', () => {
    vi.spyOn(productService, 'getArticles').mockReturnValue(
      throwError(() => new Error('Service error')),
    );

    fixture.detectChanges();

    expect(component.isLoading()).toBe(false);
    expect(component.featuredProducts().length).toBe(0);
  });

  it('should toggle pause state', () => {
    expect(component.isPaused()).toBe(false);
    component.togglePause(true);
    expect(component.isPaused()).toBe(true);
  });
});
