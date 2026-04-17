import { Component, EventEmitter, Output, effect, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '../../Button/button.component';
import { Article } from '../../../../Models/content.interface';

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
  selector: 'app-edit-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
  templateUrl: 'edit.component.html',
})
export class EditModalComponent {
  private fb = inject(FormBuilder);

  editArticle = input<Article | null>(null);
  isLoading = input<boolean>(false);

  @Output() confirm = new EventEmitter<ArticleFormValue>();
  @Output() closeModal = new EventEmitter<void>();

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
        this.editForm.patchValue({
          id: article.id,
          title: article.title,
          author: article.author,
          description: article.description,
          url: article.url || '',
          urlToImage: article.imageUrl || '',
          content: article.content || article.body || '',
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
