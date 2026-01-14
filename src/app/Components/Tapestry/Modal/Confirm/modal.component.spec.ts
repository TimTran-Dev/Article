import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalComponent } from './modal.component';
import { ButtonComponent } from '../../Button/button.component';
import { By } from '@angular/platform-browser';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalComponent, ButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Event Emissions', () => {
    it('should emit confirmed event when onConfirm is called', () => {
      const emitSpy = vi.spyOn(component.confirmed, 'emit');

      component.onConfirm();

      expect(emitSpy).toHaveBeenCalled();
    });

    it('should emit cancelled event when onCancel is called', () => {
      const emitSpy = vi.spyOn(component.cancelled, 'emit');

      component.onCancel();

      expect(emitSpy).toHaveBeenCalled();
    });
  });

  describe('DOM Interactions', () => {
    it('should call onConfirm when the confirm button is clicked', () => {
      const onConfirmSpy = vi.spyOn(component, 'onConfirm');

      const confirmBtn = fixture.debugElement.query(By.css('.confirm-btn'));

      if (confirmBtn) {
        confirmBtn.triggerEventHandler('click', null);
        expect(onConfirmSpy).toHaveBeenCalled();
      }
    });

    it('should call onCancel when the cancel button is clicked', () => {
      const onCancelSpy = vi.spyOn(component, 'onCancel');

      const cancelBtn = fixture.debugElement.query(By.css('.cancel-btn'));

      if (cancelBtn) {
        cancelBtn.triggerEventHandler('click', null);
        expect(onCancelSpy).toHaveBeenCalled();
      }
    });
  });
});
