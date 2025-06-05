// Importa el decorador Injectable para crear servicios
import { Injectable } from '@angular/core';
// Importa clases necesarias para interceptar peticiones HTTP
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
// Importa Observable para manejar flujos de datos asíncronos
import { Observable } from 'rxjs';
// Importa el servicio de autenticación
import { AuthService } from '../service/auth.service';

// Decorador que marca la clase como servicio inyectable
@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  // Constructor que inyecta el servicio de autenticación
  constructor(private readonly authenticationService: AuthService) {}

  // Método para interceptar peticiones HTTP
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Obtiene el token JWT del sessionStorage
    const token = sessionStorage.getItem('accessToken');

    console.log('🔌 Interceptor JWT - URL:', req.url);
    console.log('🔑 Interceptor JWT - Token presente:', !!token);

    // Si existe un token, clona la petición y añade el header Authorization
    if (token) {
      console.log('🔑 Interceptor JWT - Agregando token al header');
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`  // Añade el token al header
        }
      });
      console.log('📤 Interceptor JWT - Headers:', req.headers.keys());
    } else {
      console.log('⚠️ Interceptor JWT - No hay token disponible');
    }

    // Pasa la petición (modificada o no) al siguiente handler
    return next.handle(req);
  }
}