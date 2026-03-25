export interface Bicicleta {
  id?: number;
  codigo: string;
  marca: string;
  modelo: string;
  tipo: 'Montaña' | 'Ruta' | 'Urbana' | 'Electrica'; // ✅ Coincide con tu Enum de Java
  precioVenta: number;
  stockActual: number; // ✅ Añadido para que coincida con la Entidad
}