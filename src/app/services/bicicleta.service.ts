import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bicicleta } from '../model/bicicleta';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BicicletaService {
  private apiUrl = environment.urlBackend; 

  constructor(private http: HttpClient) { }

  getBicicletas(): Observable<Bicicleta[]> {
    return this.http.get<Bicicleta[]>(`${this.apiUrl}/bicicletas`); 
  }

  createBicicleta(bicicleta: Bicicleta): Observable<Bicicleta> {
    return this.http.post<Bicicleta>(`${this.apiUrl}/bicicletas`, bicicleta); 
  }

  // Corregido: Agregada la ruta /bicicletas/id
  deleteBicicleta(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/bicicletas/${id}`);
  }
}