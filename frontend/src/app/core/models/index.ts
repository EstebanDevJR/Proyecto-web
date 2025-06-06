// Archivo de índice para exportar todos los modelos e interfaces

// Interfaces de proyectos (incluye User para proyectos)
export * from './project.interface';

// Clase User para autenticación (renombrada para evitar conflicto)
export { User as AuthUser } from './user';

// Enumeraciones
export * from './enums';

// Configuraciones
export * from './config';
export * from './config.interface'; 