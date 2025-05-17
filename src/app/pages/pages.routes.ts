// Importaciones necesarias para el sistema de rutas
import { Route } from "@angular/router";
import { UsersComponent } from "./users/users.component";
import { ProjectsComponent } from "./projects/projects.component";
import { AdminGuard } from "@core/guard/admin.guard";

export const PAGES_ROUTE: Route[] = [
    {
        path: "users", // Ruta para gestión de usuarios
        component: UsersComponent, // Componente asociado
        canActivate: [AdminGuard] // Solo accesible para administradores
    },
    {
        path: "projects", // Ruta para gestión de proyectos
        component: ProjectsComponent, // Componente asociado
        // Ruta pública (sin guard)
    },
];