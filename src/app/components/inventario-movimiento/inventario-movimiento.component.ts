import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker'; 
import { MatNativeDateModule } from '@angular/material/core'; 
import { InventarioService } from '../../services/inventario.service';
import { BicicletaService } from '../../services/bicicleta.service';

@Component({
  selector: 'app-inventario-movimiento',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, FormsModule, MatFormFieldModule, 
    MatInputModule, MatSelectModule, MatButtonModule, MatTableModule, MatIconModule,
    MatDatepickerModule, MatNativeDateModule 
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
  
  filtros = {
    texto: '',    
    codigo: '',   
    tipo: '',     
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

  get historialFiltrado() {
    return this.historial.filter(m => {
      const cumpleResponsable = !this.filtros.texto || 
        m.responsableOperacion?.toLowerCase().includes(this.filtros.texto.toLowerCase());

      const cumpleCodigo = !this.filtros.codigo || 
        m.bicicletaCodigo?.toString().includes(this.filtros.codigo);

      const cumpleTipo = !this.filtros.tipo || m.tipoMovimiento === this.filtros.tipo;

      let cumpleFecha = true;
      if (this.filtros.fecha) {
        const fechaFiltro = new Date(this.filtros.fecha).toISOString().substring(0, 10);
        const fechaMovimiento = m.fechaMovimiento?.substring(0, 10);
        cumpleFecha = fechaMovimiento === fechaFiltro;
      }

      return cumpleResponsable && cumpleCodigo && cumpleTipo && cumpleFecha;
    });
  }

  get stockTotalGeneral(): number {
    return this.bicicletas.reduce((acc, b) => acc + (b.stockActual || 0), 0);
  }

  // --- FUNCIÓN CORREGIDA PARA COLOMBIA (UTC-5) ---
  private obtenerFechaLocal(): string {
    const ahora = new Date();
    const anio = ahora.getFullYear();
    const mes = String(ahora.getMonth() + 1).padStart(2, '0');
    const dia = String(ahora.getDate()).padStart(2, '0');
    const horas = String(ahora.getHours()).padStart(2, '0');
    const minutos = String(ahora.getMinutes()).padStart(2, '0');
    const segundos = String(ahora.getSeconds()).padStart(2, '0');
    
    // Al añadir -05:00 forzamos que el sistema reconozca la hora de Colombia
    return `${anio}-${mes}-${dia}T${horas}:${minutos}:${segundos}-05:00`;
  }

  guardar(): void {
    if (this.movimientoForm.valid) {
      const datosEnviar = { 
        ...this.movimientoForm.value,
        fechaMovimiento: this.obtenerFechaLocal() 
      };
      
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