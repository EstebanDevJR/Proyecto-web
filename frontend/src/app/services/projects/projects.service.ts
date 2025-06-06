// Importa el decorador Injectable desde el núcleo de Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { 
  Project, 
  CreateProject, 
  UpdateProject, 
  ProjectResponse, 
  AssignUsersToProject,
  User 
} from '../../core/models/project.interface';

// Decorador Injectable: marca la clase como un servicio inyectable
// 'providedIn: root' lo registra como un singleton global (disponible en toda la app)
@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private readonly API_URL = `${environment.urlServicios}/api/v1`;

  // Constructor del servicio con HttpClient inyectado
  constructor(private http: HttpClient) { }

  /**
   * Obtiene todos los proyectos
   * @returns Observable con la lista de proyectos
   */
  getAllProjects(): Observable<ProjectResponse> {
    return this.http.get<ProjectResponse>(`${this.API_URL}/projects`);
  }

  /**
   * Obtiene un proyecto por ID
   * @param id ID del proyecto
   * @returns Observable con el proyecto encontrado
   */
  getProjectById(id: number): Observable<ProjectResponse> {
    return this.http.get<ProjectResponse>(`${this.API_URL}/projects/${id}`);
  }

  /**
   * Obtiene proyectos por ID de usuario
   * @param userId ID del usuario
   * @returns Observable con los proyectos del usuario
   */
  getProjectsByUserId(userId: number): Observable<ProjectResponse> {
    return this.http.get<ProjectResponse>(`${this.API_URL}/projects/rol/${userId}`);
  }

  /**
   * Crea un nuevo proyecto
   * @param project Datos del proyecto a crear
   * @returns Observable con el proyecto creado
   */
  createProject(project: CreateProject): Observable<ProjectResponse> {
    return this.http.post<ProjectResponse>(`${this.API_URL}/projects/create`, { data: project });
  }

  /**
   * Actualiza un proyecto existente
   * @param id ID del proyecto a actualizar
   * @param project Datos del proyecto a actualizar
   * @returns Observable con el proyecto actualizado
   */
  updateProject(id: number, project: Partial<UpdateProject>): Observable<ProjectResponse> {
    return this.http.put<ProjectResponse>(`${this.API_URL}/projects/update/${id}`, { data: project });
  }

  /**
   * Elimina un proyecto
   * @param id ID del proyecto a eliminar
   * @returns Observable con la respuesta de eliminación
   */
  deleteProject(id: number): Observable<ProjectResponse> {
    return this.http.delete<ProjectResponse>(`${this.API_URL}/projects/delete/${id}`);
  }

  /**
   * Asigna usuarios a un proyecto
   * @param assignData Datos de asignación (projectId y userIds)
   * @returns Observable con el proyecto actualizado
   */
  assignUsersToProject(assignData: AssignUsersToProject): Observable<ProjectResponse> {
    return this.http.post<ProjectResponse>(
      `${this.API_URL}/projects/assign/${assignData.projectId}`, 
      { userIds: assignData.userIds }
    );
  }

  /**
   * Remueve un usuario de un proyecto
   * @param projectId ID del proyecto
   * @param userId ID del usuario a remover
   * @returns Observable con la respuesta
   */
  removeUserFromProject(projectId: number, userId: number): Observable<ProjectResponse> {
    return this.http.delete<ProjectResponse>(
      `${this.API_URL}/projects/unassign/${projectId}`, 
      { body: { userId } }
    );
  }
}