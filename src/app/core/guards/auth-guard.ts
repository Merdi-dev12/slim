import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

import { SessionService } from '@core/services/session.service';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const session = inject(SessionService);

  return session.isAuthenticated() || router.createUrlTree(['/']);
};
