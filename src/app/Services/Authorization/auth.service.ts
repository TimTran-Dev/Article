import { Injectable, signal } from '@angular/core';
// Import 'Clerk' as the instance type and 'UserResource' for the signal
import type { Clerk, UserResource } from '@clerk/types';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Use the 'Clerk' interface from @clerk/types
  private clerk: Clerk | null = null;

  user = signal<UserResource | null>(null);
  loaded = signal<boolean>(false);

  async init(): Promise<void> {
    // 1. Dynamically import the library
    const module = await import('@clerk/clerk-js');

    if (!this.clerk) {
      this.clerk = new module.Clerk(environment.clearkKey) as Clerk;
    }
    await (this.clerk as Clerk & { load: () => Promise<void> }).load();

    this.user.set(this.clerk.user ?? null);
    this.loaded.set(true);

    this.clerk.addListener((state) => {
      this.user.set(state.user ?? null);
    });
  }

  public getClerkInstance(): Clerk | null {
    return this.clerk;
  }

  signIn(): void {
    this.clerk?.openSignIn();
  }

  async getToken(): Promise<string | null> {
    if (!this.clerk?.session) {
      return null;
    }
    return await this.clerk.session.getToken();
  }
}
