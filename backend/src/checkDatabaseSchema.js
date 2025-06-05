// Script para verificar la estructura de las tablas en la base de datos
const sequelize = require('./config/db');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

async function checkDatabaseSchema() {
  try {
    // Conectar a la base de datos
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');

    // Verificar estructura de la tabla usuarios_proyectos
    console.log('\n🔍 Verificando estructura de la tabla usuarios_proyectos...');
    
    const [results] = await sequelize.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'usuarios_proyectos' 
      ORDER BY ordinal_position;
    `);

    if (results.length === 0) {
      console.log('❌ La tabla usuarios_proyectos no existe');
      
      // Verificar qué tablas existen
      console.log('\n📋 Tablas disponibles:');
      const [tables] = await sequelize.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        ORDER BY table_name;
      `);
      
      tables.forEach(table => {
        console.log(`  - ${table.table_name}`);
      });
    } else {
      console.log('✅ Estructura de la tabla usuarios_proyectos:');
      results.forEach(column => {
        console.log(`  - ${column.column_name}: ${column.data_type} (nullable: ${column.is_nullable})`);
      });
    }

    // También verificar otras tablas importantes
    console.log('\n🔍 Verificando otras tablas...');
    
    const tables = ['usuarios', 'proyectos', 'roles'];
    
    for (const tableName of tables) {
      const [tableResults] = await sequelize.query(`
        SELECT column_name, data_type
        FROM information_schema.columns 
        WHERE table_name = '${tableName}' 
        ORDER BY ordinal_position;
      `);
      
      if (tableResults.length > 0) {
        console.log(`\n📋 Tabla ${tableName}:`);
        tableResults.forEach(column => {
          console.log(`  - ${column.column_name}: ${column.data_type}`);
        });
      } else {
        console.log(`❌ Tabla ${tableName} no existe`);
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('Error al verificar esquema:', error);
    process.exit(1);
  }
}

// Ejecutar la función
checkDatabaseSchema(); 