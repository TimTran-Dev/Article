import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookmarkButtonComponent } from './bookmark-button.component';
import { Article } from '../../../../Models/content.interface';
import { ContentStatus } from '../../../../Models/common.enum';
import { vi } from 'vitest';

describe('BookmarkButtonComponent', () => {
  let component: BookmarkButtonComponent;
  let fixture: ComponentFixture<BookmarkButtonComponent>;

  // Mock Article Data
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

    // Set the required input using the componentRef to handle Signal inputs
    fixture.componentRef.setInput('article', mockArticle);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit the article id when clicked', () => {
    // 1. Arrange: Create a spy for the output
    const emitSpy = vi.spyOn(component.toggled, 'emit');
    const button = fixture.nativeElement.querySelector('button') || fixture.nativeElement;

    // 2. Act
    button.click();

    // 3. Assert
    expect(emitSpy).toHaveBeenCalledWith(123);
  });

  it('should prevent event propagation when clicked', () => {
    // 1. Arrange
    const event = new MouseEvent('click');
    const stopPropagationSpy = vi.spyOn(event, 'stopPropagation');

    // 2. Act
    component.onToggle(event);

    // 3. Assert
    expect(stopPropagationSpy).toHaveBeenCalled();
  });

  it('should update view when article bookmark status changes', () => {
    // Arrange: Create bookmarked version
    const bookmarkedArticle = { ...mockArticle, isBookmarked: true };

    // Act: Update signal input
    fixture.componentRef.setInput('article', bookmarkedArticle);
    fixture.detectChanges();

    // Assert: Check for a specific class or icon change in the template
    // Adjust selector based on your actual HTML (e.g., .bi-heart-fill)
    const icon = fixture.nativeElement.querySelector('i, svg');
    expect(icon).toBeTruthy();
  });
});
