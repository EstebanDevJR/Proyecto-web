// Importación de dependencias necesarias
const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');
const User = require('./user.model');

// Definición del modelo Project (Proyecto)
const Project = sequelize.define('projects', {
    // ID del proyecto: entero, clave primaria, autoincremental
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    // Nombre del proyecto: texto, no puede ser nulo
    nombre: {type: DataTypes.STRING, allowNull: false},
    // Descripción del proyecto: texto, no puede ser nulo
    descripcion: {type: DataTypes.STRING, allowNull: false},
    // Fecha de creación: fecha y hora, no puede ser nulo, valor por defecto es la fecha actual
    fecha_creacion: {
        type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW
    },
    // ID del administrador: referencia al modelo User
    administrador_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    }
},{
    // Configuraciones adicionales del modelo
    timestamps: false,  // Desactiva los campos createdAt y updatedAt
    tableName: 'proyectos',  // Nombre de la tabla en la base de datos
    hooks: {
        // Hook que se ejecuta después de crear un proyecto
        afterCreate: (project, options) => {
            // Ajusta la hora para la zona horaria local (-5 horas)
            if(project.fecha_creacion){
                project.fecha_creacion.setHours(project.fecha_creacion.getHours() - 5);
            }
        }
    }
});

// Exportación del modelo
module.exports = Project;