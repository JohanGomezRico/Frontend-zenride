import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
// 👇 IMPORTANTE: Añade esta importación
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'; 
import { authInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimationsAsync(), // 👈 2. AGRÉGALO AQUÍ
    provideCharts(withDefaultRegisterables())
  ]
};