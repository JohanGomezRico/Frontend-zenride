import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // El portero revisa si el usuario tiene la manilla VIP (el token)
  if (authService.isLoggedIn()) {
    return true; // ¡Lo deja pasar a la página!
  } else {
    // No tiene token, lo enviamos directo al Login
    router.navigate(['/login']); 
    return false; // Le bloquea el acceso a la ruta oculta
  }
};
