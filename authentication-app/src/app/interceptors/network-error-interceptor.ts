import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const networkErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 0) {
        // ERREUR RESEAU
        console.error('Backend unreachable:', error);
        router.navigate(['/network-error']);
      }
      return throwError(() => error); // renvoie l'erreur pour le subscribe normal
    }),
  );
};
