// Importa el servicio de autenticación
import { AuthService } from '../service/auth.service';
// Importa el decorador Injectable de Angular
import { Injectable } from '@angular/core';
// Importa clases HTTP para interceptar peticiones
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
// Importa utilidades de RxJS para manejar observables
import { Observable, throwError } from 'rxjs';
// Importa operador catchError de RxJS
import { catchError } from 'rxjs/operators';

// Decorador que marca la clase como inyectable
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  // Constructor con inyección del servicio de autenticación
  constructor(private authenticationService: AuthService) {}

  // Método intercept que implementa HttpInterceptor
  intercept(
    request: HttpRequest<any>, // La petición HTTP entrante
    next: HttpHandler // Maneja la petición y devuelve un observable
  ): Observable<HttpEvent<any>> {
    // Intercepta la petición y maneja posibles errores
    return next.handle(request).pipe(
      // Operador para capturar errores
      catchError((err) => {
        // Si el error es 401 (no autorizado)
        if (err.status === 401) {
          // Cierra sesión automáticamente
          this.authenticationService.logout();
          // Recarga la página
          location.reload();
        }

        // Obtiene el mensaje de error o el texto del estado HTTP
        const error = err.error.message || err.statusText;
        // Devuelve el error como observable
        return throwError(error);
      })
    );
  }
}