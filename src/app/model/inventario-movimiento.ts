export interface InventarioMovimiento {
  id?: number;
  bicicletaCodigo: string; // Coincide con el Mapper
  nombreBicicleta: string; // Coincide con el Mapper
  tipoMovimiento: 'ENTRADA' | 'SALIDA';
  cantidad: number;
  responsableOperacion: string;
  fechaMovimiento: string;
  descripcion: string;
}