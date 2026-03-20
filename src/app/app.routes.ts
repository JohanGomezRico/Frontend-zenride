import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CatalogoComponent } from './pages/catalogo/catalogo.component';
import { MovimientosComponent } from './pages/movimientos/movimientos.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'catalogo', component: CatalogoComponent },
  { path: 'movimientos', component: MovimientosComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Si entran sin ruta, van al home
  { path: '**', redirectTo: '/home' } // Si escriben una ruta que no existe, los devuelve al home
];