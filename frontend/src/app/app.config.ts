// Importa proveedores y módulos necesarios de Angular
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { APP_ROUTE } from './app.routes';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { JwtInterceptor } from '@core/interceptor/jwt.interceptor';

// Objeto de configuración principal de la aplicación
export const appConfig: ApplicationConfig = {
  providers: [
    // Proveedor básico para el cliente HTTP
    provideHttpClient(),
    
    // Configuración del router con las rutas definidas
    provideRouter(APP_ROUTE),
    
    // Soporte para animaciones del navegador
    provideAnimations(),
    
    // Usa PathLocationStrategy (rutas HTML5) en lugar de HashLocationStrategy
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    
    // Configuración para manejo de fechas en Angular Material
    { provide: DateAdapter, useClass: MomentDateAdapter },
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: 'YYYY-MM-DD', // Formato de entrada para fechas
        },
        display: {
          dateInput: 'YYYY-MM-DD', // Formato de visualización de fechas
          monthYearLabel: 'YYYY MMM', // Formato para etiquetas de mes/año
          dateA11yLabel: 'LL', // Formato accesible para fechas
          monthYearA11yLabel: 'YYYY MMM', // Formato accesible para mes/año
        },
      },
    },
    
    // Interceptor JWT para autenticación
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    
    // Módulo de iconos Feather con todos los iconos
    importProvidersFrom(FeatherModule.pick(allIcons)),
    
    // Configuración de Chart.js con registros por defecto
    provideCharts(withDefaultRegisterables()),
    
    // Configuración adicional para el cliente HTTP
    provideHttpClient(withInterceptorsFromDi()),
    
    // Soporte para animaciones asíncronas
    provideAnimationsAsync(),
  ],
};