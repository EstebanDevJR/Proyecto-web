// Modelo de datos de usuario
export class User {
    id!: number;          // Identificador único
    username!: string;    // Nombre de usuario/login
    password!: string;    // Contraseña (debería ser temporal)
    firsName!: string;    // Nombre (typo: debería ser firstName)
    lastName!: string;   // Apellido
    token!: string;      // Token de autenticación JWT
}