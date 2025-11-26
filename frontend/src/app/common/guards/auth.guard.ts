import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { HeaderService } from '../services/header.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const headerService = inject(HeaderService);
  const router = inject(Router);
  const token = authService.getToken();
  if(authService.isAuthenticated()){
    if(token){
      headerService.setHeaders('default', 'Authorization', token);
    }
    return true;
  }else{
    router.navigate(['/login']);
    return false;
  }
};
