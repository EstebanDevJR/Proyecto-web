// Importación básica de Angular
import { Component } from '@angular/core';

/**
 * Componente principal/contendor de la aplicación
 * 
 * Características:
 * - Standalone (no necesita declararse en módulos)
 * - Componente raíz del dashboard/área principal
 */
@Component({
  selector: 'app-main', // Selector para usar en templates
  templateUrl: './main.component.html', // Template asociado
  styleUrls: ['./main.component.scss'], // Estilos específicos
  standalone: true, // Componente auto-contenido (Angular 14+)
  imports: [], // Importaciones de otros componentes standalone
})
export class MainComponent {
  
  // Constructor simple sin lógica inicial
  constructor() { }
  
}