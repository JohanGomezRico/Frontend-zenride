import { Component, OnInit, inject, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReporteService } from '../../services/reporte.service';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective],
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss']
})
export class ReportesComponent implements OnInit {

  private reporteService = inject(ReporteService);

  // 👇 Esta es la varita mágica que controla las gráficas en pantalla
  @ViewChildren(BaseChartDirective) charts!: QueryList<BaseChartDirective>;

  // Filtros
  fechaInicio: string = '';
  fechaFin: string = '';
  filtroTipo: string = 'Todos';
  filtroMarca: string = 'Todas';
  filtroVendedor: string = 'Todos';
  tiposBicicleta = ['Montaña', 'Ruta', 'Urbana', 'Electrica'];
  marcas = ['GW', 'Specialized', 'Trek', 'Scott']; 

  datosReporte: any = null;
  cargando: boolean = false;

  historialVentas: any[] = [];
  stockBajo: any[] = [];

  // --- CONFIGURACIÓN GRÁFICAS ---
  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [], 
    datasets: [{
      data: [], 
      label: 'Ingresos ($)',
      borderColor: '#ccff00',
      backgroundColor: 'rgba(204, 255, 0, 0.1)',
      fill: true,
      tension: 0.4, 
      pointBackgroundColor: '#111',
      pointBorderColor: '#ccff00',
      pointHoverBackgroundColor: '#ccff00',
    }]
  };
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } },
    scales: { x: { grid: { color: '#333' }, ticks: { color: '#888' } }, y: { grid: { color: '#333' }, ticks: { color: '#888' } } }
  };

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [{ 
      data: [], label: 'Unidades Vendidas', backgroundColor: '#ccff00', borderRadius: 6, hoverBackgroundColor: '#ffffff'
    }]
  };
  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } },
    scales: { x: { grid: { display: false }, ticks: { color: '#888' } }, y: { grid: { color: '#333' }, ticks: { color: '#888', stepSize: 1 } } }
  };

  ngOnInit() {
    const hoy = new Date();
    const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    this.fechaFin = hoy.toISOString().split('T')[0];
    this.fechaInicio = primerDiaMes.toISOString().split('T')[0];
    this.cargarDatos();
  }

  cargarDatos() {
    if (!this.fechaInicio || !this.fechaFin) return;
    this.cargando = true;
    
    this.reporteService.getResumen(this.fechaInicio, this.fechaFin, this.filtroTipo, this.filtroMarca, this.filtroVendedor).subscribe({
      next: (data) => {
        console.log('🕵️‍♂️ DATOS DEL BACKEND:', data); // <-- Para ver qué nos está enviando Java

        this.datosReporte = data;
        this.historialVentas = data.historialVentas || [];
        this.stockBajo = data.stockBajo || [];

        // Inyectamos los datos. Si Java no envía nada, ponemos "Sin datos" para obligar a que dibuje.
        this.lineChartData.labels = (data.labelsFechas && data.labelsFechas.length > 0) ? data.labelsFechas : ['Sin datos'];
        this.lineChartData.datasets[0].data = (data.datosIngresos && data.datosIngresos.length > 0) ? data.datosIngresos : [0];

        this.barChartData.labels = (data.labelsTopBicis && data.labelsTopBicis.length > 0) ? data.labelsTopBicis : ['Sin datos'];
        this.barChartData.datasets[0].data = (data.datosTopBicis && data.datosTopBicis.length > 0) ? data.datosTopBicis : [0];

        this.cargando = false;

        // 👇 FORZAMOS A CHART.JS A REDIBUJARSE DESPUÉS DE CARGAR 👇
        setTimeout(() => {
          this.charts?.forEach(chart => chart.update());
        }, 100);

      },
      error: (err) => {
        console.error('Error al cargar reporte', err);
        this.cargando = false;
      }
    });
  }

  // --- REPORTE PDF ---
  descargarPDF() {
    if (!this.fechaInicio || !this.fechaFin) return;
    
    this.cargando = true; // Mostramos que está trabajando
    
    // 👇 Enviamos los 5 parámetros exactos que pide tu Controller
    this.reporteService.descargarPdf(
      this.fechaInicio, 
      this.fechaFin, 
      this.filtroTipo, 
      this.filtroMarca, 
      this.filtroVendedor
    ).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Reporte_ZenRide_${this.fechaInicio}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al descargar PDF', err);
        this.cargando = false;
        alert('Hubo un error al generar el PDF. Revisa la consola.');
      }
    });
  }

  // --- REPORTE EXCEL ---
  descargarExcel() {
    // Verificamos que tengamos datos en la tabla de historial para exportar
    if (!this.historialVentas || this.historialVentas.length === 0) {
      alert('No hay datos disponibles en el historial para exportar a Excel.');
      return;
    }

    try {
      // 1. Creamos la hoja de trabajo a partir del JSON del historial
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.historialVentas);
      
      // 2. Creamos el libro de trabajo
      const workbook: XLSX.WorkBook = XLSX.utils.book_new();
      
      // 3. Añadimos la hoja al libro
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Ventas ZenRide');
      
      // 4. Generamos el archivo y lo descargamos
      XLSX.writeFile(workbook, `Reporte_Ventas_ZenRide_${this.fechaInicio}.xlsx`);
      
    } catch (error) {
      console.error('Error al generar Excel:', error);
      alert('Error técnico al generar el archivo Excel.');
    }
  }
}