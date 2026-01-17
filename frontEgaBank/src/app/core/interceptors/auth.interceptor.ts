import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';

// Intercepteur d'authentification: ajoute Authorization si un token est présent
export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const router = inject(Router);

  try {
    const token = localStorage.getItem('token');

    let cloned = req;

    // Ajouter le header Authorization si un token est présent
    if (token) {
      cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      });
    } else {
      // Conserver withCredentials pour cookies si nécessaire
      cloned = req.clone({ withCredentials: true });
    }

    return next(cloned).pipe(
      catchError((error: HttpErrorResponse) => {
        // Gestion basique des 401/403: on laisse remonter l'erreur après un éventuel traitement
        if (error.status === 401 || error.status === 403) {
          // Optionnel: redirection conditionnelle sur des routes admin
          // Exemple: si l'URL cible un endpoint d'admin, on peut rediriger vers une page de login admin
          // if (cloned.url.includes('/api/v1/')) {
          //   router.navigate(['/login']);
          // }
        }
        return throwError(() => error);
      })
    );
  } catch (e) {
    // En cas d'erreur inattendue, poursuivre la requête sans modification
    return next(req);
  }
};
