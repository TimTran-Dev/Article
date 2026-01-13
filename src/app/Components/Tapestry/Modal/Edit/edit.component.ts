import { Component, EventEmitter, Output, effect, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '../../Button/button.component';
import { Article } from '../../../../Models/content.interface';

/**
 * Interface for the Form Value to ensure submitForm remains type-safe
 * without using 'any'.
 */
interface ArticleFormValue {
  id: number | null;
  title: string | null;
  description: string | null;
  author: string | null;
  url: string | null;
  urlToImage: string | null;
  content: string | null;
  sourceId: string | null;
  sourceName: string | null;
}

@Component({
  selector: 'tap-edit-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
  templateUrl: 'edit.component.html',
})
export class EditModalComponent {
  private fb = inject(FormBuilder);

  // Input is now restricted to the flat Article type
  editArticle = input<Article | null>(null);
  isLoading = input<boolean>(false);

  // Strictly typed EventEmitter
  @Output() confirm = new EventEmitter<ArticleFormValue>();
  @Output() closeModal = new EventEmitter<void>();

  /**
   * Typed form group using non-nullable defaults where appropriate.
   */
  editForm = this.fb.group({
    id: new FormControl<number | null>(null),
    title: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(200)],
    }),
    description: new FormControl<string>('', { nonNullable: true }),
    author: new FormControl<string>('', { nonNullable: true }),
    url: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern('https?://.+')],
    }),
    urlToImage: new FormControl<string>('', { nonNullable: true }),
    content: new FormControl<string>('', { nonNullable: true }),
    sourceId: new FormControl<string>('', { nonNullable: true }),
    sourceName: new FormControl<string>('', { nonNullable: true }),
  });

  constructor() {
    effect(() => {
      const article = this.editArticle();
      if (article) {
        // Direct access: No casting, no union narrowing, no 'any'
        this.editForm.patchValue({
          id: article.id,
          title: article.title,
          author: article.author,
          description: article.description,
          url: article.url || '',
          urlToImage: article.imageUrl || '',
          content: article.content || article.body || '',
          sourceId: article.sourceId || '',
          sourceName: article.sourceName || '',
        });
      } else {
        this.resetForm();
      }
    });
  }

  resetForm(): void {
    this.editForm.reset();
    this.editForm.markAsPristine();
    this.editForm.markAsUntouched();
  }

  submitForm(): void {
    if (this.editForm.valid) {
      // Cast only to our internal interface, ensuring no 'any' enters the stream
      const value = this.editForm.value as ArticleFormValue;
      this.confirm.emit(value);
    } else {
      this.editForm.markAllAsTouched();
    }
  }

  getFieldError(field: keyof ArticleFormValue): string | null {
    const control = this.editForm.get(field);
    if (control && control.touched && control.errors) {
      if (control.errors['required']) return 'This field is required';
      if (control.errors['maxlength'])
        return `Maximum ${control.errors['maxlength'].requiredLength} characters`;
      if (control.errors['pattern']) return 'Please enter a valid URL (http/https)';
    }
    return null;
  }
}
