import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArticleComponent } from './article.component';

describe('Article Component', () => {
  let fixture: ComponentFixture<ArticleComponent>;
  let component: ArticleComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ArticleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
