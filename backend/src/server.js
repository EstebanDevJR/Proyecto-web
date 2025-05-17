// Importación de dependencias necesarias
const sequelize = require('./config/db');
const app = require('./app');
const dotenv = require('dotenv');
require('./models/associations');

// Carga las variables de entorno
dotenv.config();

// Define el puerto del servidor, usa el de .env o 3000 por defecto
const PORT = process.env.PORT || 3000;

// Intenta autenticar la conexión a la base de datos
sequelize.authenticate()
  .then(() => {
    console.log('Connected to PostgreSQL with Sequelize');
    // Inicia el servidor una vez que la conexión sea exitosa
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to database:', error);
  });

// Sincroniza los modelos con la base de datos
// force: false significa que no se borrarán las tablas existentes
sequelize.sync({force: false}).then(() => {
  console.log('Database synchronized');
}).catch((error) => {
  console.error('Error synchronizing database:', error);
});