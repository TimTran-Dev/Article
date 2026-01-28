import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingComponent } from './loading.component';
import { By } from '@angular/platform-browser';

describe('LoadingComponent', () => {
  let component: LoadingComponent;
  let fixture: ComponentFixture<LoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display the default loading text in the heading', () => {
    const heading = fixture.debugElement.query(By.css('h2'));

    expect(heading).toBeTruthy();
    expect(heading.nativeElement.textContent?.trim()).toBe('Loading content...');
  });

  it('should update the heading when loadingText input changes', () => {
    const customText = 'Updating News...';
    fixture.componentRef.setInput('loadingText', customText);
    fixture.detectChanges();

    const heading = fixture.debugElement.query(By.css('h2'));

    expect(heading.nativeElement.textContent?.trim()).toBe(customText);
  });

  it('should have the pulse animation decorative elements', () => {
    const pulseBars = fixture.debugElement.queryAll(By.css('.animate-pulse'));

    expect(pulseBars.length).toBeGreaterThan(0);
  });
});
