import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink, 
    RouterLinkActive,
    MatToolbarModule, 
    MatButtonModule, 
    MatIconModule
  ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent {
    constructor(public authService: AuthService, private router: Router) {}

    // Método para cerrar sesión
  onLogout(): void {
    this.authService.logout(); // Borra el token
    this.router.navigate(['/login']); // Te devuelve al login
  }
 }