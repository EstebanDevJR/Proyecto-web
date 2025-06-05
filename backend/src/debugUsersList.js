// Script para debuggear la lista de usuarios y sus relaciones
const sequelize = require('./config/db');
const User = require('./models/user.model');
const userService = require('./services/user.service');

async function debugUsersList() {
  try {
    // Conectar a la base de datos
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente.\n');

    // Obtener TODOS los usuarios
    console.log('📋 TODOS LOS USUARIOS EN LA BASE DE DATOS:');
    console.log('='.repeat(60));
    const allUsers = await User.findAll({
      attributes: ['id', 'nombre', 'email', 'rol_id', 'administrador_id'],
      order: [['id', 'ASC']]
    });

    allUsers.forEach(user => {
      const roleName = user.rol_id === 1 ? 'Administrador' : 'Usuario';
      const adminInfo = user.administrador_id ? `Admin responsable: ${user.administrador_id}` : 'Sin admin responsable';
      console.log(`ID: ${user.id} | ${user.nombre} (${user.email}) | ${roleName} | ${adminInfo}`);
    });

    // Obtener solo administradores
    console.log('\n👑 ADMINISTRADORES:');
    console.log('='.repeat(40));
    const admins = allUsers.filter(user => user.rol_id === 1);
    admins.forEach(admin => {
      const adminInfo = admin.administrador_id ? `Creado por admin ${admin.administrador_id}` : 'Sin admin responsable';
      console.log(`Admin ID: ${admin.id} | ${admin.nombre} | ${adminInfo}`);
    });

    // Para cada administrador, mostrar qué usuarios puede ver
    console.log('\n🔍 QUÉ VE CADA ADMINISTRADOR:');
    console.log('='.repeat(50));
    
    for (const admin of admins) {
      console.log(`\n📊 Administrador "${admin.nombre}" (ID: ${admin.id}) ve:`);
      try {
        const usersVisibleToAdmin = await userService.getAllUsersByAdministadorId(admin.id);
        if (usersVisibleToAdmin.length === 0) {
          console.log('  ❌ No ve ningún usuario');
        } else {
          usersVisibleToAdmin.forEach(user => {
            const roleName = user.rol_id === 1 ? 'Administrador' : 'Usuario';
            console.log(`  ✅ ${user.nombre} (${user.email}) - ${roleName}`);
          });
        }
      } catch (error) {
        console.log(`  ❌ Error al consultar: ${error.message}`);
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ Debug completado');
    
  } catch (error) {
    console.error('❌ Error en el debug:', error.message);
  } finally {
    await sequelize.close();
  }
}

// Ejecutar el debug
debugUsersList(); 