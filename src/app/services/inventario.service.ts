import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InventarioMovimiento } from '../model/inventario-movimiento';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {

  private http = inject(HttpClient);
  private apiUrl = environment.urlBackend; 

  // constructor(private http: HttpClient) { }

  registrarMovimiento(movimiento: any): Observable<any> {
    // return this.http.post<any>(this.apiUrl, movimiento);
    return this.http.post<any>(`${this.apiUrl}api/movimiento`, movimiento);
  }

  // 🚩 CORRECCIÓN AQUÍ: Añadimos '/movimientos' para que coincida con el @GetMapping del Controller
 getMovimientos(): Observable<any[]> {
  // Asegúrate de que termine en /movimientos como tu Backend
  // return this.http.get<any[]>(`${this.apiUrl}/movimientos`);
  return this.http.get<any[]>(`${this.apiUrl}api/inventario/movimientos`);
}
}