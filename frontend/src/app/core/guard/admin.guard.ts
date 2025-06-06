// Importaciones necesarias de Angular
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '@core'; // Servicio de autenticación personalizado
import { Observable } from 'rxjs'; // Para manejar observables

// Decorador que marca la clase como un servicio inyectable disponible en toda la app
@Injectable({
    providedIn: 'root' // Singleton a nivel de aplicación
})
export class AdminGuard implements CanActivate { // Implementa la interfaz CanActivate para protección de rutas

    // Constructor con inyección de dependencias
    constructor(
        private readonly _authService: AuthService, // Servicio para manejar autenticación
        private readonly _router: Router // Router para navegación
    ) {}

    // Método requerido por CanActivate para determinar si se permite el acceso
    canActivate(
        next: ActivatedRouteSnapshot, // Snapshot de la ruta solicitada
        state: RouterStateSnapshot // Snapshot del estado del router
    ): Observable<boolean> | Promise<boolean> | boolean { // Puede devolver diferentes tipos de valores booleanos
        
        // Obtiene los datos del usuario desde el sessionStorage
        const userSession = this._authService.getAuthFromSessionStorage();
        console.log(userSession); // Log para depuración (quitar en producción)
        
        // Verifica si existe sesión y si el usuario tiene rol de administrador (rol_id = 1)
        if (userSession && userSession.rol_id === 1) {
            return true; // Permite el acceso a la ruta
        } else {
            // Redirige a la página 404 si no cumple los requisitos
            this._router.navigate(['/authentication/page404']);
            return false; // Deniega el acceso
        }
    }
}