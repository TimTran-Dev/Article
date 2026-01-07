import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DropdownComponent } from './dropdown.component';

describe('DropdownComponent', () => {
  let fixture: ComponentFixture<DropdownComponent<string | number>>;
  let component: DropdownComponent<string | number>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropdownComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownComponent<string | number>);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit selected value on selection', () => {
    vi.spyOn(component.selectionChange, 'emit');
    const testValue = 'test';
    component.selectOption(testValue);
    expect(component.selectionChange.emit).toHaveBeenCalledWith(testValue);
  });

  it('should toggle dropdown open state', () => {
    const initialState = component.isOpen();
    component.toggleDropdown();
    expect(component.isOpen()).toBe(!initialState);
  });
});
