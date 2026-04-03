import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VentaRequest, VentaResponse } from '../model/venta';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VentaService {
  // Ajusta el puerto si tu backend corre en otro (ej: 8080 o 8089)
  private http = inject(HttpClient);
  private apiUrl = environment.urlBackend;

  // constructor(private http: HttpClient) { }  

  // Método para el POST (Vender)
  realizarVenta(venta: VentaRequest): Observable<VentaResponse> {
    // return this.http.post<VentaResponse>(this.apiUrl, venta);
    return this.http.post<VentaResponse>(`${this.apiUrl}api/ventas`, venta);
  }

  // Método para el GET (Historial)
  getHistorial(): Observable<VentaResponse[]> {
    // return this.http.get<VentaResponse[]>(this.apiUrl);
    return this.http.get<VentaResponse[]>(`${this.apiUrl}api/ventas`);
  }
}