// Importa el decorador Injectable desde el núcleo de Angular
import { Injectable } from '@angular/core';

// Decorador Injectable: marca la clase como un servicio inyectable
// 'providedIn: root' lo registra como un singleton global (disponible en toda la app)
@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  // Constructor del servicio (vacío por defecto, listo para añadir dependencias o lógica)
  constructor() { }
  // Aquí irían métodos relacionados con proyectos (ej: getProjects(), addProject(), etc.)
}