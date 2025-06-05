// Script para asignar usuarios a proyectos
const sequelize = require('./config/db');
const Project = require('./models/project.model');
const User = require('./models/user.model');
const UserProject = require('./models/userProject.model');
require('./models/associations');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

async function assignUsersToProjects() {
  try {
    // Conectar a la base de datos
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');

    // Obtener usuarios y proyectos
    const users = await User.findAll();
    const projects = await Project.findAll();

    if (users.length === 0 || projects.length === 0) {
      console.log('No hay usuarios o proyectos disponibles');
      process.exit(1);
    }

    console.log(`Usuarios disponibles: ${users.length}`);
    console.log(`Proyectos disponibles: ${projects.length}`);

    // Asignar usuarios a proyectos (ejemplo)
    for (const user of users) {
      for (const project of projects) {
        // Verificar si ya existe la asignación
        const existingAssignment = await UserProject.findOne({
          where: {
            usuario_id: user.id,
            proyecto_id: project.id
          }
        });

        if (!existingAssignment) {
          await UserProject.create({
            usuario_id: user.id,
            proyecto_id: project.id
          });
          
          console.log(`✅ Asignado: ${user.nombre} → ${project.nombre}`);
        } else {
          console.log(`⚠️  Ya existe: ${user.nombre} → ${project.nombre}`);
        }
      }
    }

    // Verificar las asignaciones
    console.log('\n🔍 Verificando asignaciones...');
    const projectsWithUsers = await Project.findAll({
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

    projectsWithUsers.forEach(project => {
      console.log(`\n📁 Proyecto: ${project.nombre}`);
      console.log(`   Admin: ${project.administrador?.nombre || 'Sin asignar'}`);
      console.log(`   Usuarios asignados: ${project.usuarios?.length || 0}`);
      project.usuarios?.forEach(user => {
        console.log(`     - ${user.nombre} (${user.email})`);
      });
    });

    console.log('\n🎉 Asignaciones completadas!');
    process.exit(0);
  } catch (error) {
    console.error('Error en asignaciones:', error);
    process.exit(1);
  }
}

// Ejecutar la función
assignUsersToProjects(); 