import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
// Importaciones de Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
// Importaciones para formularios reactivos
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
// Importaciones para diálogo modal
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogModule, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
// Importaciones adicionales
import Swal from 'sweetalert2';
import { UsersService } from 'app/services/users/users.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    ReactiveFormsModule
  ],
  templateUrl: './modal-create-project.component.html',
  styleUrls: ['./modal-create-project.component.scss']
})
export class ModalCreateProjectComponent implements OnInit {
  formCreateProject!: FormGroup; // Formulario reactivo para creación de proyectos
  administratorsValues: any[] = []; // Lista de administradores disponibles
  showFieldAdministrator: boolean = false; // Controla visibilidad del campo administrador

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, // Datos inyectados en el modal
    private readonly _formBuilder: FormBuilder, // Constructor de formularios
    private readonly _userService: UsersService, // Servicio de usuarios
    private readonly dialogRef: MatDialogRef<ModalCreateProjectComponent>, // Referencia al diálogo
    private readonly _snackBar: MatSnackBar, // Servicio para notificaciones
  ) {
    this.createFormProject(); // Inicializa el formulario
    
    // Valida coincidencia de contraseñas con debounce para mejor performance
    this.formCreateProject.controls['confirmPassword'].valueChanges.pipe(
      debounceTime(1000), // Espera 1 segundo después de la última tecla
      distinctUntilChanged() // Solo emite si el valor cambió
    ).subscribe((value) => {
      this.validatePassword(value);
    });
  }

  ngOnInit(): void {
    this.getAllAdministrator(); // Carga los administradores al iniciar
  }
  
  /**
   * Crea el formulario reactivo con validaciones
   */
  private createFormProject() {
    this.formCreateProject = this._formBuilder.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      rol_id: ['', Validators.required],
      administrador_id: [undefined]
    });
  }

  /**
   * Obtiene todos los administradores disponibles
   */
  private getAllAdministrator() {
    this._userService.getAllAdministrator().subscribe({
      next: (res) => {
        this.administratorsValues = res.users;
      },
      error: (err) => {
        console.error(err);
        this._snackBar.open('Error al cargar administradores', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }

  /**
   * Maneja el cambio de selección en el campo de rol
   * @param event Evento de cambio
   */
  onChangeRole(event: any) {
    if (event.value === '1') { // Si el rol es administrador
      this.hideAdministratorField();
    } else { // Para otros roles
      this.showAdministratorField();
    }
  }

  /**
   * Envía el formulario al servidor
   */
  onSubmit() {
    if (this.formCreateProject.invalid) {
      Swal.fire('Error', 'Por favor completa todos los campos requeridos', 'error');
      return;
    }
    
    const projectData = {
      nombre: this.formCreateProject.get('nombre')?.value,
      email: this.formCreateProject.get('email')?.value,
      password: this.formCreateProject.get('password')?.value,
      rol_id: Number(this.formCreateProject.get('rol_id')?.value),
      administrador_id: this.formCreateProject.get('administrador_id')?.value
    };
    
    // Aquí iría la lógica para enviar los datos al servidor
    // Ejemplo:
    // this._projectService.create(projectData).subscribe(...);
  }

  /**
   * Valida que las contraseñas coincidan
   * @param confirmPassword Contraseña de confirmación
   */
  private validatePassword(confirmPassword: string) {
    const password = this.formCreateProject.get('password')?.value;
    if (password !== confirmPassword) {
      this.formCreateProject.get('confirmPassword')?.setErrors({ invalid: true });
    } else {
      this.formCreateProject.get('confirmPassword')?.setErrors(null);
    }
  }
  
  /**
   * Muestra el campo de selección de administrador
   */
  private showAdministratorField() {
    this.showFieldAdministrator = true;
    this.formCreateProject.get('administrador_id')?.setValidators([Validators.required]);
    this.formCreateProject.get('administrador_id')?.updateValueAndValidity();
  }

  /**
   * Oculta el campo de selección de administrador
   */
  private hideAdministratorField() {
    this.showFieldAdministrator = false;
    this.formCreateProject.get('administrador_id')?.clearValidators();
    this.formCreateProject.get('administrador_id')?.updateValueAndValidity();
  }
}