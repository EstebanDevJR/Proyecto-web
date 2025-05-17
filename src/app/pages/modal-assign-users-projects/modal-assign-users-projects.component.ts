import { Component } from '@angular/core';

/**
 * Componente modal para asignar usuarios a proyectos
 * 
 * Características:
 * - Componente standalone (no necesita declararse en módulos)
 * - Diseñado para usarse como diálogo/modal
 * - Actualmente en estado básico (sin lógica implementada)
 */
@Component({
  selector: 'app-modal-assign-users-projects', // Selector para usar en templates
  standalone: true, // Componente auto-contenido (Angular 14+)
  imports: [], // Importaciones de otros componentes/directivas
  templateUrl: './modal-assign-users-projects.component.html', // Template asociado
  styleUrl: './modal-assign-users-projects.component.scss' // Estilos específicos
})
export class ModalAssignUsersProjectsComponent {
  // Componente actualmente vacío - pendiente de implementar lógica
  // Futuras implementaciones podrían incluir:
  // - Listado de usuarios disponibles
  // - Selección de proyectos
  // - Métodos para asignar/desasignar
  // - Validación de formularios
}