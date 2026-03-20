import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BicicletaService } from '../../services/bicicleta.service';
import { Bicicleta } from '../../interfaces/bicicleta';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './catalogo.component.html',
  styleUrl: './catalogo.component.scss'
})
export class CatalogoComponent implements OnInit {
  listaBicicletas: Bicicleta[] = [];
  private bicicletaService = inject(BicicletaService);

  ngOnInit(): void {
    this.cargarBicicletas();
  }

  cargarBicicletas(): void {
    this.listaBicicletas = this.bicicletaService.getBicicletas();
  }
}