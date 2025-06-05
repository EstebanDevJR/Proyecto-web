// Script rápido para debuggear visibilidad de usuarios
const sequelize = require('./config/db');
const User = require('./models/user.model');
const userService = require('./services/user.service');

async function quickDebug() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado a la base de datos\n');

    // Obtener todos los usuarios
    const allUsers = await User.findAll({
      attributes: ['id', 'nombre', 'email', 'rol_id', 'administrador_id'],
      order: [['id', 'ASC']]
    });

    console.log('📋 TODOS LOS USUARIOS:');
    allUsers.forEach(user => {
      const rol = user.rol_id === 1 ? 'Admin' : 'Usuario';
      console.log(`${user.id}: ${user.nombre} (${rol}) - Admin responsable: ${user.administrador_id || 'null'}`);
    });

    // Obtener administradores
    const admins = allUsers.filter(u => u.rol_id === 1);
    console.log(`\n👑 Administradores encontrados: ${admins.length}`);

    // Para cada admin, mostrar qué ve
    for (const admin of admins) {
      console.log(`\n🔍 Admin "${admin.nombre}" (ID: ${admin.id}) ve:`);
      
      try {
        const visibleUsers = await userService.getAllUsersByAdministadorId(admin.id);
        console.log(`Total visible: ${visibleUsers.length}`);
        
        visibleUsers.forEach(user => {
          const rol = user.rol_id === 1 ? 'Admin' : 'Usuario';
          console.log(`  - ${user.nombre} (${rol})`);
        });
        
        if (visibleUsers.length === 0) {
          console.log('  ❌ NO VE NINGÚN USUARIO');
        }
      } catch (error) {
        console.log(`  ❌ Error: ${error.message}`);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

quickDebug(); 