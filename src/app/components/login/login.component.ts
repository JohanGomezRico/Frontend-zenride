import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    if (!this.username || !this.password) {
      this.errorMessage = 'Por favor, completa todos los campos.';
      return;
    }

    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        // Si el login es exitoso, lo enviamos de vuelta al inicio o al panel
        this.router.navigate(['/inicio']); 
      },
      error: (err) => {
        // Si el backend lanza un 403, mostramos este error
        this.errorMessage = 'Usuario o contraseña incorrectos.';
        console.error('Error de autenticación:', err);
      }
    });
  }
}
