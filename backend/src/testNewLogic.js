// Script para probar la nueva lógica de visibilidad
const sequelize = require('./config/db');
const User = require('./models/user.model');
const userService = require('./services/user.service');

async function testNewLogic() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado a la base de datos\n');

    // Obtener todos los usuarios para entender el panorama
    const allUsers = await User.findAll({
      attributes: ['id', 'nombre', 'email', 'rol_id', 'administrador_id'],
      order: [['id', 'ASC']]
    });

    console.log('📋 ESTADO ACTUAL DE LA BASE DE DATOS:');
    console.log('='.repeat(50));
    allUsers.forEach(user => {
      const rol = user.rol_id === 1 ? 'Administrador' : 'Usuario Normal';
      const admin = user.administrador_id ? `Admin: ${user.administrador_id}` : 'Sin admin';
      console.log(`ID ${user.id}: ${user.nombre} | ${rol} | ${admin}`);
    });

    const admins = allUsers.filter(u => u.rol_id === 1);
    const normalUsers = allUsers.filter(u => u.rol_id === 2);

    console.log(`\n📊 Resumen: ${admins.length} administradores, ${normalUsers.length} usuarios normales`);

    // Probar la visibilidad para cada administrador
    console.log('\n🔍 NUEVA LÓGICA SIMPLIFICADA:');
    console.log('Todos los administradores ven todos los usuarios (excepto a sí mismos)');
    console.log('='.repeat(60));

    for (const admin of admins) {
      console.log(`\n👑 Administrador "${admin.nombre}" (ID: ${admin.id}):`);
      
      try {
        const visibleUsers = await userService.getAllUsersByAdministadorId(admin.id);
        
        if (visibleUsers.length === 0) {
          console.log('  ❌ NO VE NINGÚN USUARIO');
          continue;
        }

        const visibleAdmins = visibleUsers.filter(u => u.rol_id === 1);
        const visibleNormalUsers = visibleUsers.filter(u => u.rol_id === 2);

        console.log(`  📈 Total visible: ${visibleUsers.length} usuarios`);
        
        if (visibleAdmins.length > 0) {
          console.log(`  👑 Otros administradores (${visibleAdmins.length}):`);
          visibleAdmins.forEach(user => {
            console.log(`    - ${user.nombre} (ID: ${user.id})`);
          });
        }

        if (visibleNormalUsers.length > 0) {
          console.log(`  👤 Usuarios normales (${visibleNormalUsers.length}):`);
          visibleNormalUsers.forEach(user => {
            const adminInfo = user.administrador_id ? `admin: ${user.administrador_id}` : 'sin admin';
            console.log(`    - ${user.nombre} (${adminInfo})`);
          });
        }

      } catch (error) {
        console.log(`  ❌ Error: ${error.message}`);
      }
    }

    // Verificar casos específicos
    console.log('\n✅ VERIFICACIONES:');
    console.log('='.repeat(30));
    
    for (const admin of admins) {
      const visibleUsers = await userService.getAllUsersByAdministadorId(admin.id);
      const canSeeOtherAdmins = visibleUsers.some(u => u.rol_id === 1);
      const canSeeNormalUsers = visibleUsers.some(u => u.rol_id === 2);
      
      console.log(`${admin.nombre}:`);
      console.log(`  ✓ Ve otros administradores: ${canSeeOtherAdmins ? 'SÍ' : 'NO'}`);
      console.log(`  ✓ Ve usuarios normales: ${canSeeNormalUsers ? 'SÍ' : 'NO'}`);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

testNewLogic(); 