import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { ToastService } from '../Services/Toast/toast.service';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage: string;

      if (error.error instanceof ErrorEvent) {
        errorMessage = `Network Error: ${error.error.message}`;
      } else {
        errorMessage = error.error?.message || error.statusText || 'An unknown error occurred.';
      }

      toastService.show(errorMessage, 'error');

      return throwError(() => error);
    }),
  );
};
