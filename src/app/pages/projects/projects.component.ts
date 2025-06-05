import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// Angular Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
// Services and Models
import { ProjectsService } from 'app/services/projects/projects.service';
import { UsersService } from 'app/services/users/users.service';
import { Project, User } from 'app/core/models/project.interface';
import { ModalCreateProjectComponent } from '../modal-create-project/modal-create-project.component';
import { ModalAssignUsersProjectsComponent } from '../modal-assign-users-projects/modal-assign-users-projects.component';
// Utilities
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatChipsModule,
    MatPaginatorModule,
    MatDividerModule
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent implements OnInit, OnDestroy {
  // Datos principales
  projects: Project[] = [];
  filteredProjects: Project[] = [];
  administrators: User[] = [];
  
  // Estados de la interfaz
  isLoading: boolean = false;
  searchTerm: string = '';
  selectedAdmin: string = '';
  
  // Estadísticas
  totalProjects: number = 0;
  activeProjects: number = 0;
  totalUsers: number = 0;
  
  // Paginación
  pageSize: number = 10;
  currentPage: number = 0;
  
  // Destructor de subscripciones
  private destroy$ = new Subject<void>();

  constructor(
    private readonly _projectsService: ProjectsService,
    private readonly _usersService: UsersService,
    private readonly _snackBar: MatSnackBar,
    private readonly _dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadProjects();
    this.loadAdministrators();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Carga todos los proyectos
   */
  loadProjects(): void {
    this.isLoading = true;
    console.log('🔄 Iniciando carga de proyectos...');
    
    // Verificar autenticación antes de cargar
    const token = sessionStorage.getItem('accessToken');
    console.log('🔑 Token presente:', !!token);
    if (token) {
      console.log('🔑 Token length:', token.length);
      console.log('🔑 Token preview:', token.substring(0, 20) + '...');
    }
    
    this._projectsService.getAllProjects()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('✅ Respuesta exitosa:', response);
          this.projects = response.proyectos || [];
          this.filteredProjects = [...this.projects];
          this.calculateStatistics();
          this.isLoading = false;
          console.log(`📊 ${this.projects.length} proyectos cargados`);
        },
        error: (error) => {
          console.error('❌ Error completo:', error);
          console.error('❌ Status:', error.status);
          console.error('❌ Message:', error.message);
          console.error('❌ Error object:', error.error);
          
          let errorMessage = 'Error al cargar los proyectos';
          
          if (error.status === 401) {
            errorMessage = 'No autorizado. Por favor, inicia sesión nuevamente.';
          } else if (error.status === 403) {
            errorMessage = 'No tienes permisos para ver los proyectos.';
          } else if (error.status === 0) {
            errorMessage = 'Error de conexión. Verifica que el servidor esté funcionando.';
          }
          
          this._snackBar.open(errorMessage, 'Cerrar', {
            duration: 5000
          });
          this.isLoading = false;
        }
      });
  }

  /**
   * Carga la lista de administradores para filtros
   */
  loadAdministrators(): void {
    this._usersService.getAllAdministrator()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.administrators = response.users || [];
        },
        error: (error) => {
          console.error('Error al cargar administradores:', error);
        }
      });
  }

  /**
   * Calcula las estadísticas mostradas en las tarjetas
   */
  calculateStatistics(): void {
    this.totalProjects = this.projects.length;
    this.activeProjects = this.projects.length; // Todos activos por ahora
    this.totalUsers = this.projects.reduce((total, project) => {
      return total + (project.usuarios?.length || 0);
    }, 0);
  }

  /**
   * Aplica filtros de búsqueda y administrador
   */
  applyFilter(): void {
    let filtered = [...this.projects];

    // Filtro por término de búsqueda
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(project => 
        project.nombre.toLowerCase().includes(term) ||
        project.descripcion.toLowerCase().includes(term) ||
        project.administrador?.nombre.toLowerCase().includes(term)
      );
    }

    // Filtro por administrador
    if (this.selectedAdmin) {
      filtered = filtered.filter(project => 
        project.administrador_id === Number(this.selectedAdmin)
      );
    }

    this.filteredProjects = filtered;
  }

  /**
   * Limpia todos los filtros
   */
  clearFilters(): void {
    this.searchTerm = '';
    this.selectedAdmin = '';
    this.filteredProjects = [...this.projects];
  }

  /**
   * Verifica si hay filtros activos
   */
  hasActiveFilters(): boolean {
    return this.searchTerm.trim() !== '' || this.selectedAdmin !== '';
  }

  /**
   * Abre el modal para crear un nuevo proyecto
   */
  openCreateProjectModal(): void {
    const dialogRef = this._dialog.open(ModalCreateProjectComponent, {
      width: '600px',
      disableClose: true,
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProjects(); // Recargar la lista después de crear
        this._snackBar.open('Proyecto creado exitosamente', 'Cerrar', {
          duration: 3000
        });
      }
    });
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
          ${project.usuarios && project.usuarios.length > 0 ? 
            `<p><strong>Lista de Usuarios:</strong></p>
             <ul>${project.usuarios.map(user => `<li>${user.nombre} (${user.email})</li>`).join('')}</ul>` : 
            ''
          }
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Cerrar',
      width: '600px'
    });
  }

  /**
   * Edita un proyecto existente
   */
  editProject(project: Project): void {
    const dialogRef = this._dialog.open(ModalCreateProjectComponent, {
      width: '600px',
      disableClose: true,
      data: { project }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProjects(); // Recargar la lista después de editar
        this._snackBar.open('Proyecto actualizado exitosamente', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }

  /**
   * Asigna usuarios a un proyecto
   */
  assignUsers(project: Project): void {
    const dialogRef = this._dialog.open(ModalAssignUsersProjectsComponent, {
      width: '700px',
      disableClose: true,
      data: { project }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProjects(); // Recargar la lista después de asignar usuarios
        this._snackBar.open('Usuarios asignados exitosamente', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }

  /**
   * Elimina un proyecto
   */
  deleteProject(project: Project): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `Se eliminará el proyecto "${project.nombre}" permanentemente.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this._projectsService.deleteProject(project.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.loadProjects();
              Swal.fire('¡Eliminado!', 'El proyecto ha sido eliminado.', 'success');
            },
            error: (error) => {
              console.error('Error al eliminar proyecto:', error);
              this.isLoading = false;
              Swal.fire('Error', 'No se pudo eliminar el proyecto', 'error');
            }
          });
      }
    });
  }

  /**
   * Formatea una fecha para mostrar
   */
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  /**
   * Función de tracking para optimizar el rendimiento de *ngFor
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
    // Aquí se implementaría la lógica de paginación del servidor si fuera necesario
  }
}