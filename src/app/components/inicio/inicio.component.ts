import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { BicicletaService } from '../../services/bicicleta.service';
import { Bicicleta } from '../../model/bicicleta';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatInputModule, 
    MatSelectModule, 
    MatCardModule, 
    MatButtonModule, 
    MatChipsModule, 
    MatIconModule, 
    RouterModule
  ],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss'
})
export class InicioComponent implements OnInit {
  bicicletas: Bicicleta[] = [];
  bicicletasFiltradas: Bicicleta[] = [];

  filtroTexto: string = '';
  filtroTipo: string = 'Todos';
  
  // Se usa 'Electrica' sin tilde para coincidir con el registro y la DB
  tipos: string[] = ['Montaña', 'Ruta', 'Urbana', 'Electrica']; 
  
  criterioOrden: string = 'defecto';

  constructor(private biciService: BicicletaService) {}

  ngOnInit() {
    this.cargarBicicletas();
  }

  cargarBicicletas() {
    this.biciService.getBicicletas().subscribe({
      next: (res) => {
        this.bicicletas = res;
        this.bicicletasFiltradas = res;
      },
      error: (err) => console.error('Error al cargar bicicletas', err)
    });
  }

  setFiltroTipo(tipo: string) {
    this.filtroTipo = tipo;
    this.aplicarFiltros();
  }

  ordenarBicicletas() {
    if (this.criterioOrden === 'menor') {
      this.bicicletasFiltradas.sort((a, b) => a.precioVenta - b.precioVenta);
    } else if (this.criterioOrden === 'mayor') {
      this.bicicletasFiltradas.sort((a, b) => b.precioVenta - a.precioVenta);
    } else {
      this.aplicarFiltros();
    }
  }

  aplicarFiltros() {
    const texto = this.filtroTexto.toLowerCase().trim();
    
    this.bicicletasFiltradas = this.bicicletas.filter(b => {
      const coincideTexto = `${b.marca} ${b.modelo}`.toLowerCase().includes(texto);
      
      // Compara tipos normalizando (quitando tildes) para evitar errores de coincidencia
      const coincideTipo = this.filtroTipo === 'Todos' || 
                           this.normalizar(b.tipo) === this.normalizar(this.filtroTipo);
      
      return coincideTexto && coincideTipo;
    });

    if (this.criterioOrden !== 'defecto') {
      this.ordenarBicicletas();
    }
  }

  contarPorTipo(tipo: string): number {
    if (tipo === 'Todos') return this.bicicletas.length;
    
    const tipoBusqueda = this.normalizar(tipo);
    return this.bicicletas.filter(b => this.normalizar(b.tipo) === tipoBusqueda).length;
  }

  // Función para estandarizar textos (quita tildes y pasa a minúsculas)
  private normalizar(texto: string): string {
    if (!texto) return '';
    return texto.toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "");
  }

  getBadgeClass(tipo: string): string {
    const clases: any = {
      'Montaña': 'badge-tipo-montana',
      'Ruta': 'badge-tipo-ruta',
      'Urbana': 'badge-tipo-urbana',
      'Electrica': 'badge-tipo-electrica'
    };
    return clases[tipo] || '';
  }

  limpiarClase(texto: string): string {
    if (!texto) return '';
    return texto.toLowerCase()
                .trim()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/\s+/g, '-'); 
  }
 updateUrl(event: any) {
  event.target.src = 'img/bicicletas/nantes.jpg'; // Ruta limpia
}
}