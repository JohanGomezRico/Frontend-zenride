import { Routes } from '@angular/router';
import { InicioComponent } from './components/inicio/inicio.component';
import { ClienteComponent } from './components/cliente/cliente.component';
import { BicicletasComponent } from './components/bicicletas/bicicletas.component';
import { InventarioMovimientoComponent } from './components/inventario-movimiento/inventario-movimiento.component';
import { VentasComponent } from './components/venta/venta.component';
import { ReportesComponent } from './components/reportes/reportes.component';
import { DetalleBicicletaComponent } from './components/detalle-bicicleta/detalle-bicicleta.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './guards/auth.guard';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'inicio', component: InicioComponent },
  { path: 'admin-panel', component: AdminPanelComponent },
  { path: 'clientes', component: ClienteComponent, canActivate: [authGuard] },
  { path: 'bicicletas', component: BicicletasComponent, canActivate: [authGuard] },
  { path: 'inventario', component: InventarioMovimientoComponent, canActivate: [authGuard] },
  { path: 'ventas', component: VentasComponent, canActivate: [authGuard] },
  { path: 'reportes', component: ReportesComponent, canActivate: [authGuard] },
  { path: 'bicicleta/:id', component: DetalleBicicletaComponent }, // Esta es la línea que agregaste
  { path: '', redirectTo: '/inicio', pathMatch: 'full' },
  { path: '**', redirectTo: '/inicio' }
];