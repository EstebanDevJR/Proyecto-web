// Script para probar la visibilidad mutua entre administradores
const sequelize = require('./config/db');
const User = require('./models/user.model');
const userService = require('./services/user.service');

async function testAdminVisibility() {
  try {
    // Conectar a la base de datos
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente.\n');

    // Obtener todos los administradores existentes
    const admins = await User.findAll({
      where: { rol_id: 1 },
      attributes: ['id', 'nombre', 'email', 'administrador_id'],
      order: [['id', 'ASC']]
    });

    if (admins.length < 2) {
      console.log('❌ Se necesitan al menos 2 administradores para probar la visibilidad mutua');
      console.log(`📊 Administradores encontrados: ${admins.length}`);
      admins.forEach(admin => {
        console.log(`  - ${admin.nombre} (ID: ${admin.id})`);
      });
      process.exit(1);
    }

    console.log('👑 ADMINISTRADORES DISPONIBLES:');
    console.log('='.repeat(40));
    admins.forEach(admin => {
      const adminInfo = admin.administrador_id ? `Creado por admin ${admin.administrador_id}` : 'Sin admin responsable';
      console.log(`ID: ${admin.id} | ${admin.nombre} | ${adminInfo}`);
    });

    console.log('\n🔍 PRUEBA DE VISIBILIDAD MUTUA:');
    console.log('='.repeat(50));

    // Para cada administrador, mostrar qué usuarios puede ver
    for (const admin of admins) {
      console.log(`\n📊 Administrador "${admin.nombre}" (ID: ${admin.id}) puede ver:`);
      
      try {
        const visibleUsers = await userService.getAllUsersByAdministadorId(admin.id);
        
        if (visibleUsers.length === 0) {
          console.log('  ❌ No ve ningún usuario');
        } else {
          // Separar administradores y usuarios normales
          const visibleAdmins = visibleUsers.filter(u => u.rol_id === 1);
          const visibleNormalUsers = visibleUsers.filter(u => u.rol_id === 2);
          
          if (visibleAdmins.length > 0) {
            console.log('  👑 Otros Administradores:');
            visibleAdmins.forEach(user => {
              console.log(`    ✅ ${user.nombre} (${user.email})`);
            });
          }
          
          if (visibleNormalUsers.length > 0) {
            console.log('  👤 Usuarios Normales:');
            visibleNormalUsers.forEach(user => {
              console.log(`    ✅ ${user.nombre} (${user.email})`);
            });
          }
          
          console.log(`  📈 Total visible: ${visibleUsers.length} usuarios`);
        }
      } catch (error) {
        console.log(`  ❌ Error al consultar: ${error.message}`);
      }
    }

    // Verificar que los administradores se vean mutuamente
    console.log('\n🔄 VERIFICACIÓN DE VISIBILIDAD MUTUA:');
    console.log('='.repeat(45));
    
    let mutualVisibilityWorks = true;
    
    for (let i = 0; i < admins.length; i++) {
      for (let j = i + 1; j < admins.length; j++) {
        const admin1 = admins[i];
        const admin2 = admins[j];
        
        console.log(`\n🔍 Probando: ${admin1.nombre} ↔ ${admin2.nombre}`);
        
        // ¿Puede admin1 ver a admin2?
        const users1 = await userService.getAllUsersByAdministadorId(admin1.id);
        const admin1CanSeeAdmin2 = users1.some(u => u.id === admin2.id);
        
        // ¿Puede admin2 ver a admin1?
        const users2 = await userService.getAllUsersByAdministadorId(admin2.id);
        const admin2CanSeeAdmin1 = users2.some(u => u.id === admin1.id);
        
        console.log(`  ${admin1.nombre} puede ver a ${admin2.nombre}: ${admin1CanSeeAdmin2 ? '✅' : '❌'}`);
        console.log(`  ${admin2.nombre} puede ver a ${admin1.nombre}: ${admin2CanSeeAdmin1 ? '✅' : '❌'}`);
        
        if (!admin1CanSeeAdmin2 || !admin2CanSeeAdmin1) {
          mutualVisibilityWorks = false;
        }
      }
    }

    console.log('\n' + '='.repeat(60));
    if (mutualVisibilityWorks) {
      console.log('🎉 ¡ÉXITO! La visibilidad mutua entre administradores funciona correctamente');
    } else {
      console.log('❌ PROBLEMA: La visibilidad mutua no funciona como esperado');
    }
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error.message);
  } finally {
    await sequelize.close();
  }
}

// Ejecutar la prueba
testAdminVisibility(); 