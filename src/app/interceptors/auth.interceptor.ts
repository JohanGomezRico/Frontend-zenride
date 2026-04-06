import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Inyectamos nuestro servicio de autenticación
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Si tenemos un token guardado, clonamos la petición y le pegamos el pase VIP
  if (token) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    // Enviamos la petición modificada hacia Railway
    return next(clonedReq);
  }

  // Si no hay token (por ejemplo, al intentar iniciar sesión), la dejamos pasar normal
  return next(req);
};;
