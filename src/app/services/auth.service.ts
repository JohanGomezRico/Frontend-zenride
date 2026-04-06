import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Aquí va tu enlace real de Railway apuntando al controlador Auth
  private apiUrl = 'https://project-zenride-production.up.railway.app/api/auth';
  
  // El nombre con el que guardaremos el token en la memoria del navegador
  private tokenKey = 'zenride_token';

  constructor(private http: HttpClient) { }

  // 1. Método para iniciar sesión
  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password })
      .pipe(
        tap(response => {
          // Si el backend nos responde con el token, lo guardamos inmediatamente
          if (response && response.token) {
            this.setToken(response.token);
          }
        })
      );
  }

  // 2. Guardar el token en el LocalStorage
  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  // 3. Obtener el token (lo usaremos más adelante para el Interceptor)
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // 4. Verificar si hay un usuario logueado
  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  // 5. Cerrar sesión (simplemente borramos el token)
  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }
}
