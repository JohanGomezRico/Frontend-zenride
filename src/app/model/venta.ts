export interface DetalleVentaRequest {
  bicicletaId: number;
  cantidad: number;
}

export interface VentaRequest {
  clienteId: number;
  detalles: DetalleVentaRequest[];
}


export interface VentaResponse {
  id: number;
  fechaVenta: string;
  totalVenta: number;
  nombreCliente: string;
  documento: string; // 👈 Coincide con tu DTO de Java
  detalles: any[];
}