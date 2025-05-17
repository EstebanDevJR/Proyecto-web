// Importa el entorno de la aplicación
import { environment } from "environments/environment";

// Exporta URLs de servicios desde el entorno
export const URL_SERVICIOS = environment.urlServicios; // URL base para llamadas API

// Exporta tiempo de expiración de sesión (en milisegundos)
export const LOGOUT_TIMEOUT = environment.logoutTimeout; // Tiempo para logout automático