import { Injectable, signal } from '@angular/core';
import { Clerk } from '@clerk/clerk-js';
import { UserResource } from '@clerk/types';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private clerk = new Clerk(environment.clearkKey);

  user = signal<UserResource | null>(null);
  loaded = signal<boolean>(false);

  async init(): Promise<void> {
    await this.clerk.load();

    this.user.set(this.clerk.user ?? null);
    this.loaded.set(true);

    this.clerk.addListener((state) => {
      this.user.set(state.user ?? null);
    });
  }

  public getClerkInstance(): Clerk {
    return this.clerk;
  }

  signIn(): void {
    this.clerk.openSignIn();
  }

  async getToken(): Promise<string | null> {
    if (!this.clerk.session) {
      return null;
    }
    return await this.clerk.session.getToken();
  }
}
