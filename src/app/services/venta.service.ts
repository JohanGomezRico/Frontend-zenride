import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VentaRequest, VentaResponse } from '../model/venta';

@Injectable({
  providedIn: 'root'
})
export class VentaService {
  // Ajusta el puerto si tu backend corre en otro (ej: 8080 o 8089)
  private apiUrl = 'http://localhost:8089/api/ventas';

  constructor(private http: HttpClient) { }

  // Método para el POST (Vender)
  realizarVenta(venta: VentaRequest): Observable<VentaResponse> {
    return this.http.post<VentaResponse>(this.apiUrl, venta);
  }

  // Método para el GET (Historial)
  getHistorial(): Observable<VentaResponse[]> {
    return this.http.get<VentaResponse[]>(this.apiUrl);
  }
}