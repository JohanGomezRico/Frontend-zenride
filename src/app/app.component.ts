import { Component } from '@angular/core';
// Importamos RouterOutlet (para inyectar las páginas) y RouterLink (para los botones del menú)
import { RouterOutlet, RouterLink } from '@angular/router'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink], 
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  // Queda vacío porque este es solo el esqueleto de la aplicación
}