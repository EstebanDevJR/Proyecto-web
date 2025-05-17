// Importación de dependencias necesarias
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const User = require('../models/user.model');
const jwtConfig = require('../config/jwtConfig');

// Cargar variables de entorno
dotenv.config();

// Obtener la clave secreta para JWT desde la configuración
const SECRET_KEY = jwtConfig.JWT_SECRET;

// Función para autenticar usuarios
module.exports.loginUser = async (email, password) => {
    try {
        // Buscar usuario por email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        // Verificar contraseña
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Contraseña incorrecta');
        }

        // Generar token JWT con la información del usuario
        // Simplificamos el token para evitar problemas con los permisos
        const token = jwt.sign(
            {
                id: user.id, 
                nombre: user.nombre, 
                email: user.email, 
                rol_id: user.rol_id
            }, 
            SECRET_KEY, 
            { expiresIn: jwtConfig.JWT_EXPIRY }
        );
        return token;
    }
    catch (error) {
        throw new Error(error.message || "Error al iniciar sesión");
    }
};

// Función para registrar usuarios (registro público)
module.exports.registerUser = async (nombre, email, password, rol_id) => {
    try {
        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            throw new Error('El correo electrónico ya está registrado');
        }

        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Buscar el administrador principal (ID 1)
        const admin = await User.findByPk(1);
        if (!admin) {
            throw new Error('No se encontró el administrador principal');
        }

        // Crear el usuario con el administrador principal
        const newUser = await User.create({
            nombre,
            email,
            password: hashedPassword,
            rol_id: rol_id || 2, // Por defecto, rol de usuario normal
            administrador_id: admin.id
        });

        // Retornar información del usuario (sin la contraseña)
        return {
            id: newUser.id,
            nombre: newUser.nombre,
            email: newUser.email,
            rol_id: newUser.rol_id
        };
    }
    catch (error) {
        throw new Error(error.message || "Error al registrar usuario");
    }
};
