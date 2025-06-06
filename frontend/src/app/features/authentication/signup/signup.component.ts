import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  FormBuilder, 
  Validators, 
  FormGroup, 
  ReactiveFormsModule, 
  FormsModule 
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RegisterService } from 'app/services/auth/register.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterModule,
    MatButtonModule, 
    MatSelectModule, 
    MatIconModule, 
    MatFormFieldModule,
    MatInputModule, 
    MatCardModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="auth-container">
      <div class="signup-wrapper">
        <mat-card class="signup-card">
          <!-- Logo y encabezado -->
          <div class="signup-header">
            <div class="logo-container">
              <mat-icon class="logo-icon">person_add</mat-icon>
            </div>
            <h1 class="welcome-title">Crear una cuenta</h1>
            <p class="signup-subtitle">Completa el formulario para registrarte</p>
          </div>
          
          <!-- Formulario de registro -->
          <form class="signup-form" [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            
            <!-- Campo de nombre -->
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Nombre completo</mat-label>
              <input matInput formControlName="nombre" type="text">
              <mat-icon matSuffix>person</mat-icon>
              @if (registerForm.get('nombre')?.hasError('required') && registerForm.get('nombre')?.touched) {
                <mat-error>El nombre es requerido</mat-error>
              }
            </mat-form-field>
            
            <!-- Campo de email -->
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Correo electrónico</mat-label>
              <input matInput formControlName="email" type="email">
              <mat-icon matSuffix>email</mat-icon>
              @if (registerForm.get('email')?.hasError('required') && registerForm.get('email')?.touched) {
                <mat-error>El correo electrónico es requerido</mat-error>
              }
              @if (registerForm.get('email')?.hasError('email') && registerForm.get('email')?.touched) {
                <mat-error>Ingrese un correo electrónico válido</mat-error>
              }
            </mat-form-field>
            
            <!-- Campo de contraseña -->
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Contraseña</mat-label>
              <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password">
              <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">
                <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
              </button>
              @if (registerForm.get('password')?.hasError('required') && registerForm.get('password')?.touched) {
                <mat-error>La contraseña es requerida</mat-error>
              }
              @if (registerForm.get('password')?.hasError('minlength') && registerForm.get('password')?.touched) {
                <mat-error>La contraseña debe tener al menos 8 caracteres</mat-error>
              }
            </mat-form-field>
            
            <!-- Campo de confirmación de contraseña -->
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Confirmar contraseña</mat-label>
              <input matInput [type]="hideConfirmPassword ? 'password' : 'text'" formControlName="confirmPassword">
              <button mat-icon-button matSuffix (click)="hideConfirmPassword = !hideConfirmPassword" type="button">
                <mat-icon>{{hideConfirmPassword ? 'visibility_off' : 'visibility'}}</mat-icon>
              </button>
              @if (registerForm.get('confirmPassword')?.hasError('required') && registerForm.get('confirmPassword')?.touched) {
                <mat-error>Confirme su contraseña</mat-error>
              }
              @if (registerForm.get('confirmPassword')?.hasError('passwordMismatch') && registerForm.get('confirmPassword')?.touched) {
                <mat-error>Las contraseñas no coinciden</mat-error>
              }
            </mat-form-field>
            
            <!-- Botón de registro -->
            <button mat-flat-button color="primary" 
                    class="signup-button" 
                    type="submit" 
                    [disabled]="registerForm.invalid">
              <span>Registrarse</span>
              <mat-icon>how_to_reg</mat-icon>
            </button>
          </form>
          
          <!-- Pie de página -->
          <div class="signup-footer">
            <p>¿Ya tienes una cuenta? <a routerLink="/authentication/signin" class="signin-link">Iniciar sesión</a></p>
          </div>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
      padding: 20px;
    }
    
    .signup-wrapper {
      width: 100%;
      max-width: 450px;
    }
    
    .signup-card {
      padding: 40px;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    }
    
    .signup-header {
      text-align: center;
      margin-bottom: 30px;
    }
    
    .logo-container {
      margin-bottom: 20px;
    }
    
    .logo-icon {
      font-size: 64px;
      height: 64px;
      width: 64px;
      color: #3f51b5;
    }
    
    .welcome-title {
      font-size: 24px;
      margin-bottom: 8px;
      color: #333;
    }
    
    .signup-subtitle {
      color: #666;
      margin-bottom: 0;
    }
    
    .signup-form {
      display: flex;
      flex-direction: column;
    }
    
    .form-field {
      margin-bottom: 16px;
    }
    
    .signup-button {
      margin-top: 16px;
      padding: 8px;
      font-size: 16px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    
    .signup-button span {
      margin-right: 8px;
    }
    
    .signup-footer {
      margin-top: 24px;
      text-align: center;
    }
    
    .signin-link {
      color: #3f51b5;
      text-decoration: none;
      font-weight: 500;
    }
    
    .signin-link:hover {
      text-decoration: underline;
    }
  `]
})
export class SignupComponent implements OnInit {
  registerForm!: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly registerService: RegisterService,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.initForm();
    
    // Verificar coincidencia de contraseñas cuando cambie el valor
    this.registerForm.get('confirmPassword')?.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.validatePasswordMatch();
    });
  }

  private initForm(): void {
    this.registerForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    });
  }

  private validatePasswordMatch(): void {
    const password = this.registerForm.get('password')?.value;
    const confirmPassword = this.registerForm.get('confirmPassword')?.value;
    
    if (password !== confirmPassword) {
      this.registerForm.get('confirmPassword')?.setErrors({ passwordMismatch: true });
    }
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      Swal.fire('Error', 'Por favor completa todos los campos correctamente', 'error');
      return;
    }

    const userData = {
      nombre: this.registerForm.get('nombre')?.value,
      email: this.registerForm.get('email')?.value,
      password: this.registerForm.get('password')?.value,
      rol_id: 2 // Por defecto, rol de usuario normal
    };

    this.registerService.registerUser(userData).subscribe({
      next: (response) => {
        Swal.fire({
          title: 'Registro exitoso',
          text: 'Tu cuenta ha sido creada. Ahora puedes iniciar sesión.',
          icon: 'success',
          confirmButtonText: 'Iniciar sesión'
        }).then(() => {
          this.router.navigate(['/authentication/signin']);
        });
      },
      error: (error) => {
        const errorMsg = error.error?.message || 'Error al registrar usuario';
        Swal.fire('Error', errorMsg, 'error');
      }
    });
  }
} 