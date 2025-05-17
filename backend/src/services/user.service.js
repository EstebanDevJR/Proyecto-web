// Importación de dependencias necesarias
const User = require('../models/user.model');
const bcrypt = require('bcrypt');

// Servicio para crear un nuevo usuario
exports.createUser = async (nombre, email, password, rol_id, administrador_id) => {
    try {
        // Verificar si el usuario ya existe
        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            throw new Error ('Usuario ya existe');
        }

        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear nuevo usuario
        const newUser = await User.create({
            nombre,
            email,
            password: hashedPassword,
            rol_id,
            administrador_id
        });

        return newUser;
    }
    catch (error) {
        // Corregido: template string syntax
        throw new Error(`Error al crear usuario: ${error.message}`);
    }
};

// Servicio para obtener usuarios por ID de administrador
exports.getAllUsersByAdministadorId = async (administrador_id, email) => {
    try {
        // Construir cláusula where dinámica
        const whereClause = { administrador_id };
        if (email) {
            whereClause.email = email;
        }
        // Obtener usuarios excluyendo el campo password
        const users = await User.findAll({where: whereClause, attributes: { exclude: ['password'] }});
        return users;
    }
    catch (err) {
        throw new Error(`Error al obtener usuarios: ${err.message}`);
    }
};

// Servicio para obtener usuarios por ID de rol
exports.getAllUsersByRolId = async (rol_id) => {
    try{
        const users = await User.findAll({ where: { rol_id }, attributes: { exclude: ['password'] } });
        return users;
    } catch(err) {
        throw new Error(`Error al obtener usuarios: ${err.message}`);
    }
};

// Servicio para actualizar un usuario
exports.updateUser = async (id, nombre, email, rol_id, administrador_id, admin_from_token) => {
    try {
        // Buscar usuario por ID
        const user = await User.findByPk(id);
        
        // Verificar si el usuario existe
        if(!user) {
            throw new Error('Usuario no encontrado');
        }

        // Verificar si el administrador tiene permisos sobre este usuario
        if (user.administrador_id !== admin_from_token) {
            throw new Error('Acceso denegado, este usuario no esta bajo su administracion');
        }

        // Verificar si el nuevo email ya está en uso
        if (email && email !== user.email) {
            const userExists = await User.findOne({ where: { email } });
            if (userExists) {
                throw new Error('El email ya esta en uso');
            }
        }
        
        // Actualizar usuario
        await user.update({ nombre, email, rol_id, administrador_id });
        return user;
    }
    catch (err) {
        // Corregido: error -> err
        throw new Error(`Error al actualizar usuario: ${err.message}`);
    }
};

// Servicio para eliminar un usuario
exports.deleteUser = async (id, admin_from_token) => {
    try {
        // Buscar usuario por ID
        const user = await User.findByPk(id);
        
        // Verificar si el usuario existe
        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        // Verificar si el administrador tiene permisos sobre este usuario
        if (user.administrador_id !== admin_from_token) {
            throw new Error('Acceso denegado, este usuario no esta bajo su administracion');
        }
        
        // Eliminar usuario
        await user.destroy();
    }
    catch (err) {
        throw new Error(`Error al eliminar usuario: ${err.message}`);
    }
};