import { CanActivateFn, Router } from '@angular/router';
import { UserLogin } from '../service/user-login';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(UserLogin);
  const router = inject(Router);
  const isUserLoggedIn = !!authService.loggedInUser; 

  if (isUserLoggedIn) {
    return true;
  } else {
    router.navigateByUrl('/login'); 
    return false;
  }
};
