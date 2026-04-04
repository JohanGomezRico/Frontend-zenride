import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReporteService } from '../../services/reporte.service';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, FormsModule], // Importamos FormsModule para los inputs de fecha
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss']
})
export class ReportesComponent implements OnInit {

  private reporteService = inject(ReporteService);

  fechaInicio: string = '';
  fechaFin: string = '';
  datosReporte: any = null;
  cargando: boolean = false;

  ngOnInit() {
    // Por defecto, filtramos desde el día 1 del mes actual hasta hoy
    const hoy = new Date();
    const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

    // Formateamos a YYYY-MM-DD para el input type="date"
    this.fechaFin = hoy.toISOString().split('T')[0];
    this.fechaInicio = primerDiaMes.toISOString().split('T')[0];

    this.cargarDatos();
  }

  cargarDatos() {
    if (!this.fechaInicio || !this.fechaFin) return;
    
    this.cargando = true;
    this.reporteService.getResumen(this.fechaInicio, this.fechaFin).subscribe({
      next: (data) => {
        this.datosReporte = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar reporte', err);
        this.cargando = false;
      }
    });
  }

  descargarPDF() {
    if (!this.fechaInicio || !this.fechaFin) return;

    this.reporteService.descargarPdf(this.fechaInicio, this.fechaFin).subscribe({
      next: (blob) => {
        // Magia para forzar la descarga del archivo en el navegador
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Reporte_ZenRide_${this.fechaInicio}_al_${this.fechaFin}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      },
      error: (err) => console.error('Error al descargar PDF', err)
    });
  }
}