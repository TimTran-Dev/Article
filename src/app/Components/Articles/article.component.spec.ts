import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArticleComponent } from './article.component';
import { ProductsService } from '../../Services/Products/products.service';
import { provideRouter } from '@angular/router';
import { mockProductsService } from '../../Mocks/product.service.mock';
import { mockToastService } from '../../Mocks/toast.service.mock';
import { ToastService } from '../../Services/Toast/toast.service';
import { createArticleMock } from '../../Mocks/article.mock';
import { of } from 'rxjs';

describe('Article Component', () => {
  let fixture: ComponentFixture<ArticleComponent>;
  let component: ArticleComponent;
  let productService: ProductsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleComponent], // Component pulls its own children
      providers: [
        { provide: ProductsService, useValue: mockProductsService },
        { provide: ToastService, useValue: mockToastService },
        provideRouter([]),
      ],
    }).compileComponents();

    productService = TestBed.inject(ProductsService);
    fixture = TestBed.createComponent(ArticleComponent);
    component = fixture.componentInstance;
  });

  it('should create and load data', async () => {
    // 2. This should now be recognized as a function
    const mockData = [createArticleMock()];

    vi.spyOn(productService, 'getArticles').mockReturnValue(
      of({
        items: mockData,
        totalCount: mockData.length,
      }),
    );

    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.article().length).toBeGreaterThan(0);
  });
});
