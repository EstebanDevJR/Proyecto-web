// Importaciones para rutas del dashboard
import { Route } from '@angular/router';
import { MainComponent } from './main/main.component';

/**
 * Configuración de rutas principales del dashboard
 * 
 * Nota: Estas rutas deberían estar en un archivo separado (dashboard.routes.ts)
 */
export const DASHBOARD_ROUTE: Route[] = [
  {
    path: 'main', // Ruta principal del dashboard
    component: MainComponent // Componente contenedor principal
  },
];