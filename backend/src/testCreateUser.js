// Script para probar la creación de usuarios
const sequelize = require('./config/db');
const User = require('./models/user.model');
const userService = require('./services/user.service');

async function testCreateUser() {
  try {
    // Conectar a la base de datos
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente.');

    // Obtener administradores existentes
    const existingAdmins = await User.findAll({ 
      where: { rol_id: 1 },
      attributes: ['id', 'nombre', 'email']
    });
    
    if (existingAdmins.length === 0) {
      console.log('❌ No hay administradores existentes para probar');
      process.exit(1);
    }

    console.log('📋 Administradores existentes:', existingAdmins.map(a => `${a.nombre} (ID: ${a.id})`));
    
    const adminId = existingAdmins[0].id;
    console.log(`\n🔧 Usando administrador ID ${adminId} como responsable`);

    // Crear un usuario normal
    console.log('\n1️⃣ Creando usuario normal...');
    const normalUser = await userService.createUser(
      'Usuario Test Normal',
      'normal.test@example.com',
      'password123',
      2, // rol_id = 2 (usuario normal)
      adminId // administrador_id
    );
    console.log('✅ Usuario normal creado:', normalUser.id, normalUser.nombre);

    // Crear un usuario administrador
    console.log('\n2️⃣ Creando usuario administrador...');
    const adminUser = await userService.createUser(
      'Admin Test',
      'admin.test@example.com',
      'password123',
      1, // rol_id = 1 (administrador)
      adminId // administrador_id (el admin responsable)
    );
    console.log('✅ Usuario administrador creado:', adminUser.id, adminUser.nombre);

    // Verificar que aparezcan en la consulta del administrador responsable
    console.log('\n🔍 Verificando usuarios creados por el administrador...');
    const usersCreatedByAdmin = await userService.getAllUsersByAdministadorId(adminId);
    console.log(`📊 El administrador ${adminId} tiene ${usersCreatedByAdmin.length} usuarios:`);
    
    usersCreatedByAdmin.forEach(user => {
      const roleName = user.rol_id === 1 ? 'Administrador' : 'Usuario';
      console.log(`  - ${user.nombre} (${user.email}) - ${roleName}`);
    });

    console.log('\n✅ Prueba completada exitosamente!');
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error.message);
  } finally {
    await sequelize.close();
  }
}

// Ejecutar la prueba
testCreateUser(); 