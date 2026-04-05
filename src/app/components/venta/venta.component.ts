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
import { MatDialog, MatDialogModule } from '@angular/material/dialog'; // AÑADIDO
import { FacturaComponent } from '../factura/factura.component'; // AÑADIDO

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatIconModule, MatButtonModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatTableModule, MatTooltipModule,
    MatDialogModule // AÑADIDO
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
  displayedColumnsHistorial = ['id', 'fecha', 'cliente', 'documento', 'total', 'acciones'];

  constructor(
    private ventaService: VentaService,
    private clienteService: ClienteService,
    private biciService: BicicletaService,
    private dialog: MatDialog // AÑADIDO
  ) {}

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.clienteService.getClientes().subscribe(res => this.clientes = res || []);
    this.biciService.getBicicletas().subscribe(res => this.bicicletas = res || []);
    this.ventaService.getHistorial().subscribe(res => this.historialVentas = res || []);
  }

  get clientesFiltrados() {
    const f = this.filtroClienteCC?.trim();
    if (!f) return this.clientes;
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
        v.documento?.includes(f) || 
        v.fechaVenta?.includes(f);

      const coincideDetalle = v.detalles?.some((d: any) =>
        (d.marcaBicicleta || d.nombreBicicleta)?.toLowerCase().includes(f)
      );
      return coincideCabecera || coincideDetalle;
    });
  }

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

  // --- FACTURA ACTUALIZADA ---
  verFactura(venta: VentaResponse) {
    this.dialog.open(FacturaComponent, {
      width: '450px',
      data: venta,
      autoFocus: false
    });
  }
}