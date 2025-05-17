import { Component } from '@angular/core';

@Component({
  selector: 'app-projects', // Selector para usar en templates
  standalone: true, // Componente auto-contenido (Angular 14+)
  imports: [], // Importaciones de otros componentes/directivas
  templateUrl: './projects.component.html', // Template asociado
  styleUrl: './projects.component.scss' // Estilos específicos
})
export class ProjectsComponent {
}