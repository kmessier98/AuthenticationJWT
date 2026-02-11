import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { SKIP_AUTH_REDIRECT } from './skip-redirect.token';

export const httpRequestInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const token = localStorage.getItem('auth_token');

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const skipRedirect = req.context.get(SKIP_AUTH_REDIRECT); 
  
      if (skipRedirect)
      {
        // A utiliser si on ne veut pas de redirection pour une requete specifique
        // Voici comment l'utiliser dans une requete HTTP :
        // this.http.put(url, data, { context: new HttpContext().set(SKIP_AUTH_REDIRECT, true) })
        // SKIP_AUTH_REDIRECT provient du fichier skip-redirect.token.ts (que j'ai créé)
      }

       if (error.status === 0) {
        // ERREUR RESEAU
        console.error('Backend unreachable:', error);
        router.navigate(['/network-error']);
      }
      else if (error.status === 401) {
        // Token expired or invalid
        authService.logout();
        router.navigate(['/auth/login']);
      }
      return throwError(() => error); // renvoie l'erreur pour le subscribe normal
    }),
  );
};
