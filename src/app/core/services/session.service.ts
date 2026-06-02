import { Injectable, signal } from '@angular/core';

import { User } from '@core/models/user';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly currentUser = signal<User | null>(null);

  readonly user = this.currentUser.asReadonly();
  readonly isAuthenticated = () => this.currentUser() !== null;
}
