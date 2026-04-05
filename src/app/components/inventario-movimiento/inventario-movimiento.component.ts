import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker'; // Nuevo para fecha
import { MatNativeDateModule } from '@angular/material/core'; // Nuevo para fecha
import { InventarioService } from '../../services/inventario.service';
import { BicicletaService } from '../../services/bicicleta.service';

@Component({
  selector: 'app-inventario-movimiento',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, FormsModule, MatFormFieldModule, 
    MatInputModule, MatSelectModule, MatButtonModule, MatTableModule, MatIconModule,
    MatDatepickerModule, MatNativeDateModule // Asegúrate de importar estos
  ],
  templateUrl: './inventario-movimiento.component.html',
  styleUrl: './inventario-movimiento.component.scss'
})
export class InventarioMovimientoComponent implements OnInit {
  private fb = inject(FormBuilder);
  private inventarioService = inject(InventarioService);
  private bicicletaService = inject(BicicletaService);

  movimientoForm: FormGroup;
  bicicletas: any[] = [];
  historial: any[] = [];
  
  // 🚩 FILTROS AMPLIADOS
  filtros = {
    texto: '',    // Para responsable
    codigo: '',   // Nuevo: Para código de bici
    tipo: '',     // Cambiado a vacío para que "Todos" sea la opción inicial
    fecha: '' 
  };

  displayedColumns: string[] = ['fecha', 'detalles', 'tipo', 'responsable', 'descripcion'];

  constructor() {
    this.movimientoForm = this.fb.group({
      tipoMovimiento: ['ENTRADA', [Validators.required]], 
      responsableOperacion: ['', [Validators.required]],  
      descripcion: [''],
      detalles: this.fb.array([]) 
    });
  }

  ngOnInit(): void {
    this.cargarDatos();
    this.agregarFila();
  }

  get detalles() {
    return this.movimientoForm.get('detalles') as FormArray;
  }

  agregarFila(): void {
    const fila = this.fb.group({
      bicicletaId: [null, [Validators.required]],
      cantidad: [1, [Validators.required, Validators.min(1)]]
    });
    this.detalles.push(fila);
  }

  removerFila(index: number): void {
    if (this.detalles.length > 1) {
      this.detalles.removeAt(index);
    }
  }

  cargarDatos(): void {
    this.bicicletaService.getBicicletas().subscribe(res => this.bicicletas = res || []);
    this.cargarHistorial();
  }

  cargarHistorial(): void {
    this.inventarioService.getMovimientos().subscribe(res => this.historial = res || []);
  }

  // 🚩 LÓGICA DE FILTRADO ACUMULATIVO
  get historialFiltrado() {
    return this.historial.filter(m => {
      // Filtro por Responsable
      const cumpleResponsable = !this.filtros.texto || 
        m.responsableOperacion?.toLowerCase().includes(this.filtros.texto.toLowerCase());

      // Filtro por Código de Bicicleta (Convierte a string para comparar)
      const cumpleCodigo = !this.filtros.codigo || 
        m.bicicletaCodigo?.toString().includes(this.filtros.codigo);

      // Filtro por Tipo (Entrada/Salida)
      const cumpleTipo = !this.filtros.tipo || m.tipoMovimiento === this.filtros.tipo;

      // Filtro por Fecha
      let cumpleFecha = true;
      if (this.filtros.fecha) {
        // Si la fecha viene de un datepicker como objeto, la pasamos a string YYYY-MM-DD
        const fechaFiltro = new Date(this.filtros.fecha).toISOString().substring(0, 10);
        const fechaMovimiento = m.fechaMovimiento?.substring(0, 10);
        cumpleFecha = fechaMovimiento === fechaFiltro;
      }

      // Solo se muestra si CUMPLE TODAS las condiciones
      return cumpleResponsable && cumpleCodigo && cumpleTipo && cumpleFecha;
    });
  }

  get stockTotalGeneral(): number {
    return this.bicicletas.reduce((acc, b) => acc + (b.stockActual || 0), 0);
  }

  guardar(): void {
    if (this.movimientoForm.valid) {
      const datosEnviar = { ...this.movimientoForm.value };
      
      this.inventarioService.registrarMovimiento(datosEnviar).subscribe({
        next: () => {
          alert('¡Lote de entrada procesado con éxito!');
          const resp = this.movimientoForm.value.responsableOperacion;
          
          this.detalles.clear();
          this.movimientoForm.reset({ 
            tipoMovimiento: 'ENTRADA', 
            responsableOperacion: resp,
            descripcion: '' 
          });
          this.agregarFila();
          this.cargarDatos();
        },
        error: (err) => alert('Error: ' + (err.error?.message || 'No se pudo registrar el lote'))
      });
    }
  }
}