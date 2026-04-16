import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookmarkButtonComponent } from './bookmark-button.component';
import { Article } from '../../../../Models/content.interface';
import { ContentStatus } from '../../../../Models/common.enum';
import { vi } from 'vitest';

describe('BookmarkButtonComponent', () => {
  let component: BookmarkButtonComponent;
  let fixture: ComponentFixture<BookmarkButtonComponent>;

  const mockArticle: Article = {
    id: 123,
    ownerId: 1,
    contentType: 'Article',
    contentStatus: ContentStatus.Published,
    isDeleted: false,
    title: 'Test Article',
    author: 'Test Author',
    description: 'Test Desc',
    body: 'Test Body',
    imageUrl: 'test.jpg',
    url: 'test.com',
    content: 'test content',
    sourceId: '1',
    sourceName: 'Source',
    isBookmarked: false,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookmarkButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BookmarkButtonComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('article', mockArticle);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit the article id when clicked', () => {
    const emitSpy = vi.spyOn(component.toggled, 'emit');
    const button = fixture.nativeElement.querySelector('button') || fixture.nativeElement;

    button.click();

    expect(emitSpy).toHaveBeenCalledWith(123);
  });

  it('should prevent event propagation when clicked', () => {
    const event = new MouseEvent('click');
    const stopPropagationSpy = vi.spyOn(event, 'stopPropagation');

    component.onToggle(event);

    expect(stopPropagationSpy).toHaveBeenCalled();
  });

  it('should update view when article bookmark status changes', () => {
    const bookmarkedArticle = { ...mockArticle, isBookmarked: true };

    fixture.componentRef.setInput('article', bookmarkedArticle);
    fixture.detectChanges();
    const icon = fixture.nativeElement.querySelector('i, svg');
    expect(icon).toBeTruthy();
  });
});
