import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ErrorHandlerService } from '../services/error-handler.service';
import { NotificationService } from '../services/notification.service';
import { inject } from '@angular/core';

export const errorInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const errorHandlerService = inject(ErrorHandlerService);
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    tap(event => {
      if (event instanceof HttpResponse) {
        // Log successful responses for debugging
        console.log(`✅ ${req.method} ${req.url} - Status: ${event.status}`);
      }
    }),
    catchError((error: HttpErrorResponse) => {
      console.error(`❌ ${req.method} ${req.url} - Status: ${error.status}`, error);

      // Handle different types of errors
      const errorInfo = handleError(error, req.url, errorHandlerService);

      // Show user-friendly notification
      notificationService.showError(errorInfo);

      // Log detailed error for debugging
      logDetailedError(error, req);

      return throwError(() => errorInfo);
    })
  );
};

function handleError(error: HttpErrorResponse, url: string, errorHandlerService: ErrorHandlerService): any {
  // Handle backend structured error responses
  if (error.error && error.error.errorCode) {
    return {
      errorCode: error.error.errorCode,
      message: error.error.userMessage || error.error.message,
      userMessage: error.error.userMessage,
      adminMessage: error.error.adminMessage,
      details: error.error.details,
      status: error.status,
      timestamp: error.error.timestamp,
      path: error.error.path
    };
  }

  // Handle standard HTTP errors
  return errorHandlerService.handleError(error, getContextFromUrl(url));
}

function getContextFromUrl(url: string): string {
  if (url.includes('/auth/')) return 'Authentification';
  if (url.includes('/operations/')) return 'Opération bancaire';
  if (url.includes('/comptes/')) return 'Gestion des comptes';
  if (url.includes('/clients/')) return 'Gestion des clients';
  if (url.includes('/dashboard/')) return 'Tableau de bord';
  return 'API';
}

function logDetailedError(error: HttpErrorResponse, req: HttpRequest<any>): void {
  const logData = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    status: error.status,
    statusText: error.statusText,
    error: error.error,
    headers: req.headers,
    body: req.body
  };

  // Log detailed error for administrators/developers
  console.group('🔍 Détails de l\'erreur HTTP');
  console.table(logData);
  
  if (error.error && error.error.adminMessage) {
    console.warn('📋 Message admin:', error.error.adminMessage);
  }
  
  if (error.error && error.error.details) {
    console.info('📝 Détails supplémentaires:', error.error.details);
  }
  
  console.groupEnd();

  // Store error for admin dashboard (if needed)
  storeErrorForAdmin(logData);
}

function storeErrorForAdmin(errorData: any): void {
  try {
    // Store recent errors in localStorage for admin dashboard
    const storedErrors = JSON.parse(localStorage.getItem('recentErrors') || '[]');
    storedErrors.unshift({
      ...errorData,
      id: Date.now(),
      resolved: false
    });
    
    // Keep only last 50 errors
    const recentErrors = storedErrors.slice(0, 50);
    localStorage.setItem('recentErrors', JSON.stringify(recentErrors));
  } catch (e) {
    console.warn('Impossible de stocker l\'erreur pour l\'admin:', e);
  }
}
