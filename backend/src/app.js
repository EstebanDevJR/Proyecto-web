// Importación de dependencias necesarias
const express = require('express');
const cors = require('cors');
const app = express();

// Configuración de middleware
app.use(express.json());  // Para procesar datos en formato JSON

// Configuración de CORS más específica para desarrollo
app.use(cors({
    origin: ['http://localhost:4200', 'http://127.0.0.1:4200'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Importación de rutas
const userRoutes = require('./routes/user.routes');
const authRoutes = require('./routes/auth.routes');
const projectRoutes = require('./routes/project.routes');

// Configuración de rutas con prefijo '/api/v1'
app.use('/api/v1', userRoutes);
app.use('/api/v1', authRoutes);
app.use('/api/v1', projectRoutes);

app.get('/api/v1/healthcheck', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'API funcionando' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Algo salió mal en el servidor' });
});

// Exporta la aplicación para ser utilizada en otros archivos
module.exports = app;