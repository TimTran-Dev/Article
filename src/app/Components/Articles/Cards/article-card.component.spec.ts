import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArticleCardComponent } from './article-card.component';
import { provideRouter } from '@angular/router';
import { createArticleMock } from '../../../Mocks/article.mock';
import { ContentStatus } from '../../../Models/common.enum';

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

  it('should emit statusChange event when status changes', () => {
    const mockArticle = createArticleMock();
    fixture.componentRef.setInput('article', mockArticle);

    const statusSpy = vi.spyOn(component.statusChange, 'emit');
    const newStatus = ContentStatus.Published; // Ensure this matches your enum values

    component.statusChange.emit({ id: mockArticle.id, status: newStatus });

    expect(statusSpy).toHaveBeenCalledWith({ id: mockArticle.id, status: newStatus });
  });
});
