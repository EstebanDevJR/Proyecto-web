// Interfaz base para un proyecto
export interface Project {
  id: number;
  nombre: string;
  descripcion: string;
  fecha_creacion: string;
  administrador_id: number;
  administrador?: User;
  usuarios?: User[];
}

// Interfaz para crear un nuevo proyecto
export interface CreateProject {
  nombre: string;
  descripcion: string;
  administrador_id: number;
}

// Interfaz para actualizar un proyecto
export interface UpdateProject {
  id: number;
  nombre?: string;
  descripcion?: string;
  administrador_id?: number;
}

// Interfaz para respuesta del servidor
export interface ProjectResponse {
  message: string;
  proyecto?: Project;
  proyectos?: Project[];
}

// Interfaz para asignar usuarios a proyecto
export interface AssignUsersToProject {
  projectId: number;
  userIds: number[];
}

// Interfaz para el rol en proyecto
export interface UserProjectRole {
  id: number;
  user_id: number;
  proyecto_id: number;
  rol: 'miembro' | 'lider';
  fecha_asignacion: string;
}

// Interfaz de usuario simplificada
export interface User {
  id: number;
  nombre: string;
  email: string;
  rol_id?: number;
} 