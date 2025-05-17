// Importaciones básicas de Angular
import { Component } from '@angular/core';
import { Router } from '@angular/router';

// Importaciones de módulos de Angular Material y Forms
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

// Decorador @Component que define la configuración del componente
@Component({
    selector: 'app-page404', // Selector para usar en templates
    templateUrl: './page404.component.html', // Ruta al template HTML
    styleUrls: ['./page404.component.scss'], // Ruta a los estilos SCSS
    standalone: true, // Indica que es un componente standalone (Angular 14+)
    imports: [ // Módulos importados directamente (solo para componentes standalone)
        FormsModule, // Para soporte de formularios
        MatButtonModule, // Para usar componentes de botón de Angular Material
    ],
})
export class Page404Component {
  // Constructor con inyección de dependencias
  constructor(
    private _router: Router // Servicio Router para navegación
  ) {
    // El constructor puede quedar vacío si no hay inicializaciones necesarias
  }

  /**
   * Método para redirigir al usuario al dashboard principal
   * Se ejecuta cuando el usuario hace clic en el botón "Volver al inicio"
   */
  redirectHome() {
    // Navega a la ruta especificada usando el Router de Angular
    this._router.navigate(['/dashboard/main']);
  }
}