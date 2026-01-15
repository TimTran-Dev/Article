import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArticleCardComponent } from './article-card.component';
import { provideRouter } from '@angular/router';
import { createArticleMock } from '../../../Mocks/article.mock';

describe('ArticleCardComponent', () => {
  let fixture: ComponentFixture<ArticleCardComponent>;
  let component: ArticleCardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleCardComponent],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(ArticleCardComponent);
    component = fixture.componentInstance;

    const mockArticle = createArticleMock();
    fixture.componentRef.setInput('article', mockArticle);

    fixture.detectChanges();
  });

  it('should create', () => {
    const mockArticle = createArticleMock();

    fixture.componentRef.setInput('article', mockArticle);
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should create and receive the required article input', () => {
    const mockArticle = createArticleMock();

    fixture.componentRef.setInput('article', mockArticle);
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(component.article().id).toBe(mockArticle.id);
  });

  it('should emit edit event when edit is triggered', () => {
    const mockArticle = createArticleMock();
    fixture.componentRef.setInput('article', mockArticle);

    const editSpy = vi.spyOn(component.edit, 'emit');
    component.edit.emit(mockArticle);

    expect(editSpy).toHaveBeenCalledWith(mockArticle);
  });

  it('should emit delete event with article id', () => {
    const mockArticle = createArticleMock();
    fixture.componentRef.setInput('article', mockArticle);

    const deleteSpy = vi.spyOn(component.delete, 'emit');

    component.delete.emit(mockArticle.id);

    expect(deleteSpy).toHaveBeenCalledWith(mockArticle.id);
  });
});
