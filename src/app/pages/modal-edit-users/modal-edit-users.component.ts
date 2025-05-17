import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogModule,
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
  MAT_DIALOG_DATA,
  MatDialogRef
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsersService } from 'app/services/users/users.service';

@Component({
  selector: 'app-modal-edit-users',
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
  templateUrl: './modal-edit-users.component.html',
  styleUrls: ['./modal-edit-users.component.scss']
})
export class ModalEditUsersComponent {
  formUpdateUsers!: FormGroup; // Formulario reactivo para actualización
  administratorsValues: any[] = []; // Lista de administradores disponibles

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, // Datos inyectados (incluye usuario a editar)
    private readonly _formBuilder: FormBuilder, // Constructor de formularios
    private readonly _snackBar: MatSnackBar, // Servicio de notificaciones
    private readonly _userService: UsersService, // Servicio de usuarios
    private readonly dialogRef: MatDialogRef<ModalEditUsersComponent> // Referencia al diálogo
  ) {
    this.updateFormUsers(); // Inicializa el formulario
    this.getAllAdministrator(); // Carga los administradores disponibles
  }

  ngOnInit() {
    // Si hay datos de usuario, carga la información en el formulario
    if (this.data?.user) {
      this.loadUserData(this.data.user);
    }
  }

  /**
   * Inicializa el formulario reactivo con validaciones
   */
  updateFormUsers() {
    this.formUpdateUsers = this._formBuilder.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      rol_id: ['', Validators.required],
      administrador_id: ['', Validators.required]
    });
  }

  /**
   * Carga los datos del usuario en el formulario
   * @param user Objeto con los datos del usuario a editar
   */
  loadUserData(user: any) {
    this.formUpdateUsers.patchValue({
      nombre: user.nombre,
      email: user.email,
      rol_id: String(user.rol_id), // Asegura que sea string para el select
      administrador_id: user.administrador_id
    });
  }

  /**
   * Obtiene todos los administradores disponibles
   */
  getAllAdministrator() {
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
   * Envía los datos actualizados al servidor
   */
  updateUsers() {
    if (this.formUpdateUsers.valid) {
      const userData = this.formUpdateUsers.value;
      const userId = this.data?.user?.id;

      this._userService.updateUser(userId, userData).subscribe({
        next: (response) => {
          this._snackBar.open('Usuario actualizado exitosamente', 'Cerrar', { 
            duration: 5000 
          });
          this.dialogRef.close(true); // Cierra el modal indicando éxito
        },
        error: (error) => {
          const errorMessage = error.error?.message || 'Ocurrió un error al actualizar el usuario';
          this._snackBar.open(errorMessage, 'Cerrar', { duration: 5000 });
        }
      });
    }
  }
}