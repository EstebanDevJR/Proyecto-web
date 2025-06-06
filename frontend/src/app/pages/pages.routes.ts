// Importaciones necesarias para el sistema de rutas
import { Route } from "@angular/router";
import { UsersComponent } from "./users/users.component";
import { ProjectsComponent } from "./projects/projects.component";
import { MyProjectsComponent } from "./my-projects/my-projects.component";
import { AdminGuard } from "@core/guard/admin.guard";
import { AuthGuard } from "@core/guard/auth.guard";

export const PAGES_ROUTE: Route[] = [
    {
        path: "users", // Ruta para gestión de usuarios
        component: UsersComponent, // Componente asociado
        canActivate: [AdminGuard] // Solo accesible para administradores
    },
    {
        path: "projects", // Ruta para gestión de proyectos (solo admin)
        component: ProjectsComponent, // Componente asociado
        canActivate: [AdminGuard] // Solo accesible para administradores
    },
    {
        path: "my-projects", // Ruta para ver mis proyectos (usuarios normales)
        component: MyProjectsComponent, // Componente asociado
        canActivate: [AuthGuard] // Accesible para usuarios autenticados
    },
];