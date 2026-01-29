import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);

  return next(req).pipe(
      catchError((error: HttpErrorResponse) => {
          let errorMessage = 'An unexpected error occurred.';

          if (error.error instanceof ErrorEvent) {
              // Client-side error
              errorMessage = `Error: ${error.error.message}`;
          } else {
              // Server-side error
              if (error.status === 401) {
                  // For login endpoint, let the component handle the specific message (e.g. "Invalid credentials")
                  if (req.url.includes('auth/login')) {
                    return throwError(() => error);
                  }
                  errorMessage = 'Unauthorized access.';
              } else if (error.status === 403) {
                  errorMessage = 'Access denied.';
              } else if (error.status === 404) {
                 errorMessage = 'Resource not found.';
              } else if (error.status >= 500) {
                  errorMessage = 'Server error. Please try again later.';
              } else {
                 // Other errors (400 bad request etc)
                 // We might want to show the message from backend if available
                 errorMessage = error.error?.message || `Error Code: ${error.status}`;
              }
          }

          // We don't want to double-notify if the component handles it well, 
          // but the user asked for "anything that fails". 
          // To be safe and minimal: I will show it. 
          // If the login page shows one too, it's acceptable for now to ensure coverage.
          // However, for Login specifically, the component shows a nice message. 
          // The interceptor might show "Error Code: 401" or "Unauthorized".
          
          notificationService.showError(errorMessage);
          
          return throwError(() => error);
      })
  );
};
