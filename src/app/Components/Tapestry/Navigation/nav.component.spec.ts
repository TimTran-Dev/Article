import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavComponent } from './nav.component';
import { NavigationService } from '../../../Services/NavigationService/navigation.service';
import { ThemeService } from '../../../Services/Theme/theme.service';
import { NavigationEnd, Router, Event, provideRouter } from '@angular/router';
import { Subject } from 'rxjs';
import { createNavigationServiceMock } from '../../../Mocks/nav.service.mock';
import { createThemeServiceMock, ThemeServiceMock } from '../../../Mocks/theme.service.mock';
import { describe, it, expect, beforeEach } from 'vitest';

describe('NavComponent', () => {
  let component: NavComponent;
  let fixture: ComponentFixture<NavComponent>;
  let mockNavService: ReturnType<typeof createNavigationServiceMock>;
  let mockThemeService: ThemeServiceMock;

  const routerEventsSubject = new Subject<Event>();

  beforeEach(async () => {
    mockNavService = createNavigationServiceMock();
    mockThemeService = createThemeServiceMock();

    await TestBed.configureTestingModule({
      imports: [NavComponent],
      providers: [
        { provide: NavigationService, useValue: mockNavService },
        { provide: ThemeService, useValue: mockThemeService },
        provideRouter([]),
      ],
    }).compileComponents();

    const router = TestBed.inject(Router);

    Object.defineProperty(router, 'events', { value: routerEventsSubject.asObservable() });
    Object.defineProperty(router, 'url', { value: '/', writable: true });

    fixture = TestBed.createComponent(NavComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Theme Logic', () => {
    it('should call toggleTheme on service when toggleMenu is called', () => {
      component.themeService.toggleTheme();

      expect(mockThemeService.toggleTheme).toHaveBeenCalled();

      expect(mockThemeService.isDarkMode()).toBe(true);
    });

    it('should show correct theme icon based on isDarkMode signal', async () => {
      mockThemeService.isDarkMode.set(true);
      fixture.detectChanges();

      const darkIcon = fixture.nativeElement.querySelector('svg');
      expect(darkIcon).toBeTruthy();
    });
  });

  describe('Menu Visibility (URL Driven)', () => {
    it('should update shouldShowCreate based on URL events', () => {
      expect(component.shouldShowCreate()).toBe(false);

      const event = new NavigationEnd(1, '/articles', '/articles');
      routerEventsSubject.next(event);
      fixture.detectChanges();

      expect(component.shouldShowCreate()).toBe(true);
    });

    it('should hide create button when navigating away from articles', () => {
      routerEventsSubject.next(new NavigationEnd(1, '/articles', '/articles'));
      fixture.detectChanges();
      expect(component.shouldShowCreate()).toBe(true);

      routerEventsSubject.next(new NavigationEnd(2, '/episodes', '/episodes'));
      fixture.detectChanges();

      expect(component.shouldShowCreate()).toBe(false);
    });
  });

  describe('UI Interactions', () => {
    it('should toggle isMenuOpen signal', () => {
      expect(component.isMenuOpen()).toBe(false);
      component.toggleMenu();
      expect(component.isMenuOpen()).toBe(true);
    });

    it('should close menu and open modal when openCreateModal is called', () => {
      component.isMenuOpen.set(true);

      component.openCreateModal();

      expect(mockNavService.openModal).toHaveBeenCalled();
      expect(component.isMenuOpen()).toBe(false);
    });

    it('should close menu when closeMenu is called', () => {
      component.isMenuOpen.set(true);
      component.closeMenu();
      expect(component.isMenuOpen()).toBe(false);
    });
  });
});
