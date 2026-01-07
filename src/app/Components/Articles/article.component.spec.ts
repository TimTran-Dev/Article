import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArticleComponent } from './article.component';
import { ProductsService } from '../../Services/products.service';
import { provideRouter } from '@angular/router';
import { mockProductsService } from '../../Mocks/product.service.mock';
import { throwError } from 'rxjs';
import { vi } from 'vitest';

describe('Article Component', () => {
  let fixture: ComponentFixture<ArticleComponent>;
  let component: ArticleComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleComponent],
      providers: [{ provide: ProductsService, useValue: mockProductsService }, provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have loading state as false after initialization', () => {
    expect(component.isLoading()).toBeFalsy();
  });

  it('should load articles on initialization', () => {
    expect(component.article().length).toBeGreaterThan(0);
    expect(component.article()[0].contentType).toBe('Article');
  });

  it('should handle error during article loading', () => {
    const productService = TestBed.inject(ProductsService);
    vi.spyOn(productService, 'getFeaturedProducts').mockReturnValue(
      throwError(() => new Error('Service error')),
    );
    component.ngOnInit();
    expect(component.isLoading()).toBeFalsy();
  });

  // it('should update status of an article', () => {
  //   const article = component.article()[0];
  //   component.onStatusChange('Published');
  //   expect(article.contentStatus).toBe(ContentStatus.Published);
  // });
});
