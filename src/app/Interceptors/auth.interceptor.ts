import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../Services/Authorization/auth.service';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);

  // Convert the Promise from Clerk into an Observable
  return from(auth.getToken()).pipe(
    switchMap((token) => {
      if (token) {
        // Clone the request and add the Bearer token
        const authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });
        return next(authReq);
      }
      // If no token, just send the original request
      return next(req);
    }),
  );
};
