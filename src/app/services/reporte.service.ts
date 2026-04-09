import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {

  private http = inject(HttpClient);
  private baseUrl = environment.urlBackend.replace(/\/$/, '');
  private apiUrl = `${this.baseUrl}/api/reportes`;

  // 👇 1. Actualizamos getResumen para recibir los 5 parámetros
  getResumen(fechaInicio: string, fechaFin: string, tipo: string, marca: string, vendedor: string): Observable<any> {
    let params = new HttpParams()
      .set('fechaInicio', fechaInicio)
      .set('fechaFin', fechaFin)
      .set('tipo', tipo)
      .set('marca', marca)
      .set('vendedor', vendedor);

    return this.http.get<any>(`${this.apiUrl}/resumen`, { params });
  }

  // 👇 2. Actualizamos descargarPdf para que el PDF también salga filtrado
  descargarPdf(fechaInicio: string, fechaFin: string, tipo: string, marca: string, vendedor: string): Observable<Blob> {
    let params = new HttpParams()
      .set('fechaInicio', fechaInicio)
      .set('fechaFin', fechaFin)
      .set('tipo', tipo)
      .set('marca', marca)
      .set('vendedor', vendedor);

    return this.http.get(`${this.apiUrl}/descargar-pdf`, { params, responseType: 'blob' });
  }
}