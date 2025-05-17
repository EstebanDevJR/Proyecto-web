import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { URL_SERVICIOS } from '@core/models/config';
import * as jwt from "jwt-decode"; // Librería para decodificar tokens JWT
import { BehaviorSubject, Observable } from 'rxjs';
import { ROLES } from '@core/models/enums';
import { User } from '@core/models/user';

@Injectable({
  providedIn: 'root', // Proveído a nivel raíz (singleton)
})
export class AuthService {
  urlBaseServices: string = URL_SERVICIOS; // URL base de los servicios API

  // Propiedad pública para acceder al valor actual del usuario
  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  // Subject para manejar el estado del usuario actual
  private readonly currentUserSubject: BehaviorSubject<User>;
  // Observable público del usuario actual
  public currentUser: Observable<User>;

  constructor(
    private readonly http: HttpClient, // Cliente HTTP para llamadas API
    private readonly router: Router // Router para navegación
  ) {
    // Inicializa el BehaviorSubject con el usuario de sessionStorage
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(sessionStorage.getItem('currentUser') || '{}')
    );
    // Crea el observable público
    this.currentUser = this.currentUserSubject.asObservable();
  }

  /**
   * Método para iniciar sesión
   * @param email Correo electrónico del usuario
   * @param password Contraseña del usuario
   * @returns Observable con la respuesta del servidor
   */
  login(email: string, password: string): Observable<any> {
    const endpoint = `${this.urlBaseServices}/api/v1/auth/login`;
    return this.http.post<any>(endpoint, { email, password });
  }

  /**
   * Verifica si el usuario está autenticado
   * @returns boolean - true si existe token en sessionStorage
   */
  isAuthenticated(): boolean {
    const accessToken = sessionStorage.getItem('accessToken');
    return accessToken !== null;
  }

  /**
   * Obtiene y decodifica la información del token JWT
   * @returns Objeto con la información decodificada o undefined
   */
  getAuthFromSessionStorage(): any {
    try {
      const lsValue = sessionStorage.getItem('accessToken');
      if (!lsValue) return undefined;
      
      const decodedToken: any = jwt.jwtDecode(lsValue);
      return decodedToken;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  /**
   * Almacena el token en sessionStorage
   * @param token Token JWT
   */
  setToken(token: string): void {
    sessionStorage.setItem('token', token);
  }

  /**
   * Obtiene el token de sessionStorage
   * @returns Token JWT o null
   */
  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  /**
   * Verifica si el usuario logueado es administrador
   * @returns boolean - true si el rol es ADMIN
   */
  isAdminLogged(): boolean {
    const userInfo = this.getAuthFromSessionStorage();
    return userInfo?.rol_id === ROLES.ADMIN;
  }

  /**
   * Verifica si el usuario logueado es USER normal
   * @returns boolean - true si el rol es USER
   */
  isUserLogged(): boolean {
    const userInfo = this.getAuthFromSessionStorage();
    return userInfo?.rol_id === ROLES.USER;
  }

  /**
   * Obtiene el token de acceso de sessionStorage
   * @returns Token JWT o null
   */
  getTokenFromSessionStorage(): string | null {
    return sessionStorage.getItem('accessToken');
  } 

  /**
   * Cierra la sesión del usuario
   * - Elimina todos los tokens de sessionStorage
   * - Redirige a la página de login
   */
  logout(): void {
    // Eliminar todos los tokens almacenados
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('currentUser');
    
    // Resetear el BehaviorSubject
    this.currentUserSubject.next({} as User);
    
    // Redireccionar a la página de login
    this.router.navigate(['/authentication/signin'], {
      queryParams: {},
    });
  }
}