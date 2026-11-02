import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { UserLogin } from '../service/user-login';

let activeRequests = 0;

export const GlobalSpinner: HttpInterceptorFn = (req, next) => {
  const spinnerService = inject(UserLogin);

  if (activeRequests === 0) {
    spinnerService.show();
  }
  activeRequests++;

  return next(req).pipe(
    finalize(() => {
      activeRequests--;
      if (activeRequests === 0) {
        spinnerService.hide();
      }
    })
  );
};
