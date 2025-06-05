// Script para crear proyectos de prueba
const sequelize = require('./config/db');
const Project = require('./models/project.model');
const User = require('./models/user.model');
require('./models/associations');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

// Datos de proyectos de prueba
const testProjects = [
  {
    nombre: 'Sistema de Gestión Web',
    descripcion: 'Desarrollo de un sistema web para gestión empresarial con módulos de usuarios, proyectos y reportes.',
    administrador_id: 1
  },
  {
    nombre: 'App Mobile de Ventas',
    descripcion: 'Aplicación móvil para gestión de ventas con integración a sistemas ERP existentes.',
    administrador_id: 1
  },
  {
    nombre: 'Dashboard Analytics',
    descripcion: 'Panel de control con métricas y análisis de datos en tiempo real para toma de decisiones.',
    administrador_id: 1
  }
];

async function createTestProjects() {
  try {
    // Conectar a la base de datos
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');

    // Verificar que existe el administrador
    const admin = await User.findByPk(1);
    if (!admin) {
      console.log('No se encontró usuario administrador. Ejecute primero createAdminUser.js');
      process.exit(1);
    }

    // Verificar si ya existen proyectos
    const existingProjects = await Project.findAll();
    if (existingProjects.length > 0) {
      console.log('Ya existen proyectos en la base de datos:');
      existingProjects.forEach(project => {
        console.log(`- ${project.nombre}`);
      });
      process.exit(0);
    }

    // Crear proyectos de prueba
    console.log('Creando proyectos de prueba...');
    
    for (const projectData of testProjects) {
      const project = await Project.create(projectData);
      console.log(`✅ Proyecto creado: ${project.nombre} (ID: ${project.id})`);
    }

    console.log('\n🎉 Proyectos de prueba creados exitosamente!');
    console.log('\nPuedes iniciar sesión con:');
    console.log('Email: admin@example.com');
    console.log('Contraseña: admin123');

    process.exit(0);
  } catch (error) {
    console.error('Error al crear proyectos de prueba:', error);
    process.exit(1);
  }
}

// Ejecutar la función
createTestProjects(); 