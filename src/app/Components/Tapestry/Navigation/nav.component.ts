import { Component, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NavigationService } from '../../../Services/NavigationService/navigation.service';
import { filter, map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'tap-nav',
  templateUrl: './nav.component.html',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
})
export class NavComponent {
  private navService = inject(NavigationService);
  private router = inject(Router);

  isMenuOpen = signal(false);

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

  private currentUrl = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event: NavigationEnd) => event.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  shouldShowCreate = computed(() => {
    const url = this.currentUrl();
    return url.startsWith('/articles');
  });
}
