import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { inject } from '@angular/core';
import { map } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService: AuthService = inject(AuthService);
  const router = inject(Router);
  const expectedRole = route.data['role'];

  return authService.currentUser$.pipe(
    map((user) => {
      if (user?.role === expectedRole) {
        return true;
      } else {
        return router.createUrlTree(['/auth/login']);
      }
    }),
  );
};
