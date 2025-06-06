import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthService } from '../service/auth.service';

// Guard de autenticación para rutas protegidas
@Injectable({ providedIn: 'root' })
export class AuthGuard {
  
  constructor(
    private readonly authService: AuthService  // Servicio de autenticación
  ) {}

  // Método que determina si el usuario puede acceder
  canActivate(
    route: ActivatedRouteSnapshot,  // Ruta actual
    state: RouterStateSnapshot     // Estado del router
  ): boolean {
    
    // Verifica si el usuario está autenticado
    const currentUser = this.authService.isAuthenticated();
    
    // Si está autenticado, permite el acceso
    if (currentUser) return true;
    
    // Si no está autenticado:
    this.authService.logout();      // Limpia la sesión
    return false;                  // Deniega el acceso
  }
}