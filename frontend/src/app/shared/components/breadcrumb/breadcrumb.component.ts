// Importa decoradores y módulos de Angular
import { Component, Input } from '@angular/core';
import { FeatherModule } from 'angular-feather'; // Importa módulo de iconos Feather
import { RouterLink } from '@angular/router'; // Importa directiva para enrutamiento

// Decorador @Component que define el componente
@Component({
  selector: 'app-breadcrumb', // Selector para usar en plantillas
  templateUrl: './breadcrumb.component.html', // Ruta a la plantilla HTML
  styleUrls: ['./breadcrumb.component.scss'], // Ruta a los estilos SCSS
  standalone: true, // Marca el componente como standalone (no necesita módulo)
  imports: [RouterLink, FeatherModule] // Importa dependencias necesarias
})
export class BreadcrumbComponent {
  // Propiedad de entrada para el título principal
  @Input()
  title!: string; // El signo ! indica que será inicializado después

  // Propiedad de entrada para los items del breadcrumb
  @Input()
  items!: string[]; // Array de strings para las migas de pan

  // Propiedad de entrada para el item activo
  @Input()
  active_item!: string; // Representa el elemento actual/activo

  // Constructor del componente (vacío en este caso)
  constructor() {
    // Constructor vacío porque no necesita inicialización especial
  }
}