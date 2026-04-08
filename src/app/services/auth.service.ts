import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Aquí va tu enlace real de Railway apuntando al controlador Auth
  //private apiUrl = 'https://project-zenride-production.up.railway.app/api/auth';
  private apiUrl = 'http://localhost:8080/api/auth';
  
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

  // NUEVO MÉTODO: Para registrar clientes desde la página web
  registroCliente(datosUsuario: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/registro-cliente`, datosUsuario)
      .pipe(
        tap(response => {
          // Si el registro es exitoso, el backend nos devuelve el token.
          // Lo guardamos inmediatamente para que el cliente quede logueado.
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

  // 4. Método para leer el contenido del token
  getDecodedToken(): any {
    const token = this.getToken();
    if (!token) return null;

    try {
      // El token tiene 3 partes separadas por un punto. La posición [1] son los datos (payload)
      const payload = token.split('.')[1];
      // atob() desencripta la base64
      const decodedPayload = atob(payload);
      return JSON.parse(decodedPayload);
    } catch (error) {
      console.error("Error al decodificar el token", error);
      return null;
    }
  }

  // Método para verificar si es ADMIN o VENDEDOR
  isAdmin(): boolean {
    const tokenData = this.getDecodedToken();
    if (!tokenData) return false;

    console.log("🕵️‍♂️ Contenido del Token:", tokenData);

    // Convertimos todo a texto por si Spring Boot guarda el rol como un objeto (authorities) o un string simple
    const tokenString = JSON.stringify(tokenData);
    
    // Si el token contiene la palabra ADMIN o VENDEDOR, le damos acceso total
    return tokenString.includes('ADMIN') || tokenString.includes('VENDEDOR');
  }

  // 👇 NUEVO MÉTODO: Verifica si es EXCLUSIVAMENTE Administrador
  isMasterAdmin(): boolean {
    const tokenData = this.getDecodedToken();
    if (!tokenData) return false;

    const tokenString = JSON.stringify(tokenData);
    // Solo devuelve true si encuentra específicamente la palabra ADMIN
    return tokenString.includes('ADMIN');
  }

  // Verifica si es específicamente un VENDEDOR
  isVendedor(): boolean {
    const tokenData = this.getDecodedToken();
    if (!tokenData) return false;
    return JSON.stringify(tokenData).includes('VENDEDOR');
  }

  // 1. Método para obtener la lista de usuarios
  obtenerUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/usuarios`);
  }

  eliminarUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/usuarios/${id}`);
  }

  // 2. Método para actualizar el rol de un usuario
  actualizarRol(id: number, nuevoRol: string): Observable<any> {
    // Usamos HttpParams porque en el backend lo pusimos como @RequestParam
    return this.http.put(`${this.apiUrl}/usuarios/${id}/rol?nuevoRol=${nuevoRol}`, {});
  }

  // 2. Método para registrar un Admin o Vendedor (usa el endpoint original de Spring Boot)
  registroAdmin(datosUsuario: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, datosUsuario);
  }

  // 5. Verificar si hay un usuario logueado
  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  // 6. Cerrar sesión (simplemente borramos el token)
  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }
}
