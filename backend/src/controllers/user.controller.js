// Importación de dependencias necesarias
const express = require('express');
const userService = require('../services/user.service');

// Controlador para crear un nuevo usuario
exports.createUser = async (req, res) => {
    try {
        // Extrae los datos necesarios del cuerpo de la petición
        const { nombre, email, password, rol_id, administrador_id } = req.body;
        // Llama al servicio para crear el usuario
        const newUser = await userService.createUser(nombre, email, password, rol_id, administrador_id);
        // Responde con el usuario creado
        res.status(201).json({message: 'Usuario creado exitosamente',
            user: newUser});
    } catch (error) {
        res.status(500).json({ message: err.message });
    }
};

// Controlador para obtener todos los usuarios por ID de administrador
exports.getAllUsersByAdministadorId = async (req, res) => {
    try{
        // Obtiene el ID del administrador desde el token
        const admin_from_token = req.user.id;
        // Extrae el email de los parámetros de consulta
        const { email } = req.query;
        // Obtiene los usuarios filtrados por administrador
        const users = await userService.getAllUsersByAdministadorId(admin_from_token, email);
        res.status(200).json({message: 'Usuarios consultados con exito',     
            users});
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener los usuarios', error });
    }
};

// Controlador para obtener usuarios por ID de rol
exports.getAllUsersByRolId = async (req, res) => {
    try {
        // Obtiene los usuarios filtrados por rol
        const users = await userService.getAllUsersByRolId(req.params.id);
        res.status(200).json({message: 'Usuarios consultados con exito', users});
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los usuarios', error });
    }
};

// Controlador para actualizar un usuario
exports.updateUser = async (req, res) => {
    // Extrae el ID del usuario de los parámetros
    const { id } = req.params;
    // Extrae los datos a actualizar del cuerpo de la petición
    const { nombre, email, rol_id, administrador_id } = req.body;
    // Obtiene el ID del administrador desde el token
    const admin_from_token = req.user.id;
    try {
        // Actualiza el usuario
        const user = await userService.updateUser(id, nombre, email, rol_id, administrador_id, admin_from_token);
        res.status(200).json({ message: 'Usuario actualizado exitosamente', user });
    } catch (err) {
        res.status(500).json({ message: err.message});
    }
};

// Controlador para eliminar un usuario
exports.deleteUser = async (req, res) => {
    // Extrae el ID del usuario de los parámetros
    const { id } = req.params;
    // Obtiene el ID del administrador desde el token
    const admin_from_token = req.user.id;
    try {
        // Elimina el usuario
        const result = await userService.deleteUser(id, admin_from_token);
        res.status(200).json({ message: 'Usuario eliminado exitosamente', result });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};