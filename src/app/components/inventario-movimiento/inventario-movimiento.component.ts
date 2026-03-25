import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { InventarioService } from '../../services/inventario.service';
import { BicicletaService } from '../../services/bicicleta.service';

@Component({
  selector: 'app-inventario-movimiento',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, FormsModule, MatFormFieldModule, 
    MatInputModule, MatSelectModule, MatButtonModule, MatTableModule, MatIconModule
  ],
  templateUrl: './inventario-movimiento.component.html',
  styleUrl: './inventario-movimiento.component.scss'
})
export class InventarioMovimientoComponent implements OnInit {
  movimientoForm: FormGroup;
  bicicletas: any[] = [];
  historial: any[] = [];
  
  // Objeto para filtros múltiples (Texto, Tipo y Fecha)
  filtros = {
    texto: '',
    tipo: '',
    fecha: '' // Formato YYYY-MM-DD del input date
  };

  displayedColumns: string[] = ['fecha', 'bicicleta', 'tipo', 'cantidad', 'responsable', 'descripcion'];

  constructor(
    private fb: FormBuilder,
    private inventarioService: InventarioService,
    private bicicletaService: BicicletaService
  ) {
    this.movimientoForm = this.fb.group({
      bicicletaId: [null, [Validators.required]],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      tipoMovimiento: ['ENTRADA', [Validators.required]], 
      responsableOperacion: ['', [Validators.required]],  
      descripcion: [''] 
    });
  }

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.bicicletaService.getBicicletas().subscribe(res => this.bicicletas = res || []);
    this.cargarHistorial();
  }

  cargarHistorial(): void {
    this.inventarioService.getMovimientos().subscribe(res => this.historial = res || []);
  }

  // Lógica de búsqueda MULTI-CRITERIO corregida para Fecha
  get historialFiltrado() {
    return this.historial.filter(m => {
      // 1. Filtro por Texto (Código o Responsable)
      const cumpleTexto = !this.filtros.texto || 
        m.bicicletaCodigo?.toLowerCase().includes(this.filtros.texto.toLowerCase()) ||
        m.responsableOperacion?.toLowerCase().includes(this.filtros.texto.toLowerCase());

      // 2. Filtro por Tipo (Entrada / Salida)
      const cumpleTipo = !this.filtros.tipo || m.tipoMovimiento === this.filtros.tipo;

      // 3. Filtro por Fecha (Comparación exacta YYYY-MM-DD)
      let cumpleFecha = true;
      if (this.filtros.fecha) {
        // Extraemos solo la parte YYYY-MM-DD de la fecha que viene del backend
        const fechaMovimientoLimpia = m.fechaMovimiento?.substring(0, 10);
        cumpleFecha = fechaMovimientoLimpia === this.filtros.fecha;
      }

      return cumpleTexto && cumpleTipo && cumpleFecha;
    });
  }

  get stockTotalGeneral(): number {
    return this.bicicletas.reduce((acc, b) => acc + (b.stockActual || 0), 0);
  }

  guardar(): void {
    if (this.movimientoForm.valid) {
      // Enviamos una copia limpia para asegurar que la descripción viaje bien
      const datosEnviar = { ...this.movimientoForm.value };
      
      this.inventarioService.registrarMovimiento(datosEnviar).subscribe({
        next: () => {
          alert('¡Stock de ZenRide actualizado!');
          const resp = this.movimientoForm.value.responsableOperacion;
          
          this.movimientoForm.reset({ 
            tipoMovimiento: 'ENTRADA', 
            cantidad: 1, 
            responsableOperacion: resp,
            descripcion: '' 
          });
          this.cargarDatos();
        },
        error: (err) => alert('Error: ' + (err.error?.message || 'No se pudo registrar'))
      });
    }
  }
}