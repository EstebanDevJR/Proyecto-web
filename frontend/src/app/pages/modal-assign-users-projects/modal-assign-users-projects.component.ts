import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
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
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
// Dialog
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
// Services and Models
import { ProjectsService } from 'app/services/projects/projects.service';
import { UsersService } from 'app/services/users/users.service';
import { Project, User } from 'app/core/models/project.interface';
// Utilities
import { Subject, takeUntil, forkJoin } from 'rxjs';
import Swal from 'sweetalert2';

interface Role {
  id: number;
  name: string;
}

interface ExtendedUser extends User {
  rol_name?: string;
}

/**
 * Componente modal para asignar usuarios a proyectos
 * 
 * Características:
 * - Componente standalone (no necesita declararse en módulos)
 * - Diseñado para usarse como diálogo/modal
 * - Permite asignar múltiples usuarios a un proyecto
 * - Muestra usuarios ya asignados y permite removerlos
 * - Incluye filtros de búsqueda y por rol
 */
@Component({
  selector: 'app-modal-assign-users-projects',
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
    MatListModule,
    MatChipsModule,
    MatTooltipModule,
    MatDialogModule
  ],
  templateUrl: './modal-assign-users-projects.component.html',
  styleUrl: './modal-assign-users-projects.component.scss'
})
export class ModalAssignUsersProjectsComponent implements OnInit, OnDestroy {
  // Datos principales
  availableUsers: ExtendedUser[] = [];
  filteredUsers: ExtendedUser[] = [];
  assignedUsers: ExtendedUser[] = [];
  selectedUsers: ExtendedUser[] = [];
  availableRoles: Role[] = [
    { id: 1, name: 'Administrador' },
    { id: 2, name: 'Usuario' },
    { id: 3, name: 'Miembro' }
  ];

  // Estados de la interfaz
  isLoading: boolean = false;
  isAssigning: boolean = false;
  isRemoving: boolean = false;
  searchTerm: string = '';
  selectedRole: string = '';

  // Destructor de subscripciones
  private destroy$ = new Subject<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { project: Project },
    private readonly _projectsService: ProjectsService,
    private readonly _usersService: UsersService,
    private readonly _snackBar: MatSnackBar,
    private readonly dialogRef: MatDialogRef<ModalAssignUsersProjectsComponent>
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Carga todos los datos necesarios
   */
  private loadData(): void {
    this.isLoading = true;
    
    // Cargar usuarios disponibles y usuarios ya asignados al proyecto
    forkJoin({
      allUsers: this._usersService.getAllUsers(),
      projectDetails: this._projectsService.getProjectById(this.data.project.id)
    }).pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (responses: any) => {
        // Procesar usuarios disponibles
        const allUsers: ExtendedUser[] = responses.allUsers.users || [];
        
        // Procesar usuarios ya asignados
        const projectUsers: ExtendedUser[] = responses.projectDetails.proyecto?.usuarios || [];
        this.assignedUsers = projectUsers;

        // Filtrar usuarios disponibles (excluir los ya asignados)
        this.availableUsers = allUsers.filter((user: ExtendedUser) => 
          !projectUsers.some((assignedUser: ExtendedUser) => assignedUser.id === user.id)
        );

        this.filteredUsers = [...this.availableUsers];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar datos:', error);
        this._snackBar.open('Error al cargar los datos', 'Cerrar', {
          duration: 3000
        });
        this.isLoading = false;
      }
    });
  }

  /**
   * Filtra los usuarios según el término de búsqueda y rol seleccionado
   */
  filterUsers(): void {
    let filtered = [...this.availableUsers];

    // Filtro por término de búsqueda
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(user => 
        user.nombre.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
      );
    }

    // Filtro por rol
    if (this.selectedRole) {
      filtered = filtered.filter(user => 
        user.rol_id === Number(this.selectedRole)
      );
    }

    this.filteredUsers = filtered;
  }

  /**
   * Limpia todos los filtros
   */
  clearFilters(): void {
    this.searchTerm = '';
    this.selectedRole = '';
    this.filteredUsers = [...this.availableUsers];
  }

  /**
   * Verifica si un usuario ya está asignado al proyecto
   */
  isUserAlreadyAssigned(userId: number): boolean {
    return this.assignedUsers.some(user => user.id === userId);
  }

  /**
   * Remueve un usuario de la selección
   */
  removeSelectedUser(userToRemove: ExtendedUser): void {
    this.selectedUsers = this.selectedUsers.filter(user => user.id !== userToRemove.id);
  }

  /**
   * Asigna los usuarios seleccionados al proyecto
   */
  assignSelectedUsers(): void {
    if (this.selectedUsers.length === 0) {
      this._snackBar.open('Debe seleccionar al menos un usuario', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    this.isAssigning = true;
    const userIds = this.selectedUsers.map(user => user.id);
    
    this._projectsService.assignUsersToProject({
      projectId: this.data.project.id,
      userIds: userIds
    }).pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response) => {
        this.isAssigning = false;
        
        Swal.fire({
          title: '¡Éxito!',
          text: `Se asignaron ${this.selectedUsers.length} usuario(s) al proyecto correctamente`,
          icon: 'success',
          confirmButtonText: 'Continuar'
        });

        this.dialogRef.close(response.proyecto);
      },
      error: (error) => {
        this.isAssigning = false;
        console.error('Error al asignar usuarios:', error);
        
        Swal.fire({
          title: 'Error',
          text: error.error?.message || 'Error al asignar usuarios al proyecto',
          icon: 'error',
          confirmButtonText: 'Cerrar'
        });
      }
    });
  }

  /**
   * Remueve un usuario del proyecto
   */
  removeUserFromProject(user: ExtendedUser): void {
    Swal.fire({
      title: '¿Remover usuario?',
      text: `¿Estás seguro de que deseas remover a ${user.nombre} del proyecto?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f44336',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, remover',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isRemoving = true;
        
        this._projectsService.removeUserFromProject(this.data.project.id, user.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.isRemoving = false;
              
              // Actualizar las listas localmente
              this.assignedUsers = this.assignedUsers.filter(u => u.id !== user.id);
              this.availableUsers.push(user);
              this.filterUsers(); // Reaplica filtros
              
              this._snackBar.open(`${user.nombre} removido del proyecto`, 'Cerrar', {
                duration: 3000
              });
            },
            error: (error) => {
              this.isRemoving = false;
              console.error('Error al remover usuario:', error);
              
              Swal.fire({
                title: 'Error',
                text: error.error?.message || 'Error al remover el usuario del proyecto',
                icon: 'error',
                confirmButtonText: 'Cerrar'
              });
            }
          });
      }
    });
  }

  /**
   * Función de tracking para optimizar el rendimiento de *ngFor
   */
  trackByUserId(index: number, user: ExtendedUser): number {
    return user.id;
  }
}