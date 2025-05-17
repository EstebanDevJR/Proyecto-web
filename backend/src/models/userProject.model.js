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
    user_id: {
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
    },
    // Rol del usuario en el proyecto: puede ser 'miembro' o 'lider'
    rol: {
        type: DataTypes.ENUM('miembro', 'lider'),
        allowNull: false,
        defaultValue: 'miembro'
    },
    // Fecha de asignación al proyecto: fecha y hora, no puede ser nulo
    fecha_asignacion: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    // Configuraciones adicionales del modelo
    timestamps: false,  // Desactiva los campos createdAt y updatedAt
    tableName: 'usuarios_proyectos',  // Nombre de la tabla en la base de datos
    hooks: {
        // Hook que se ejecuta después de crear una asignación
        afterCreate: (userProject, options) => {
            // Ajusta la hora para la zona horaria local (-5 horas)
            if(userProject.fecha_asignacion) {
                userProject.fecha_asignacion.setHours(userProject.fecha_asignacion.getHours() - 5);
            }
        }
    }
});

// Exportación del modelo
module.exports = UserProject;