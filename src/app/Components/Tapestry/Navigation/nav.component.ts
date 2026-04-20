import { Component, computed, effect, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NavigationService } from '../../../Services/NavigationService/navigation.service';
import { filter, map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { ThemeService } from '../../../Services/Theme/theme.service';
import { AuthService } from '../../../Services/Authorization/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
})
export class NavComponent {
  private navService = inject(NavigationService);
  private router = inject(Router);
  themeService = inject(ThemeService);
  auth = inject(AuthService);

  isMenuOpen = signal(false);

  constructor() {
    effect(() => {
      const user = this.auth.user();
      if (user) {
        setTimeout(() => this.mountUserButton(), 0);
      }
    });
  }

  toggleMenu(): void {
    this.isMenuOpen.update((v) => !v);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  openCreateModal(): void {
    this.navService.openModal();
    this.isMenuOpen.set(false);
  }

  private mountUserButton(): void {
    const clerk = this.auth.getClerkInstance();
    const appearance = {
      variables: { colorPrimary: '#2563eb' },
    };

    const desktopEl = document.getElementById('clerk-user-button');
    if (desktopEl) {
      clerk?.mountUserButton(desktopEl as HTMLDivElement, { appearance });
    }

    const mobileEl = document.getElementById('clerk-user-button-mobile');
    if (mobileEl) {
      clerk?.mountUserButton(mobileEl as HTMLDivElement, { appearance });
    }
  }

  private currentUrl = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event: NavigationEnd) => event.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  shouldShowCreate = computed(() => {
    const url = this.currentUrl();
    const isLoggedIn = !!this.auth.user();
    return isLoggedIn && url === '/my-articles';
  });
}
