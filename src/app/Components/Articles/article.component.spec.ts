import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArticleComponent } from './article.component';
import { ProductsService } from '../../Services/Products/products.service';
import { provideRouter } from '@angular/router';
import { mockProductsService } from '../../Mocks/product.service.mock';
import { mockToastService } from '../../Mocks/toast.service.mock';
import { ToastService } from '../../Services/Toast/toast.service';

describe('Article Component', () => {
  let fixture: ComponentFixture<ArticleComponent>;
  let component: ArticleComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleComponent], // Component pulls its own children
      providers: [
        { provide: ProductsService, useValue: mockProductsService },
        { provide: ToastService, useValue: mockToastService },
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ArticleComponent);
    component = fixture.componentInstance;
  });

  it('should create and load data', async () => {
    fixture.detectChanges(); // Start lifecycle
    await fixture.whenStable(); // Wait for Signals and Async Observables

    expect(component).toBeTruthy();
    expect(component.article().length).toBeGreaterThan(0);
  });
});
