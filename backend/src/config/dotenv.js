// Importar el paquete dotenv para manejar variables de entorno
const dotenv = require('dotenv');

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

// Exportar objeto de configuración con las variables de entorno
module.exports = {
    PORT: process.env.PORT,            // Puerto del servidor
    DB_NAME: process.env.DB_NAME,      // Nombre de la base de datos
    DB_USER: process.env.DB_USER,      // Usuario de la base de datos
    DB_PASSWORD: process.env.DB_PASSWORD, // Contraseña de la base de datos
    DB_HOST: process.env.DB_HOST,      // Host de la base de datos
    DB_PORT: process.env.DB_PORT,      // Puerto de la base de datos
    JWT_SECRET: process.env.JWT_SECRET // Clave secreta para tokens JWT
}