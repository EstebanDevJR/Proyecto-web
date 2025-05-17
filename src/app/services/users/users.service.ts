// Importa módulos necesarios para HTTP y programación reactiva
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
// Importa la URL base de los servicios desde la configuración
import { URL_SERVICIOS } from '@core/models/config';
import { Observable } from 'rxjs';

// Decorador que marca la clase como un servicio inyectable disponible en toda la app
@Injectable({
  providedIn: 'root'
})
export class UsersService {
  // Almacena la URL base para los endpoints de la API
  urlBaseServices: string = URL_SERVICIOS;

  // Constructor con inyección de dependencia del HttpClient
  constructor(private readonly http: HttpClient) { }

  /**
   * Crea un nuevo usuario
   * @param userData Datos del usuario a crear
   * @return Observable con la respuesta del servidor
   */
  createUser(userData: any): Observable<any> {
    const endpoint = `${this.urlBaseServices}/users/create`;
    return this.http.post<any>(endpoint, userData);
  }

  /**
   * Actualiza un usuario existente
   * @param userId ID del usuario a actualizar
   * @param userData Nuevos datos del usuario
   * @return Observable con la respuesta del servidor
   */
  updateUser(userId: number, userData: any): Observable<any> {
    const endpoint = `${this.urlBaseServices}/users/update/${userId}`;
    return this.http.put<any>(endpoint, userData);
  }

  /**
   * Elimina un usuario
   * @param userId ID del usuario a eliminar
   * @return Observable con la respuesta del servidor
   */
  deleteUser(userId: number): Observable<any> {
    const endpoint = `${this.urlBaseServices}/users/delete/${userId}`;
    return this.http.delete<any>(endpoint);
  }

  /**
   * Obtiene todos los usuarios filtrados por administrador
   * @param filters Objeto con filtros opcionales (nombre, email)
   * @return Observable con la lista de usuarios
   */
  getAllUserByAdministrator(filters?: any): Observable<any> {
    const endpoint = `${this.urlBaseServices}/users`;
    // Crea parámetros HTTP desde los filtros
    const params = new HttpParams({ 
      fromObject: {
        nombre: filters?.nombre || '', // Filtro por nombre (vacío si no existe)
        email: filters?.email || '' // Filtro por email (vacío si no existe)
      } 
    });
    return this.http.get<any>(endpoint, { params });
  }

  /**
   * Obtiene todos los usuarios con rol de administrador (rol ID = 1)
   * @return Observable con la lista de administradores
   */
  getAllAdministrator(): Observable<any> {
    const endpoint = `${this.urlBaseServices}/users/rol/1`;
    return this.http.get<any>(endpoint);
  }

  /**
   * Obtiene todos los usuarios con rol normal (rol ID = 2)
   * @return Observable con la lista de usuarios
   */
  getAllUsers(): Observable<any> {
    const endpoint = `${this.urlBaseServices}/users/rol/2`;
    return this.http.get<any>(endpoint);
  }
}