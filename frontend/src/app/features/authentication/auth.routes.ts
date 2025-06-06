// Importación de las utilidades de rutas de Angular
import { Route } from "@angular/router";

// Importación de los componentes asociados a las rutas
import { SigninComponent } from "./signin/signin.component";
import { Page404Component } from "./page404/page404.component";
import { SignupComponent } from "./signup/signup.component";

/**
 * Configuración de rutas para el módulo de autenticación
 * 
 * Este arreglo define las rutas disponibles en la sección de autenticación
 * y cómo se redirige a los diferentes componentes.
 */
export const AUTH_ROUTE: Route[] = [
  {
    path: "", // Ruta raíz/vacía
    redirectTo: "signin", // Redirige automáticamente a 'signin'
    pathMatch: "full", // Requiere que la ruta coincida completamente
  },
  {
    path: "signin", // Ruta para el inicio de sesión
    component: SigninComponent, // Componente que se mostrará
  },
  {
    path: "signup", // Ruta para el registro
    component: SignupComponent, // Componente de registro
  },
  {
    path: "page404", // Ruta para la página 404
    component: Page404Component, // Componente de error 404
  },
  { 
    path: '**', // Comodín para cualquier ruta no definida
    redirectTo: 'page404', // Redirige a la página 404
    pathMatch: 'full' // Requiere coincidencia completa
  },
];