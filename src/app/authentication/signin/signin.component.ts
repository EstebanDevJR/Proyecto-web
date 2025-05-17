// Importaciones básicas de Angular
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

// Importaciones para formularios reactivos
import { 
  UntypedFormBuilder, // Constructor de formularios (sin tipo específico)
  UntypedFormGroup,   // Grupo de controles de formulario (sin tipo específico)
  Validators,         // Validadores predefinidos
  FormsModule,        // Para formularios template-driven
  ReactiveFormsModule // Para formularios reactivos
} from '@angular/forms';

// Importación del servicio de autenticación personalizado
import { AuthService } from '@core';

// Importaciones de Angular Material para UI
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';

// Importación de SweetAlert2 para notificaciones bonitas
import Swal from 'sweetalert2';

// Decorador @Component que define la configuración del componente
@Component({
  selector: 'app-signin', // Selector para usar en templates
  templateUrl: './signin.component.html', // Ruta al template HTML
  styleUrls: ['./signin.component.scss'], // Ruta a los estilos SCSS
  standalone: true, // Indica que es un componente standalone (Angular 14+)
  imports: [ // Módulos importados directamente
    FormsModule, // Para soporte de formularios template-driven
    ReactiveFormsModule, // Para formularios reactivos
    MatFormFieldModule, // Para campos de formulario de Material
    MatInputModule, // Para inputs de Material
    MatIconModule, // Para íconos de Material
    MatButtonModule, // Para botones de Material
    MatCardModule,
    RouterModule, // Para usar routerLink en la plantilla
  ],
})
export class SigninComponent implements OnInit {
  // Grupo de formulario para autenticación
  authForm!: UntypedFormGroup;
  
  // Estado del formulario
  submitted = false; // Indica si se ha enviado el formulario
  loading = false; // Indica si está en proceso de carga
  error = ''; // Mensaje de error
  hide = true; // Controla la visibilidad de la contraseña

  // Variables para credenciales (¿redundantes con el formulario?)
  email = '';
  password = '';

  // Constructor con inyección de dependencias
  constructor(
    private readonly formBuilder: UntypedFormBuilder, // Para construir formularios
    private readonly router: Router, // Para navegación
    private readonly authService: AuthService, // Servicio de autenticación
  ) { }

  /**
   * Inicialización del componente
   * Configura el formulario reactivo con validaciones
   */
  ngOnInit() {
    this.authForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]], // Campo de email con validación
      password: ['', Validators.required], // Campo requerido
    });
  }

  /**
   * Getter para acceder fácilmente a los controles del formulario
   * @returns Los controles del formulario
   */
  get f() {
    return this.authForm.controls;
  }

  /**
   * Maneja el envío del formulario de inicio de sesión
   */
  onSubmit() {
    this.submitted = true; // Marca el formulario como enviado
    this.error = ''; // Reinicia los mensajes de error

    // Valida el formulario
    if (this.authForm.invalid) {
      Swal.fire('Error', 'Email y contraseña no válidos.', 'error');
      return;
    }

    // Llama al servicio de autenticación
    this.authService
      .login(
        this.authForm.get('email')?.value, 
        this.authForm.get('password')?.value
      )
      .subscribe({
        next: (res) => {
          // Manejo de respuesta exitosa
          if (res?.token) {
            // Almacena el token en sessionStorage
            sessionStorage.setItem('accessToken', res.token);
            console.log('Token recibido:', res.token);
            
            // Establece el token en el servicio de autenticación
            this.authService.setToken(res.token);

            // Muestra notificación de éxito
            Swal.fire({
              title: 'Inicio de sesión exitoso',
              text: 'Redirigiendo al dashboard...',
              icon: 'success',
              timer: 2000, // Cierra automáticamente después de 2 segundos
              showConfirmButton: false // Oculta el botón de confirmación
            }).then(() => {
              // Redirige al dashboard después de cerrar la notificación
              this.router.navigate(['/dashboard/main']);
            });
          } else {
            // Credenciales incorrectas
            Swal.fire('Error', 'Credenciales incorrectas.', 'error');
          }
        },
        error: (error) => {
          // Manejo de errores
          this.submitted = false;
          this.loading = false;
          
          // Muestra el mensaje de error del servidor o uno genérico
          Swal.fire(
            'Error en el inicio de sesión', 
            error.error?.message || 'Error desconocido', 
            'error'
          );
        }
      });
  }
}