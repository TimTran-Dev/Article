import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArticleComponent } from './article.component';
import { ProductsService } from '../../Services/products.service';
import { provideRouter } from '@angular/router';
import { mockProductsService } from '../../Mocks/product.service.mock';
// Import these to fix the NG0303 errors
import { DropdownComponent } from '../Tapestry/Dropdown/dropdown.component';
import { LoadingComponent } from '../Tapestry/Loading/loading.component';

describe('Article Component', () => {
  let fixture: ComponentFixture<ArticleComponent>;
  let component: ArticleComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // 1. Add ALL child components used in the template here
      imports: [ArticleComponent, DropdownComponent, LoadingComponent],
      providers: [
        // 2. Ensure this mock has the getArticles() method we just wrote
        { provide: ProductsService, useValue: mockProductsService },
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ArticleComponent);
    component = fixture.componentInstance;

    // 3. This triggers ngOnInit -> initializeArticles()
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have loading state as false after initialization', () => {
    // Because mockProductsService returns 'of()', it resolves instantly
    expect(component.isLoading()).toBeFalsy();
  });

  it('should load articles on initialization', () => {
    // This checks if the mock data was successfully mapped to signals
    expect(component.article().length).toBeGreaterThan(0);
    expect(component.article()[0].contentType).toBe('Article');
  });
});
