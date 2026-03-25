import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
// 👇 IMPORTANTE: Añade esta importación
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'; 

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideHttpClient(),
    provideAnimationsAsync() // 👈 2. AGRÉGALO AQUÍ
  ]
};