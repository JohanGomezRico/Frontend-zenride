export interface Bicicleta {
  idBicicleta?: number;
  codigoBicicleta: string;
  marcaBicicleta: string;
  modeloBicicleta: string;
  tipoBicicleta: 'Montaña' | 'Ruta' | 'Urbana';
  precioVenta: number;
  stockBicicleta: number;
}