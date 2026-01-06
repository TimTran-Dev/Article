import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomePageComponent } from './homepage.component';

describe('HomePage Component', () => {
  let fixture: ComponentFixture<HomePageComponent>;
  let component: HomePageComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HomePageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
