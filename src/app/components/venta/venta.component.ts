import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VentaService } from '../../services/venta.service';
import { ClienteService } from '../../services/cliente.service';
import { BicicletaService } from '../../services/bicicleta.service';
import { VentaResponse, VentaRequest } from '../../model/venta';

// Angular Material
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatIconModule, MatButtonModule, 
    MatFormFieldModule, MatInputModule, MatSelectModule, MatTableModule, MatTooltipModule
  ],
  templateUrl: './venta.component.html',
  styleUrl: './venta.component.scss'
})
export class VentasComponent implements OnInit {
  clientes: any[] = [];
  bicicletas: any[] = [];
  historialVentas: VentaResponse[] = [];
  
  clienteId: number | null = null;
  biciSeleccionada: any = null;
  cantidadVenta: number = 1;
  carrito: any[] = [];
  
  filtroClienteCC: string = '';
  filtroBiciCodigo: string = '';
  filtroHistorial: string = '';

  displayedColumnsCarrito = ['producto', 'precio', 'cantidad', 'subtotal', 'acciones'];
  // AÑADIDO: 'documento' a las columnas del historial
  displayedColumnsHistorial = ['id', 'fecha', 'cliente', 'documento', 'total', 'acciones'];

  constructor(
    private ventaService: VentaService,
    private clienteService: ClienteService,
    private biciService: BicicletaService
  ) {}

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.clienteService.getClientes().subscribe(res => this.clientes = res || []);
    this.biciService.getBicicletas().subscribe(res => this.bicicletas = res || []);
    this.ventaService.getHistorial().subscribe(res => this.historialVentas = res || []);
  }

  // --- BUSCADORES CORREGIDOS ---

  get clientesFiltrados() {
    const f = this.filtroClienteCC?.trim();
    if (!f) return this.clientes;
    // Buscamos por la propiedad 'documento' que es la que usas en el sistema
    return this.clientes.filter(c => c.documento && c.documento.includes(f));
  }

  get bicisFiltradas() {
    const f = this.filtroBiciCodigo?.toLowerCase().trim();
    if (!f) return this.bicicletas;
    return this.bicicletas.filter(b => b.codigo && b.codigo.toLowerCase().includes(f));
  }

  get historialFiltrado() {
    const f = this.filtroHistorial?.toLowerCase().trim();
    if (!f) return this.historialVentas;

    return this.historialVentas.filter(v => {
      const coincideCabecera = 
        v.id?.toString().includes(f) || 
        v.nombreCliente?.toLowerCase().includes(f) || 
        v.documento?.includes(f) || // 👈 AHORA FILTRA POR DOCUMENTO
        v.fechaVenta?.includes(f);

      const coincideDetalle = v.detalles?.some((d: any) => 
        (d.marcaBicicleta || d.nombreBicicleta)?.toLowerCase().includes(f)
      );
      return coincideCabecera || coincideDetalle;
    });
  }

  // --- GESTIÓN DE CARRITO ---

  agregarAlCarrito() {
    if (this.biciSeleccionada && this.cantidadVenta > 0) {
      if (this.cantidadVenta > this.biciSeleccionada.stockActual) {
        alert(`Stock insuficiente. Disponibles: ${this.biciSeleccionada.stockActual}`);
        return;
      }
      
      const item = {
        bicicletaId: this.biciSeleccionada.id,
        nombre: `${this.biciSeleccionada.marca} ${this.biciSeleccionada.modelo}`,
        precio: this.biciSeleccionada.precioVenta,
        cantidad: this.cantidadVenta,
        subtotal: this.biciSeleccionada.precioVenta * this.cantidadVenta
      };

      this.carrito = [...this.carrito, item];
      this.biciSeleccionada = null;
      this.filtroBiciCodigo = '';
      this.cantidadVenta = 1;
    }
  }

  eliminarDelCarrito(index: number) {
    this.carrito.splice(index, 1);
    this.carrito = [...this.carrito];
  }

  get totalFactura() {
    return this.carrito.reduce((acc, item) => acc + item.subtotal, 0);
  }

  finalizarVenta() {
    if (!this.clienteId || this.carrito.length === 0) {
        alert("Seleccione un cliente y añada productos.");
        return;
    }

    const request: VentaRequest = {
      clienteId: this.clienteId,
      detalles: this.carrito.map(i => ({ 
        bicicletaId: i.bicicletaId, 
        cantidad: i.cantidad 
      }))
    };

    this.ventaService.realizarVenta(request).subscribe({
      next: () => {
        alert('¡Venta realizada con éxito!');
        this.limpiarFormulario();
        this.cargarDatos(); 
      },
      error: (err) => alert('Error al procesar la venta.')
    });
  }

  private limpiarFormulario() {
    this.carrito = [];
    this.clienteId = null;
    this.filtroClienteCC = '';
    this.filtroBiciCodigo = '';
  }

  // --- FACTURA BONITA ---
  verFactura(venta: VentaResponse) {
    const fecha = new Date(venta.fechaVenta).toLocaleString('es-CO', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });

    const items = venta.detalles.map((d: any) => {
      const nombre = d.modeloBicicleta || d.nombreBicicleta || 'Bicicleta';
      
      // Buscamos 'precioVenta' que es el nombre que definiste en tu DetalleVentaResponseDTO
      const precio = d.precioVenta || 0; 
      
      return `• ${d.cantidad}x ${nombre} --- $${precio.toLocaleString('es-CO')}`;
    }).join('\n');

    alert(
      `===============================\n` +
      `   🚲 FACTURA ZENRIDE #${venta.id}\n` +
      `===============================\n` +
      `FECHA: ${fecha}\n` +
      `CLIENTE: ${venta.nombreCliente}\n` +
      `DOCUMENTO: ${venta.documento || 'No registrado'}\n` +
      `-------------------------------\n` +
      `DETALLE DE PRODUCTOS:\n` +
      `${items}\n` +
      `-------------------------------\n` +
      `TOTAL: $${venta.totalVenta.toLocaleString()}\n` +
      `===============================\n` +
      `¡Gracias por confiar en ZenRide!`
    );
  }
}