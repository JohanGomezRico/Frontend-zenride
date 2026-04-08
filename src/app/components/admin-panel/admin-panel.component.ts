import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2'; // 👈 Importamos SweetAlert

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit {
  usuarios: any[] = [];
  mostrarFormulario: boolean = false;
  cargando: boolean = false;

  nuevoUsuario = { username: '', password: '', email: '', rol: 'ADMIN' };

  constructor(private authService: AuthService) {}

  ngOnInit(): void { this.cargarUsuarios(); }

  cargarUsuarios() {
    this.authService.obtenerUsuarios().subscribe({
      next: (data) => this.usuarios = data,
      error: (err) => console.error(err)
    });
  }

  // --- NUEVA LÓGICA CON SWEET ALERT ---

  async cambiarRol(user: any) {
    // Usamos una lista de selección elegante
    const { value: nuevoRol } = await Swal.fire({
      title: 'Cambiar Rol de Usuario',
      text: `Selecciona el nuevo nivel para ${user.username}`,
      input: 'select',
      inputOptions: {
        'ADMIN': 'Administrador',
        'VENDEDOR': 'Vendedor',
        'CLIENTE': 'Cliente'
      },
      inputValue: user.rol,
      background: '#1a1a1a',
      color: '#ffffff',
      confirmButtonColor: '#c6ff00',
      confirmButtonText: 'Actualizar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      customClass: { popup: 'border-neon' }
    });

    if (nuevoRol) {
      this.authService.actualizarRol(user.id, nuevoRol).subscribe({
        next: () => {
          this.cargarUsuarios();
          Swal.fire({
            title: '¡Actualizado!',
            text: `Ahora ${user.username} es ${nuevoRol}`,
            icon: 'success',
            background: '#1a1a1a',
            color: '#ffffff',
            confirmButtonColor: '#c6ff00'
          });
        },
        error: () => Swal.fire('Error', 'No se pudo cambiar el rol', 'error')
      });
    }
  }

  eliminarUser(user: any) {
    if (user.username === 'miguel_admin') {
      Swal.fire({
        icon: 'error',
        title: 'Acción Denegada',
        text: 'No puedes eliminar al administrador maestro.',
        background: '#1a1a1a',
        color: '#ffffff',
        confirmButtonColor: '#ff4c4c'
      });
      return;
    }

    Swal.fire({
      title: '¿Estás seguro?',
      text: `Vas a eliminar permanentemente a ${user.username}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff4c4c',
      cancelButtonColor: '#333',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: '#1a1a1a',
      color: '#ffffff'
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.eliminarUsuario(user.id).subscribe({
          next: () => {
            this.usuarios = this.usuarios.filter(u => u.id !== user.id);
            Swal.fire({
              title: '¡Eliminado!',
              text: 'El usuario ha sido borrado.',
              icon: 'success',
              background: '#1a1a1a',
              color: '#ffffff',
              confirmButtonColor: '#c6ff00'
            });
          }
        });
      }
    });
  }

  // Modifica también tu método de creación para usar Swal
  crearUsuarioEquipo() {
    this.cargando = true;
    this.authService.registroAdmin(this.nuevoUsuario).subscribe({
      next: () => {
        this.cargando = false;
        this.cargarUsuarios();
        this.mostrarFormulario = false;
        Swal.fire({
          icon: 'success',
          title: '¡Bienvenido al equipo!',
          text: `El usuario ${this.nuevoUsuario.username} fue creado.`,
          background: '#1a1a1a',
          color: '#ffffff',
          confirmButtonColor: '#c6ff00'
        });
        this.nuevoUsuario = { username: '', password: '', email: '', rol: 'ADMIN' };
      },
      error: () => {
        this.cargando = false;
        Swal.fire('Error', 'El usuario o correo ya existen', 'error');
      }
    });
  }

  toggleFormulario() { this.mostrarFormulario = !this.mostrarFormulario; }
}