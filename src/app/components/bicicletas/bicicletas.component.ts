import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { Bicicleta } from '../../model/bicicleta';
import { BicicletaService } from '../../services/bicicleta.service';

@Component({
  selector: 'app-bicicletas',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
  ],
  templateUrl: './bicicletas.component.html',
  styleUrl: './bicicletas.component.scss'
})
export class BicicletasComponent implements OnInit {
  private bicicletaService = inject(BicicletaService);
  private fb = inject(FormBuilder);

  // Agregamos 'acciones' a las columnas mostradas
  displayedColumns: string[] = ['id', 'codigo', 'marca', 'modelo', 'precioVenta', 'tipo', 'acciones'];
  bicicletasForm: FormGroup;
  bicicletas: Bicicleta[] = [];
  filtroCodigo: string = '';

  constructor() {
    this.bicicletasForm = this.fb.group({
      codigo: ['', [Validators.required, Validators.maxLength(20)]],
      marca: ['', [Validators.required, Validators.maxLength(50)]],
      modelo: ['', [Validators.required, Validators.maxLength(50)]],
      tipo: ['', [Validators.required]],
      precioVenta: [0, [Validators.required, Validators.min(1)]],
      stockActual: [0] // Se mantiene en 0 por defecto
    });
  }

  ngOnInit(): void {
    this.getBicicletas();
  }

  get bicicletasFiltradas() {
    const code = this.filtroCodigo.trim().toLowerCase();
    if (!code) {
      return this.bicicletas;
    }
    return this.bicicletas.filter(b => 
      b.codigo.toLowerCase().includes(code)
    );
  }

  getBicicletas() {
    this.bicicletaService.getBicicletas().subscribe({
      next: (result) => {
        this.bicicletas = result;
      },
      error: (err) => console.error('Error al cargar bicicletas:', err)
    });
  }

  // 2. Nueva función para eliminar la bicicleta
  eliminarBicicleta(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar esta bicicleta de ZenRide?')) {
      this.bicicletaService.deleteBicicleta(id).subscribe({ // Asegúrate que el servicio tenga deleteBicicleta
        next: () => {
          alert('Bicicleta eliminada con éxito.');
          this.getBicicletas(); // Recarga la lista
        },
        error: (error) => {
          console.error('Error al eliminar:', error);
          alert('No se pudo eliminar. Verifica si tiene stock o ventas relacionadas.');
        }
      });
    }
  }

  onSubmit() {
    if (this.bicicletasForm.valid) {
      // Aseguramos que el stock sea 0 al crear, independientemente de lo que haya en el form
      const datosBicicleta = {
        ...this.bicicletasForm.value,
        stockActual: 0 
      };

      this.bicicletaService.createBicicleta(datosBicicleta).subscribe({
        next: (bicicleta) => {
          alert('¡Bicicleta registrada con éxito!');
          this.bicicletasForm.reset({
            precioVenta: 0,
            stockActual: 0
          });
          this.getBicicletas();
        },
        error: (error) => {
          alert('Hubo un error al guardar la bicicleta.');
        }
      });
    }
  }
}