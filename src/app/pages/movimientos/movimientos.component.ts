import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BicicletaService } from '../../services/bicicleta.service';
import { Bicicleta } from '../../interfaces/bicicleta';

@Component({
  selector: 'app-movimientos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movimientos.component.html',
  styleUrl: './movimientos.component.scss'
})
export class MovimientosComponent implements OnInit {
  listaBicicletas: Bicicleta[] = [];
  private bicicletaService = inject(BicicletaService);

  ngOnInit(): void {
    // Cargamos las bicicletas para llenar el select del formulario
    this.listaBicicletas = this.bicicletaService.getBicicletas();
  }
}