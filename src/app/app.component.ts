// Importa módulos y decoradores de Angular
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Event, Router, NavigationStart, NavigationEnd, RouterModule } from '@angular/router';

// Decorador @Component que define el componente raíz
@Component({
  selector: 'app-root', // Selector del componente raíz
  standalone: true, // Componente standalone (no necesita módulo)
  imports: [CommonModule, RouterModule], // Importa módulos necesarios
  templateUrl: './app.component.html', // Plantilla HTML
  styleUrls: ['./app.component.scss'] // Estilos SCSS
})
export class AppComponent {
  currentUrl!: string; // Almacena la URL actual

  // Constructor con inyección del Router
  constructor(public _router: Router) {
    // Suscribe a eventos del router
    this._router.events.subscribe((routerEvent: Event) => {
      // Cuando comienza la navegación
      if (routerEvent instanceof NavigationStart) {
        // Extrae el último segmento de la URL
        this.currentUrl = routerEvent.url.substring(
          routerEvent.url.lastIndexOf('/') + 1
        );
      }
      
      // Cuando termina la navegación (no hace nada actualmente)
      if (routerEvent instanceof NavigationEnd) {
        // Lógica adicional podría ir aquí
      }
      
      // Scroll al inicio de la página en cada navegación
      window.scrollTo(0, 0);
    });
  }
}