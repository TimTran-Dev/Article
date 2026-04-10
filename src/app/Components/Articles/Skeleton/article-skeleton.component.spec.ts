import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArticleSkeletonComponent } from './article-skeleton.component';

describe('ArticleSkeletonComponent', () => {
  let fixture: ComponentFixture<ArticleSkeletonComponent>;
  let component: ArticleSkeletonComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleSkeletonComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(ArticleSkeletonComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });
});
