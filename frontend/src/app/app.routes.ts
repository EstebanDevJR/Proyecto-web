// Importa utilidades de routing de Angular
import { Route } from '@angular/router';
import { MainLayoutComponent } from './layout/app-layout/main-layout/main-layout.component';
import { AuthGuard } from '@core/guard/auth.guard';

// Configuración principal de rutas de la aplicación
export const APP_ROUTE: Route[] = [
  {
    path: '', // Ruta raíz
    component: MainLayoutComponent, // Componente de layout principal
    canActivate: [AuthGuard], // Guardia de autenticación
    children: [ // Rutas hijas
      {
        path: 'dashboard', // Ruta del dashboard
        loadChildren: () => // Carga diferida del módulo dashboard
          import('./features/dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTE),
      },
      {
        path: 'page', // Ruta para páginas
        canActivate: [AuthGuard], // Agregar AuthGuard también aquí
        loadChildren: () => // Carga diferida del módulo de páginas
          import('./pages/pages.routes').then((m) => m.PAGES_ROUTE),
      },
    ],
  },
  {
    path: 'authentication', // Ruta para autenticación
    loadChildren: () => // Carga diferida del módulo de autenticación
      import('./features/authentication/auth.routes').then((m) => m.AUTH_ROUTE),
  },
];