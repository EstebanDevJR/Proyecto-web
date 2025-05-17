// Importación de dependencias necesarias
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// Definición del modelo User (Usuario)
const User = sequelize.define('usuarios', {
    // ID del usuario: entero, clave primaria, autoincremental
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    // Nombre del usuario: texto, no puede ser nulo
    nombre: {type: DataTypes.STRING, allowNull: false},
    // Email del usuario: texto, no puede ser nulo
    email: {type: DataTypes.STRING, allowNull: false},
    // Contraseña: texto, no puede ser nulo, debe ser único
    password: {type: DataTypes.STRING, allowNull: false, unique: true},
    // ID del rol: entero, no puede ser nulo, referencia a la tabla roles
    rol_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'roles',
            key: 'id'
        }
    },
    // ID del administrador: entero, no puede ser nulo, referencia a la misma tabla usuarios
    administrador_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'usuarios',
            key: 'id'
        }
    }
}, {
    timestamps: false,  // Desactiva los campos createdAt y updatedAt
    tableName: 'usuarios'  // Nombre de la tabla en la base de datos
});

// Exportación del modelo
module.exports = User;