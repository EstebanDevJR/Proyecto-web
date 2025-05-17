// Importación de dependencias necesarias
const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');

// Definición del modelo RolePermission (tabla intermedia entre roles y permisos)
const RolePermission = sequelize.define('role_permissions', {
    // ID del rol: entero, no puede ser nulo, referencia a la tabla roles
    rol_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'roles', key: 'id' } },
    // ID del permiso: entero, no puede ser nulo, referencia a la tabla permissions
    permission_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'permissions', key: 'id' } }
}, {
    // Configuraciones adicionales del modelo
    timestamps: false,  // Desactiva los campos createdAt y updatedAt
    tableName: 'roles_permisos',  // Nombre de la tabla en la base de datos
});

// Exportación del modelo
module.exports = RolePermission;