import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditModalComponent } from './edit.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonComponent } from '../../Button/button.component';
import { createArticleMock } from '../../../../Mocks/article.mock';

describe('EditModalComponent', () => {
  let component: EditModalComponent;
  let fixture: ComponentFixture<EditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditModalComponent, ReactiveFormsModule, NoopAnimationsModule, ButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Signal Effect Logic', () => {
    it('should patch form values when editArticle input changes', () => {
      const mockArticle = createArticleMock();

      fixture.componentRef.setInput('editArticle', mockArticle);
      fixture.detectChanges();

      expect(component.editForm.controls.title.value).toBe(mockArticle.title);
      expect(component.editForm.controls.id.value).toBe(mockArticle.id);
      expect(component.editForm.controls.url.value).toBe(mockArticle.url);
    });

    it('should reset the form when editArticle is null', () => {
      fixture.componentRef.setInput('editArticle', createArticleMock());
      fixture.detectChanges();

      fixture.componentRef.setInput('editArticle', null);
      fixture.detectChanges();

      expect(component.editForm.controls.title.value).toBe('');
      expect(component.editForm.pristine).toBe(true);
    });
  });

  describe('Form Validation', () => {
    it('should be invalid when required fields are missing', () => {
      component.editForm.controls.title.setValue('');
      component.editForm.controls.url.setValue('');

      expect(component.editForm.valid).toBe(false);
      expect(component.editForm.controls.title.errors?.['required']).toBeTruthy();
    });

    it('should validate the URL pattern', () => {
      const urlControl = component.editForm.controls.url;

      urlControl.setValue('not-a-url');
      expect(urlControl.errors?.['pattern']).toBeTruthy();

      urlControl.setValue('https://example.com');
      expect(urlControl.errors).toBeNull();
    });

    it('should return correct error messages via getFieldError', () => {
      const titleControl = component.editForm.controls.title;
      titleControl.setValue('');
      titleControl.markAsTouched();

      const errorMessage = component.getFieldError('title');
      expect(errorMessage).toBe('This field is required');
    });
  });

  describe('Submission', () => {
    it('should emit confirm event with form values when valid', () => {
      const emitSpy = vi.spyOn(component.confirm, 'emit');
      const mockArticle = createArticleMock();

      fixture.componentRef.setInput('editArticle', mockArticle);
      fixture.detectChanges();

      component.submitForm();

      expect(emitSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          id: mockArticle.id,
          title: mockArticle.title,
        }),
      );
    });

    it('should not emit if the form is invalid and mark fields as touched', () => {
      const emitSpy = vi.spyOn(component.confirm, 'emit');
      component.editForm.controls.title.setValue('');

      component.submitForm();

      expect(emitSpy).not.toHaveBeenCalled();
      expect(component.editForm.controls.title.touched).toBe(true);
    });
  });

  it('should emit closeModal event when cancelled', () => {
    const emitSpy = vi.spyOn(component.closeModal, 'emit');
    component.closeModal.emit();

    expect(emitSpy).toHaveBeenCalled();
  });
});
