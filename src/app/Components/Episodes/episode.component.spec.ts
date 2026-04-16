import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductsService } from '../../Services/Products/products.service';
import { EpisodeComponent } from './episode.component';
import { provideRouter } from '@angular/router';
import { mockProductsService } from '../../Mocks/product.service.mock';
import { throwError } from 'rxjs';
import { vi } from 'vitest';
import { DropdownComponent } from '../Tapestry/Dropdown/dropdown.component';
import { LoadingComponent } from '../Tapestry/Loading/loading.component';

describe('Episode Component', () => {
  let fixture: ComponentFixture<EpisodeComponent>;
  let component: EpisodeComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EpisodeComponent, DropdownComponent, LoadingComponent],
      providers: [{ provide: ProductsService, useValue: mockProductsService }, provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(EpisodeComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should have loading state as false after initialization', () => {
    fixture.detectChanges();
    expect(component.isLoading()).toBeFalsy();
  });

  it('should handle error during episode loading', () => {
    const productService = TestBed.inject(ProductsService);

    vi.spyOn(productService, 'getArticles').mockReturnValue(
      throwError(() => new Error('Service error')),
    );

    component.ngOnInit();
    expect(component.isLoading()).toBeFalsy();
  });
});
