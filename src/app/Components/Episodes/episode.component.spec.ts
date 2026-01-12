import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductsService } from '../../Services/products.service';
import { EpisodeComponent } from './episode.component';
import { provideRouter } from '@angular/router';
import { mockProductsService } from '../../Mocks/product.service.mock';
import { throwError } from 'rxjs';
import { vi } from 'vitest';

describe('Episode Component', () => {
  let fixture: ComponentFixture<EpisodeComponent>;
  let component: EpisodeComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EpisodeComponent],
      providers: [{ provide: ProductsService, useValue: mockProductsService }, provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(EpisodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have loading state as false after initialization', () => {
    expect(component.isLoading()).toBeFalsy();
  });

  it('should load episodes on initialization', () => {
    expect(component.episode().length).toBeGreaterThan(0);
    expect(component.episode()[0].contentType).toBe('Episode');
  });

  it('should handle error during episode loading', () => {
    const productService = TestBed.inject(ProductsService);
    vi.spyOn(productService, 'getFeaturedProducts').mockReturnValue(
      throwError(() => new Error('Service error')),
    );
    component.ngOnInit();
    expect(component.isLoading()).toBeFalsy();
  });
});
