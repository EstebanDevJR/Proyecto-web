// Script para crear un usuario administrador
const bcrypt = require('bcrypt');
const sequelize = require('./config/db');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

// Datos del usuario administrador
const adminUser = {
  nombre: 'Administrador',
  email: 'admin@example.com',
  password: 'admin123',
  rol_id: 1, // ID del rol ADMIN
};

async function createAdminUser() {
  try {
    // Conectar a la base de datos
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(adminUser.password, 10);
    
    // Verificar si el usuario ya existe
    const [existingUsers] = await sequelize.query(
      "SELECT * FROM usuarios WHERE email = :email",
      {
        replacements: { email: adminUser.email },
        type: sequelize.QueryTypes.SELECT
      }
    );

    if (existingUsers && existingUsers.length > 0) {
      console.log('El usuario administrador ya existe.');
      console.log('Email:', adminUser.email);
      console.log('Contraseña: admin123');
      process.exit(0);
    }

    // Crear ID manualmente
    const adminId = 1;

    // Usar SQL directo para insertar el primer usuario ignorando temporalmente las restricciones
    await sequelize.query(`
      INSERT INTO usuarios (id, nombre, email, password, rol_id, administrador_id)
      VALUES (:id, :nombre, :email, :password, :rol_id, :id)
    `, {
      replacements: {
        id: adminId,
        nombre: adminUser.nombre,
        email: adminUser.email,
        password: hashedPassword,
        rol_id: adminUser.rol_id
      }
    });

    console.log('Usuario administrador creado con éxito:');
    console.log('ID:', adminId);
    console.log('Email:', adminUser.email);
    console.log('Contraseña:', adminUser.password);
    console.log('Rol ID:', adminUser.rol_id);

    process.exit(0);
  } catch (error) {
    console.error('Error al crear el usuario administrador:', error);
    process.exit(1);
  }
}

// Ejecutar la función
createAdminUser(); 