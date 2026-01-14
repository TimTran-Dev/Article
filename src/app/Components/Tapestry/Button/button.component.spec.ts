import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button.component';
import { By } from '@angular/platform-browser';

describe('ButtonComponent', () => {
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    fixture.componentRef.setInput('buttonText', 'Submit');
    fixture.detectChanges();
  });

  const getButton = (): HTMLButtonElement =>
    fixture.debugElement.query(By.css('button')).nativeElement;

  it('should apply secondary classes by default', () => {
    const btn = getButton();
    // Verify specific classes from the secondary map
    expect(btn.classList.contains('bg-gray-100')).toBe(true);
    expect(btn.classList.contains('text-gray-700')).toBe(true);
  });

  it('should switch to primary classes when variant changes', () => {
    fixture.componentRef.setInput('variant', 'primary');
    fixture.detectChanges();

    const btn = getButton();
    expect(btn.classList.contains('bg-blue-600')).toBe(true);
    expect(btn.classList.contains('text-white')).toBe(true);
    // Ensure old classes are removed
    expect(btn.classList.contains('bg-gray-100')).toBe(false);
  });

  it('should switch to danger classes when variant changes', () => {
    fixture.componentRef.setInput('variant', 'danger');
    fixture.detectChanges();

    const btn = getButton();
    expect(btn.classList.contains('bg-red-600')).toBe(true);
    expect(btn.classList.contains('text-white')).toBe(true);
  });

  it('should maintain base layout classes regardless of variant', () => {
    const btn = getButton();
    expect(btn.classList.contains('px-4')).toBe(true);
    expect(btn.classList.contains('rounded-lg')).toBe(true);
  });
});
