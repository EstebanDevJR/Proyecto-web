// Importar Sequelize
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const path = require('path');

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Crear una nueva instancia de Sequelize con la configuración de la base de datos
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: parseInt(process.env.DB_PORT),
    logging: false,
    timezone: '-05:00'  // Configuración de zona horaria para Colombia/Ecuador
});

// Exportar la instancia de Sequelize
module.exports = sequelize;