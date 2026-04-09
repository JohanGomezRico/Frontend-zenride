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
import { RouterModule, Router } from '@angular/router'; 

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
  filtroMarca: string = 'Todas'; 
  
  precioMin: number | null = null;
  precioMax: number | null = null;
  
  tipos: string[] = ['Montaña', 'Ruta', 'Urbana', 'Electrica']; 
  
  marcas: string[] = [
    'GW', 'SCOOP', 'Shimano', 'MTB', 'Andantte', 
    'Seven', 'Roadmaster', 'Profit', 'Sforzo', 
    'Bianchi', 'Fusion', 'Cliff'
  ];

  criterioOrden: string = 'defecto';
  esGridLargo: boolean = false;

  constructor(
    private biciService: BicicletaService,
    private router: Router 
  ) {}

  ngOnInit() {
    this.cargarBicicletas();
  }

  setVista(larga: boolean) {
    this.esGridLargo = larga;
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

  verDetalle(id: number | undefined) {
    if (id) {
      this.router.navigate(['/bicicleta', id]);
    }
  }

  setFiltroTipo(tipo: string) {
    this.filtroTipo = tipo;
    this.aplicarFiltros();
    window.scrollTo({ top: 400, behavior: 'smooth' }); 
  }

  setFiltroMarca(marca: string) {
    this.filtroMarca = marca;
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
      const coincideTipo = this.filtroTipo === 'Todos' || 
                           this.normalizar(b.tipo) === this.normalizar(this.filtroTipo);
      const coincideMarca = this.filtroMarca === 'Todas' || 
                            b.marca.toUpperCase().includes(this.filtroMarca.toUpperCase());

      const precio = b.precioVenta;
      const coincideMin = this.precioMin === null || this.precioMin === undefined || precio >= this.precioMin;
      const coincideMax = this.precioMax === null || this.precioMax === undefined || precio <= this.precioMax;
      
      return coincideTexto && coincideTipo && coincideMarca && (coincideMin && coincideMax);
    });

    if (this.criterioOrden !== 'defecto') {
      this.ordenarBicicletas();
    }
  }

  contarPorTipo(tipo: string): number {
    if (tipo === 'Todos') return this.bicicletas.length;
    return this.bicicletas.filter(b => this.normalizar(b.tipo) === this.normalizar(tipo)).length;
  }

  contarPorMarca(marca: string): number {
    if (marca === 'Todas') return this.bicicletas.length;
    return this.bicicletas.filter(b => b.marca.toUpperCase().includes(marca.toUpperCase())).length;
  }

  private normalizar(texto: string): string {
    if (!texto) return '';
    return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  limpiarClase(texto: string): string {
    if (!texto) return '';
    return texto.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-'); 
  }

  updateUrl(event: any) {
    event.target.src = 'img/bicicletas/nantes.jpg'; 
  }
}