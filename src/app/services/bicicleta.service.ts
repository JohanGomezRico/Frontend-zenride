import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bicicleta } from '../interfaces/bicicleta';

@Injectable({
  providedIn: 'root'
})
export class BicicletaService {
  private apiUrl = 'http://localhost:8080/api/bicicletas'; 

  constructor(private http: HttpClient) { }

  getBicicletas(): Observable<Bicicleta[]> {
    return this.http.get<Bicicleta[]>(this.apiUrl);
  }
}