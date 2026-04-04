import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {

  private http = inject(HttpClient);
  private apiUrl = environment.urlBackend;

  // Obtener los datos para las tarjetas
  getResumen(fechaInicio: string, fechaFin: string): Observable<any> {
    let params = new HttpParams()
      .set('fechaInicio', fechaInicio)
      .set('fechaFin', fechaFin);
    return this.http.get<any>(`${this.apiUrl}api/reportes/resumen`, { params });
  }

  // Descargar el PDF
  descargarPdf(fechaInicio: string, fechaFin: string): Observable<Blob> {
    let params = new HttpParams()
      .set('fechaInicio', fechaInicio)
      .set('fechaFin', fechaFin);
    // IMPORTANTE: responseType 'blob' para manejar archivos
    return this.http.get(`${this.apiUrl}api/reportes/descargar-pdf`, { params, responseType: 'blob' });
  }
}