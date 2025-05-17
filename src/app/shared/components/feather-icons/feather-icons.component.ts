// Importa decoradores de Angular
import { Component, Input } from '@angular/core';
// Importa el módulo de iconos Feather
import { FeatherModule } from 'angular-feather';

// Decorador @Component que define el componente
@Component({
  selector: 'app-feather-icons', // Selector para usar en plantillas
  templateUrl: './feather-icons.component.html', // Ruta a la plantilla HTML
  styleUrls: ['./feather-icons.component.scss'], // Ruta a los estilos SCSS
  standalone: true, // Marca el componente como standalone
  imports: [FeatherModule] // Importa el módulo de iconos Feather
})
export class FeatherIconsComponent {
  /**
   * Input: Nombre del icono Feather a mostrar
   * @example 'home', 'user', 'settings'
   */
  @Input() public icon?: string;

  /**
   * Input: Clases CSS adicionales para personalizar el icono
   * @example 'text-primary', 'large-icon'
   */
  @Input() public class?: string;

  // Constructor del componente
  constructor() {
    // Constructor vacío porque no necesita inicialización especial
  }
}