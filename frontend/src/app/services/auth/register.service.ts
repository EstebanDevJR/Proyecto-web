import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '@core/models/config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  // URL base para los endpoints de la API
  urlBaseServices: string = URL_SERVICIOS;

  constructor(private readonly http: HttpClient) { }

  /**
   * Registra un nuevo usuario (acceso público, sin autenticación)
   * @param userData Datos del usuario a registrar
   * @return Observable con la respuesta del servidor
   */
  registerUser(userData: any): Observable<any> {
    const endpoint = `${this.urlBaseServices}/api/v1/auth/register`;
    return this.http.post<any>(endpoint, userData);
  }
} 