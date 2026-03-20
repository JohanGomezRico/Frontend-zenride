import { Injectable } from '@angular/core';
import { Bicicleta } from '../interfaces/bicicleta';

@Injectable({
  providedIn: 'root'
})
export class BicicletaService {

  // Datos simulados (Mock Data) con IDs numéricos
  private bicicletasMock: Bicicleta[] = [
    {
      idBicicleta: 1,
      codigoBicicleta: 'MTB-001',
      marcaBicicleta: 'Trek',
      modeloBicicleta: 'Marlin 7',
      tipoBicicleta: 'Montaña',
      precioVenta: 2500000,
      stockBicicleta: 5
    },
    {
      idBicicleta: 2,
      codigoBicicleta: 'RUT-002',
      marcaBicicleta: 'Specialized',
      modeloBicicleta: 'Allez',
      tipoBicicleta: 'Ruta',
      precioVenta: 3200000,
      stockBicicleta: 3
    },
    {
      idBicicleta: 3,
      codigoBicicleta: 'URB-003',
      marcaBicicleta: 'GW',
      modeloBicicleta: 'Bogotá',
      tipoBicicleta: 'Urbana',
      precioVenta: 1100000,
      stockBicicleta: 10
    }
  ];

  constructor() { }

  getBicicletas(): Bicicleta[] {
    return this.bicicletasMock;
  }
}