import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  FormBuilder, 
  Validators, 
  FormGroup, 
  ReactiveFormsModule, 
  FormsModule 
} from '@angular/forms';
import { 
  MAT_DIALOG_DATA, 
  MatDialogActions, 
  MatDialogClose, 
  MatDialogContent, 
  MatDialogModule, 
  MatDialogRef, 
  MatDialogTitle 
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { UsersService } from 'app/services/users/users.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-create-user',
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
  templateUrl: './modal-create-user.component.html',
  styleUrls: ['./modal-create-user.component.scss']
})
export class ModalCreateUserComponent implements OnInit {
  formCreateUser!: FormGroup; // Formulario reactivo para creación de usuarios
  administratorsValue: any[] = []; // Lista de administradores disponibles
  showFieldAdministrator: boolean = false; // Controla visibilidad del campo administrador

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, // Datos inyectados en el modal
    private readonly _formBuilder: FormBuilder, // Constructor de formularios
    private readonly _userService: UsersService, // Servicio de usuarios
    private readonly _dialogRef: MatDialogRef<ModalCreateUserComponent>, // Referencia al diálogo
    private readonly _snackBar: MatSnackBar, // Servicio para notificaciones
  ) {
    this.createFormUsers(); // Inicializa el formulario
    
    // Valida coincidencia de contraseñas con debounce para mejor performance
    this.formCreateUser.controls['confirmPassword'].valueChanges.pipe(
      debounceTime(1000), // Espera 1 segundo después de la última tecla
      distinctUntilChanged() // Solo emite si el valor cambió
    ).subscribe((value) => {
      this.validatePassword(value);
    });
  }

  ngOnInit(): void {
    this.getAllAdministrator(); // Carga los administradores al iniciar
    this.showAdministratorField(); // Siempre mostrar el campo de administrador
  }
  
  /**
   * Crea el formulario reactivo con validaciones
   */
  private createFormUsers() {
    this.formCreateUser = this._formBuilder.group({
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
        this.administratorsValue = res.users;
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
    // Todos los usuarios (incluyendo administradores) necesitan un administrador padre
    this.showAdministratorField();
  }

  /**
   * Envía el formulario al servidor
   */
  onSubmit() {
    if (this.formCreateUser.invalid) {
      Swal.fire('Error', 'Por favor completa todos los campos requeridos', 'error');
      return;
    }

    // Validar que las contraseñas coincidan
    const password = this.formCreateUser.get('password')?.value;
    const confirmPassword = this.formCreateUser.get('confirmPassword')?.value;
    if (password !== confirmPassword) {
      Swal.fire('Error', 'Las contraseñas no coinciden', 'error');
      return;
    }
    
    const rolId = Number(this.formCreateUser.get('rol_id')?.value);
    const userData = {
      nombre: this.formCreateUser.get('nombre')?.value,
      email: this.formCreateUser.get('email')?.value,
      password: this.formCreateUser.get('password')?.value,
      rol_id: rolId,
      administrador_id: this.formCreateUser.get('administrador_id')?.value
    };
    

    
    this._userService.createUser(userData).subscribe({
      next: (response) => {
        this._snackBar.open('Usuario creado exitosamente', 'Cerrar', { duration: 3000 });
        this._dialogRef.close(true); // Cierra el modal y retorna éxito
      },
      error: (error) => {
        const errorMsg = error.error?.message || 'Error al crear usuario';
        this._snackBar.open(errorMsg, 'Cerrar', { duration: 5000 });
      }
    });
  }

  /**
   * Valida que las contraseñas coincidan
   * @param confirmPassword Contraseña de confirmación
   */
  private validatePassword(confirmPassword: string) {
    const password = this.formCreateUser.get('password')?.value;
    if (password !== confirmPassword) {
      this.formCreateUser.get('confirmPassword')?.setErrors({ invalid: true });
    } else {
      this.formCreateUser.get('confirmPassword')?.setErrors(null);
    }
  }
  
  /**
   * Muestra el campo de selección de administrador
   */
  private showAdministratorField() {
    this.showFieldAdministrator = true;
    this.formCreateUser.get('administrador_id')?.setValidators([Validators.required]);
    this.formCreateUser.get('administrador_id')?.updateValueAndValidity();
  }

  /**
   * Oculta el campo de selección de administrador
   */
  private hideAdministratorField() {
    this.showFieldAdministrator = false;
    this.formCreateUser.get('administrador_id')?.clearValidators();
    this.formCreateUser.get('administrador_id')?.updateValueAndValidity();
    this.formCreateUser.get('administrador_id')?.setValue(null);
  }
}