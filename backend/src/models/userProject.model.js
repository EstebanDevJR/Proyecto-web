// Importación de dependencias necesarias
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./user.model');
const Project = require('./project.model');

// Definición del modelo UserProject (tabla intermedia entre usuarios y proyectos)
const UserProject = sequelize.define('user_projects', {
    // ID: entero, clave primaria, autoincremental
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    // ID del usuario: entero, no puede ser nulo, referencia a la tabla usuarios
    usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    // ID del proyecto: entero, no puede ser nulo, referencia a la tabla proyectos
    proyecto_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Project,
            key: 'id'
        }
    }
    // Comentado: campos que no existen en la tabla real
    // rol: {
    //     type: DataTypes.ENUM('miembro', 'lider'),
    //     allowNull: false,
    //     defaultValue: 'miembro'
    // },
    // fecha_asignacion: {
    //     type: DataTypes.DATE,
    //     allowNull: false,
    //     defaultValue: DataTypes.NOW
    // }
}, {
    // Configuraciones adicionales del modelo
    timestamps: false,  // Desactiva los campos createdAt y updatedAt
    tableName: 'usuarios_proyectos'  // Nombre de la tabla en la base de datos
});

// Exportación del modelo
module.exports = UserProject;