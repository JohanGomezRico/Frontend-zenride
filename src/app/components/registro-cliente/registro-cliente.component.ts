import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // Ajusta la ruta si es necesario

@Component({
  selector: 'app-registro-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './registro-cliente.component.html',
  styleUrls: ['./registro-cliente.component.scss'] // o .css según lo que uses
})
export class RegistroClienteComponent {
  // Variables para capturar lo que escriba el usuario
  usuario = {
    username: '',
    email: '',
    password: '',
    rol: 'CLIENTE' // Lo enviamos por si acaso, aunque el backend manda
  };

  mensajeError: string = '';
  cargando: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  onRegistro() {
    // Validación básica
    if (!this.usuario.username || !this.usuario.email || !this.usuario.password) {
      this.mensajeError = 'Por favor, completa todos los campos obligatorios.';
      return;
    }

    this.cargando = true;
    this.mensajeError = '';

    // Llamamos al servicio que creamos en el paso anterior
    this.authService.registroCliente(this.usuario).subscribe({
      next: (respuesta) => {
        // Si el backend nos responde bien (nos dio el token), redirigimos al inicio
        this.cargando = false;
        this.router.navigate(['/inicio']);
      },
      error: (err) => {
        // Si hay error (ej. el usuario ya existe), lo mostramos
        this.cargando = false;
        this.mensajeError = 'Error al registrar la cuenta. Es posible que el usuario o correo ya estén en uso.';
        console.error(err);
      }
    });
  }
}