import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
// Importaciones de Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// Importaciones para formularios reactivos
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
// Importaciones para diálogo modal
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogModule, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
// Importaciones de servicios
import { UsersService } from 'app/services/users/users.service';
import { ProjectsService } from 'app/services/projects/projects.service';
import { MatSnackBar } from '@angular/material/snack-bar';
// Importaciones de modelos
import { CreateProject, Project, User } from 'app/core/models/project.interface';
// Utilidades
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-create-project',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule
  ],
  templateUrl: './modal-create-project.component.html',
  styleUrls: ['./modal-create-project.component.scss']
})
export class ModalCreateProjectComponent implements OnInit {
  formCreateProject!: FormGroup; // Formulario reactivo para creación/edición de proyectos
  administratorsValues: User[] = []; // Lista de administradores disponibles
  isLoading: boolean = false; // Estado de carga
  isEditMode: boolean = false; // Modo edición

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { project?: Project }, // Datos inyectados en el modal
    private readonly _formBuilder: FormBuilder, // Constructor de formularios
    private readonly _userService: UsersService, // Servicio de usuarios
    private readonly _projectService: ProjectsService, // Servicio de proyectos
    private readonly dialogRef: MatDialogRef<ModalCreateProjectComponent>, // Referencia al diálogo
    private readonly _snackBar: MatSnackBar, // Servicio para notificaciones
  ) {
    this.isEditMode = !!this.data?.project;
    this.createFormProject(); // Inicializa el formulario
  }

  ngOnInit(): void {
    this.getAllAdministrator(); // Carga los administradores al iniciar
    
    // Si estamos en modo edición, llenar el formulario con los datos del proyecto
    if (this.isEditMode && this.data.project) {
      this.populateForm(this.data.project);
    }
  }
  
  /**
   * Crea el formulario reactivo con validaciones
   */
  private createFormProject() {
    this.formCreateProject = this._formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      administrador_id: ['', Validators.required]
    });
  }

  /**
   * Llena el formulario con datos del proyecto para edición
   * @param project Proyecto a editar
   */
  private populateForm(project: Project) {
    this.formCreateProject.patchValue({
      nombre: project.nombre,
      descripcion: project.descripcion,
      administrador_id: project.administrador_id
    });
  }

  /**
   * Obtiene todos los administradores disponibles
   */
  private getAllAdministrator() {
    this.isLoading = true;
    this._userService.getAllAdministrator().subscribe({
      next: (res) => {
        console.log('🔍 Administradores recibidos:', res);
        this.administratorsValues = res.users || [];
        console.log('📋 Administradores asignados:', this.administratorsValues);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('❌ Error al cargar administradores:', err);
        this._snackBar.open('Error al cargar administradores', 'Cerrar', {
          duration: 3000
        });
        this.isLoading = false;
      }
    });
  }

  /**
   * Obtiene la longitud de la descripción para mostrar el contador
   */
  getDescriptionLength(): number {
    return this.formCreateProject.get('descripcion')?.value?.length || 0;
  }

  /**
   * Envía el formulario al servidor
   */
  onSubmit() {
    if (this.formCreateProject.invalid) {
      this.markFormGroupTouched();
      Swal.fire('Error', 'Por favor completa todos los campos requeridos correctamente', 'error');
      return;
    }
    
    this.isLoading = true;
    const projectData = this.getProjectData();
    
    if (this.isEditMode) {
      this.updateProject(projectData);
    } else {
      this.createProject(projectData);
    }
  }

  /**
   * Crea un nuevo proyecto
   */
  private createProject(projectData: CreateProject) {
    this._projectService.createProject(projectData).subscribe({
      next: (response) => {
        this.isLoading = false;
        Swal.fire('¡Éxito!', 'Proyecto creado correctamente', 'success');
        this.dialogRef.close(response.proyecto);
      },
      error: (err) => {
        this.isLoading = false;
        console.error(err);
        Swal.fire('Error', err.error?.message || 'Error al crear el proyecto', 'error');
      }
    });
  }

  /**
   * Actualiza un proyecto existente
   */
  private updateProject(projectData: CreateProject) {
    if (!this.data.project?.id) return;
    
    this._projectService.updateProject(this.data.project.id, projectData).subscribe({
      next: (response) => {
        this.isLoading = false;
        Swal.fire('¡Éxito!', 'Proyecto actualizado correctamente', 'success');
        this.dialogRef.close(response.proyecto);
      },
      error: (err) => {
        this.isLoading = false;
        console.error(err);
        Swal.fire('Error', err.error?.message || 'Error al actualizar el proyecto', 'error');
      }
    });
  }

  /**
   * Obtiene los datos del formulario
   */
  private getProjectData(): CreateProject {
    return {
      nombre: this.formCreateProject.get('nombre')?.value.trim(),
      descripcion: this.formCreateProject.get('descripcion')?.value.trim(),
      administrador_id: Number(this.formCreateProject.get('administrador_id')?.value)
    };
  }

  /**
   * Marca todos los campos del formulario como tocados para mostrar errores
   */
  private markFormGroupTouched() {
    Object.keys(this.formCreateProject.controls).forEach(key => {
      const control = this.formCreateProject.get(key);
      control?.markAsTouched();
    });
  }
}