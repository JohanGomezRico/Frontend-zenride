import { Routes } from '@angular/router';
import { InicioComponent } from './components/inicio/inicio.component';
import { ClienteComponent } from './components/cliente/cliente.component';
import { BicicletasComponent } from './components/bicicletas/bicicletas.component';
import { InventarioMovimientoComponent } from './components/inventario-movimiento/inventario-movimiento.component'; 
import { VentasComponent } from './components/venta/venta.component'; // CON 'S'

export const routes: Routes = [
  { path: 'inicio', component: InicioComponent },
  { path: 'clientes', component: ClienteComponent },
  { path: 'bicicletas', component: BicicletasComponent },
  { path: 'inventario', component: InventarioMovimientoComponent },
  { path: 'ventas', component: VentasComponent }, // CON 'S'
  { path: '', redirectTo: 'inicio', pathMatch: 'full' }, 
  { path: '**', redirectTo: 'inicio' } 
];