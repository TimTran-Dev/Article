import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductsService } from '../../Services/Products/products.service';
import { SegmentComponent } from './segment.component';
import { provideRouter } from '@angular/router';
import { mockProductsService } from '../../Mocks/product.service.mock';
import { throwError } from 'rxjs';
import { vi } from 'vitest';

import { DropdownComponent } from '../Tapestry/Dropdown/dropdown.component';
import { LoadingComponent } from '../Tapestry/Loading/loading.component';

describe('Segment Component', () => {
  let fixture: ComponentFixture<SegmentComponent>;
  let component: SegmentComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SegmentComponent, DropdownComponent, LoadingComponent],
      providers: [{ provide: ProductsService, useValue: mockProductsService }, provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(SegmentComponent);
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

  it('should handle error during segment loading', () => {
    const productService = TestBed.inject(ProductsService);

    vi.spyOn(productService, 'getArticles').mockReturnValue(
      throwError(() => new Error('Service error')),
    );

    component.ngOnInit();
    expect(component.isLoading()).toBeFalsy();
  });
});
