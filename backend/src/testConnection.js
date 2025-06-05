// Script para probar la conexión a la base de datos
const sequelize = require('./config/db');
const Project = require('./models/project.model');
const User = require('./models/user.model');
require('./models/associations');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

async function testConnection() {
  try {
    console.log('🔌 Probando conexión a la base de datos...');
    
    // Probar autenticación
    await sequelize.authenticate();
    console.log('✅ Conexión a PostgreSQL establecida correctamente.');

    // Verificar usuarios
    const users = await User.findAll();
    console.log(`👥 Usuarios encontrados: ${users.length}`);
    
    if (users.length > 0) {
      users.forEach(user => {
        console.log(`   - ${user.nombre} (${user.email}) - Rol: ${user.rol_id}`);
      });
    }

    // Verificar proyectos
    const projects = await Project.findAll({
      include: [
        {
          model: User,
          as: 'administrador',
          attributes: ['id', 'nombre']
        }
      ]
    });
    
    console.log(`📋 Proyectos encontrados: ${projects.length}`);
    
    if (projects.length > 0) {
      projects.forEach(project => {
        console.log(`   - ${project.nombre} (Admin: ${project.administrador?.nombre || 'Sin asignar'})`);
      });
    } else {
      console.log('⚠️  No hay proyectos en la base de datos.');
      console.log('💡 Ejecuta "node src/createTestProjects.js" para crear proyectos de prueba.');
    }

    console.log('\n🎯 Estado de la conexión: OK');
    
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    console.error('\n🔧 Verifica:');
    console.error('1. PostgreSQL está ejecutándose');
    console.error('2. Las credenciales en el archivo .env son correctas');
    console.error('3. La base de datos existe');
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

// Ejecutar la función
testConnection(); 