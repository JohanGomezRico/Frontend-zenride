import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NavComponent } from './shared/nav/nav.component';

// 1. IMPORTA el FooterComponent aquí
import { FooterComponent } from './shared/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,   
    ReactiveFormsModule,
    NavComponent,
    // 2. AGREGALO aquí a la lista de imports
    FooterComponent 
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'zenride-web';
}