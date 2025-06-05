// Importación de los modelos necesarios
const User = require('./user.model');
const Project = require('./project.model');
const UserProject = require('./userProject.model');

// Definición de la relación muchos a muchos entre Usuario y Proyecto
User.belongsToMany(Project, {
    through: UserProject,
    foreignKey: 'usuario_id',
    otherKey: 'proyecto_id',
    as: 'proyectos'
});

Project.belongsToMany(User, {
    through: UserProject,
    foreignKey: 'proyecto_id',
    otherKey: 'usuario_id',
    as: 'usuarios'
});

// Relación adicional: Un proyecto pertenece a un administrador (que es un usuario)
Project.belongsTo(User, {
    foreignKey: 'administrador_id',
    as: 'administrador'
});

// Exportación de los modelos con sus asociaciones
module.exports = { User, Project, UserProject };