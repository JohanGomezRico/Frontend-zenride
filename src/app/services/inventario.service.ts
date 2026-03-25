import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InventarioMovimiento } from '../model/inventario-movimiento';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {

  private apiUrl = 'http://localhost:8089/api/inventario'; 

  constructor(private http: HttpClient) { }

  registrarMovimiento(movimiento: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, movimiento);
  }

  // 🚩 CORRECCIÓN AQUÍ: Añadimos '/movimientos' para que coincida con el @GetMapping del Controller
 getMovimientos(): Observable<any[]> {
  // Asegúrate de que termine en /movimientos como tu Backend
  return this.http.get<any[]>(`${this.apiUrl}/movimientos`);
}
}