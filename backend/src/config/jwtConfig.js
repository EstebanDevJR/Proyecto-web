// Configuración de JWT
module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'Proyecto-web-secret-key-2023',
  JWT_EXPIRY: '1h' // Token expira en 1 hora
}; 