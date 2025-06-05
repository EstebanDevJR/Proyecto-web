const { where } = require('sequelize');
const Project = require('../models/project.model');
const User = require('../models/user.model');
const ROLES = require('../utils/constants');

exports.createProject = async (data) => {
            try{
                const newProject = await Project.create({
                    nombre: data.nombre,
                    descripcion: data.descripcion,
                    administrador_id: data.administrador_id
                });
                return newProject;
            }catch (err) {
                throw new Error(`Error al crear proyecto: ${err.message}`);
            }
};

exports.updateProject = async (id, data) => {
    const project = await Project.findByPk(id);
    if (!project) throw new Error('Proyecto no encontrado');

    await project.update({
        nombre: data.nombre,
        descripcion: data.descripcion,
        administrador_id: data.administrador_id
    });
    return project;
};

exports.deleteProject = async (id) => {
    const project = await Project.findByPk(id);
    if (!project) throw new Error('Proyecto no encontrado');

    await project.destroy();
    return { message: 'Proyecto eliminado correctamente' };
};

exports.getProject = async (id) => {
    const project = await Project.findByPk(id, {
        include: [
            {
                model: User,
                as: 'administrador',
                attributes: ['id', 'nombre']
            },
            {
                model: User,
                as: 'usuarios',
                attributes: ['id', 'nombre', 'email'],
                through: { attributes: [] }
            }
        ]
    });

    if (!project) throw new Error('Proyecto no encontrado');
    return project;
};

exports.getAllProjects = async () => {
    try {
        const projects = await Project.findAll({
            include: [
                {
                    model: User,
                    as: 'administrador',
                    attributes: ['id', 'nombre']
                },
                {
                    model: User,
                    as: 'usuarios',
                    attributes: ['id', 'nombre', 'email'],
                    through: { attributes: [] }
                }
            ]
        });

        return projects;
    } catch (err) {
        throw new Error(`Error al obtener los proyectos: ${err.message}`);
    }
};

exports.getProjectsByUserId = async (userId) => { 
    try {
        const projects = await Project.findAll({
            include: [
                {
                    model: User,
                    as: 'administrador',
                    attributes: ['id', 'nombre']
                },
                {
                    model: User,
                    as: 'usuarios',
                    where: { id: userId },
                    attributes: [],
                    through: { attributes: [] }
                }
            ]
        });

        // Ahora obtenemos todos los datos completos de cada proyecto
        const projectsWithAllUsers = await Promise.all(
            projects.map(async (project) => {
                const fullProject = await Project.findByPk(project.id, {
                    include: [
                        {
                            model: User,
                            as: 'administrador',
                            attributes: ['id', 'nombre']
                        },
                        {
                            model: User,
                            as: 'usuarios',
                            attributes: ['id', 'nombre', 'email'],
                            through: { attributes: [] }
                        }
                    ]
                });
                return fullProject;
            })
        );

        return projectsWithAllUsers;
    } catch (err) {
        throw new Error(`Error al obtener los proyectos del usuario: ${err.message}`);
    }
};

exports.assignUsersToProject = async (data) => {
    const project = await Project.findByPk(data.projectId);
    if (!project) throw new Error('Proyecto no encontrado');

    const users = await User.findAll({ where: { id: data.userIds } });
    if (users.length !== data.userIds.length) throw new Error('Algunos usuarios no fueron encontrados');

    await project.addUsuarios(users);
    return await Project.findByPk(data.projectId, {
        include: [
            {
                model: User,
                as: 'administrador',
                attributes: ['id', 'nombre']
            },
            {
                model: User,
                as: 'usuarios',
                attributes: ['id', 'nombre', 'email'],
                through: { attributes: [] }
            }
        ]
    });
};

exports.removeUserFromProject = async (data) => {
    const project = await Project.findByPk(data.projectId);
    if (!project) throw new Error('Proyecto no encontrado');

    const user = await User.findByPk(data.userId);
    if (!user) throw new Error('Usuario no encontrado');

    await project.removeUsuario(user);
};