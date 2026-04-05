import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BicicletaService } from '../../services/bicicleta.service';
import { Bicicleta } from '../../model/bicicleta';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-detalle-bicicleta',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule],
  templateUrl: './detalle-bicicleta.component.html',
  styleUrl: './detalle-bicicleta.component.scss'
})
export class DetalleBicicletaComponent implements OnInit {
  bicicleta?: Bicicleta;
  loading: boolean = true;
  colorFiltro: string = 'none';

  // Datos para el contacto y mapa
  contacto = {
    whatsapp: '573000000000',
    tienda: 'SENA Centro de Comercio, Armenia, Quindío'
  };

  constructor(
    private route: ActivatedRoute,
    private biciService: BicicletaService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (id) {
      this.biciService.getBicicletas().subscribe({
        next: (res) => {
          this.bicicleta = res.find(b => b.id === id);
          this.loading = false;
        },
        error: (err) => {
          console.error('Error al cargar el detalle', err);
          this.loading = false;
        }
      });
    }
  }

  limpiarNombre(texto: string): string {
    if (!texto) return '';
    return texto.toLowerCase()
                .trim()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/\s+/g, '-');
  }

  // NUEVA FUNCIÓN: Contacto directo
  contactarVendedor() {
    if (!this.bicicleta) return;
    const mensaje = `¡Hola ZenRide! Me interesa la ${this.bicicleta.marca} ${this.bicicleta.modelo} por ${this.bicicleta.precioVenta}. ¿Tienen disponibilidad?`;
    window.open(`https://wa.me/${this.contacto.whatsapp}?text=${encodeURIComponent(mensaje)}`, '_blank');
  }
}