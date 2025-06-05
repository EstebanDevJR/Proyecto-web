// Test final - Verificar que todos los administradores ven todos los usuarios
const sequelize = require('./config/db');
const User = require('./models/user.model');
const userService = require('./services/user.service');

async function finalTest() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado a la base de datos\n');

    // Obtener totales
    const totalUsers = await User.count();
    const totalAdmins = await User.count({ where: { rol_id: 1 } });
    const totalNormalUsers = await User.count({ where: { rol_id: 2 } });

    console.log('📊 ESTADÍSTICAS DEL SISTEMA:');
    console.log(`Total de usuarios: ${totalUsers}`);
    console.log(`Administradores: ${totalAdmins}`);
    console.log(`Usuarios normales: ${totalNormalUsers}\n`);

    // Obtener todos los administradores
    const admins = await User.findAll({
      where: { rol_id: 1 },
      attributes: ['id', 'nombre']
    });

    if (admins.length === 0) {
      console.log('❌ No hay administradores en el sistema');
      return;
    }

    console.log('🧪 PRUEBA DE VISIBILIDAD SIMPLIFICADA:');
    console.log('='.repeat(45));

    let allTestsPassed = true;

    for (const admin of admins) {
      console.log(`\n👑 Administrador: ${admin.nombre} (ID: ${admin.id})`);
      
      try {
        const visibleUsers = await userService.getAllUsersByAdministadorId(admin.id);
        const expectedVisible = totalUsers - 1; // Todos menos él mismo
        
        console.log(`  📈 Ve ${visibleUsers.length} usuarios (esperado: ${expectedVisible})`);
        
        if (visibleUsers.length === expectedVisible) {
          console.log('  ✅ CORRECTO: Ve el número esperado de usuarios');
        } else {
          console.log('  ❌ ERROR: No ve el número esperado de usuarios');
          allTestsPassed = false;
        }

        // Verificar que no se ve a sí mismo
        const seesHimself = visibleUsers.some(u => u.id === admin.id);
        if (!seesHimself) {
          console.log('  ✅ CORRECTO: No se ve a sí mismo');
        } else {
          console.log('  ❌ ERROR: Se está viendo a sí mismo');
          allTestsPassed = false;
        }

        // Contar tipos de usuarios visibles
        const visibleAdmins = visibleUsers.filter(u => u.rol_id === 1).length;
        const visibleNormalUsers = visibleUsers.filter(u => u.rol_id === 2).length;
        
        console.log(`  📋 Detalle: ${visibleAdmins} administradores, ${visibleNormalUsers} usuarios normales`);

      } catch (error) {
        console.log(`  ❌ ERROR: ${error.message}`);
        allTestsPassed = false;
      }
    }

    console.log('\n' + '='.repeat(50));
    if (allTestsPassed) {
      console.log('🎉 ¡ÉXITO! Todos los administradores ven correctamente a todos los usuarios');
      console.log('✅ La funcionalidad está lista para usar');
    } else {
      console.log('❌ FALLÓ: Hay problemas con la visibilidad de usuarios');
      console.log('🔧 Revisar la lógica del servicio getAllUsersByAdministadorId');
    }

  } catch (error) {
    console.error('❌ Error en la prueba:', error.message);
  } finally {
    await sequelize.close();
  }
}

finalTest(); 