import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// Angular Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
// Services and Models
import { ProjectsService } from 'app/services/projects/projects.service';
import { AuthService } from '@core/service/auth.service';
import { Project } from 'app/core/models/project.interface';
// Utilities
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-my-projects',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatPaginatorModule
  ],
  templateUrl: './my-projects.component.html',
  styleUrls: ['./my-projects.component.scss']
})
export class MyProjectsComponent implements OnInit, OnDestroy {
  // Datos principales
  projects: Project[] = [];
  filteredProjects: Project[] = [];
  
  // Estados de la interfaz
  isLoading: boolean = false;
  searchTerm: string = '';
  
  // Estadísticas
  totalProjects: number = 0;
  
  // Paginación
  pageSize: number = 10;
  currentPage: number = 0;
  
  // Destructor de subscripciones
  private destroy$ = new Subject<void>();

  constructor(
    private readonly _projectsService: ProjectsService,
    private readonly _authService: AuthService,
    private readonly _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadMyProjects();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Carga los proyectos del usuario actual
   */
  loadMyProjects(): void {
    this.isLoading = true;
    
    // Obtener ID del usuario actual
    const userInfo = this._authService.getAuthFromSessionStorage();
    if (!userInfo?.id) {
      this._snackBar.open('Error al obtener información del usuario', 'Cerrar', {
        duration: 3000
      });
      this.isLoading = false;
      return;
    }

    this._projectsService.getProjectsByUserId(userInfo.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.projects = response.proyectos || [];
          this.filteredProjects = [...this.projects];
          this.totalProjects = this.projects.length;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error al cargar mis proyectos:', error);
          this._snackBar.open('Error al cargar los proyectos', 'Cerrar', {
            duration: 3000
          });
          this.isLoading = false;
        }
      });
  }

  /**
   * Aplica filtro de búsqueda
   */
  applyFilter(): void {
    let filtered = [...this.projects];

    // Filtro por término de búsqueda
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(project => 
        project.nombre.toLowerCase().includes(term) ||
        project.descripcion.toLowerCase().includes(term)
      );
    }

    this.filteredProjects = filtered;
  }

  /**
   * Limpia el filtro de búsqueda
   */
  clearFilter(): void {
    this.searchTerm = '';
    this.filteredProjects = [...this.projects];
  }

  /**
   * Ve los detalles de un proyecto
   */
  viewProject(project: Project): void {
    Swal.fire({
      title: project.nombre,
      html: `
        <div style="text-align: left;">
          <p><strong>Descripción:</strong> ${project.descripcion}</p>
          <p><strong>Administrador:</strong> ${project.administrador?.nombre || 'Sin asignar'}</p>
          <p><strong>Fecha de Creación:</strong> ${this.formatDate(project.fecha_creacion)}</p>
          <p><strong>Usuarios Asignados:</strong> ${project.usuarios?.length || 0}</p>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Cerrar',
      width: '600px'
    });
  }

  /**
   * Formatea una fecha para mostrar
   */
  formatDate(dateString: string): string {
    if (!dateString) return 'No especificada';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  /**
   * Track by function para el ngFor
   */
  trackByProjectId(index: number, project: Project): number {
    return project.id;
  }

  /**
   * Maneja el cambio de página en el paginador
   */
  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
  }
} 