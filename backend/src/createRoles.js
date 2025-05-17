// Script para crear roles en la base de datos
const sequelize = require('./config/db');
const { DataTypes } = require('sequelize');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

// Definición del modelo Role directamente en este script
const Role = sequelize.define('roles', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING, allowNull: false },
}, {
    timestamps: false,
    tableName: 'roles',
});

// Datos de los roles a crear
const rolesToCreate = [
    { id: 1, nombre: 'ADMIN' },
    { id: 2, nombre: 'USER' }
];

async function createRoles() {
    try {
        // Conectar a la base de datos
        await sequelize.authenticate();
        console.log('Conexión a la base de datos establecida correctamente.');

        // Sincronizar el modelo con la base de datos (sin forzar, para no borrar datos existentes)
        await sequelize.sync({ force: false });

        // Crear roles
        for (const roleData of rolesToCreate) {
            // Verificar si el rol ya existe
            const existingRole = await Role.findOne({ where: { id: roleData.id } });
            
            if (existingRole) {
                console.log(`El rol ${roleData.nombre} ya existe.`);
            } else {
                await Role.create(roleData);
                console.log(`Rol ${roleData.nombre} creado con éxito.`);
            }
        }

        console.log('Proceso de creación de roles completado.');
        process.exit(0);
    } catch (error) {
        console.error('Error al crear roles:', error);
        process.exit(1);
    }
}

// Ejecutar la función
createRoles(); 