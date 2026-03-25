import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Cliente } from '../../model/cliente';
import { ClienteService } from '../../services/cliente.service';
import { FormsModule } from '@angular/forms'; // 👈 AGREGAR ESTO
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    FormsModule,     // 👈 AGREGAR AQUÍ
    MatIconModule, 
    MatTableModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule
  ],
  templateUrl: './cliente.component.html',
  styleUrl: './cliente.component.scss'
})
export class ClienteComponent implements OnInit {
  private clienteService = inject(ClienteService);
  private fb = inject(FormBuilder);

  // ✅ Estas deben coincidir con los matColumnDef de tu HTML
  displayedColumns: string[] = ['id', 'documento', 'nombre', 'telefono', 'correo'];
  clienteForm: FormGroup;
  clientes: Cliente[] = [];

  constructor() {
    this.clienteForm = this.fb.group({
      documento: ['', Validators.required],
      nombre: ['', Validators.required],
      telefono: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.listar();
  }

  listar() {
    this.clienteService.getClientes().subscribe({
      next: (res) => {
        this.clientes = res;
        console.log('Datos cargados:', res);
      },
      error: (err) => console.error('Error al obtener clientes:', err)
    });
  }

  onSubmit() {
    if (this.clienteForm.valid) {
      this.clienteService.createCliente(this.clienteForm.value).subscribe({
        next: (res) => {
          alert('¡Cliente guardado con éxito!');
          this.clienteForm.reset();
          this.listar(); // 🔄 Aquí es donde se refresca la tabla automáticamente
        },
        error: (err) => {
          console.error('Error al guardar:', err);
          alert('Error al guardar. Revisa la consola.');
        }
      });
    }
  }


  filtroCedula: string = '';
// 2. Crea este método para obtener los clientes filtrados
get clientesFiltrados() {
  const cedula = this.filtroCedula.trim();
  if (!cedula) {
    return this.clientes;
  }
  return this.clientes.filter(c => c.documento.includes(cedula));
}
}