const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const {authenticateToken, checkRole}= require('../middlewares/auth.middleware');
const ROLES = require('../utils/constants');
const errorHandler = require('../middlewares/error.middleware');  // Fix: Updated path

router.post('/users/create', authenticateToken, checkRole(ROLES.ADMIN), userController.createUser);
router.put('/users/update/:id', authenticateToken, checkRole(ROLES.ADMIN), userController.updateUser);
router.get('/users', authenticateToken, checkRole(ROLES.ADMIN), userController.getAllUsersByAdministadorId);
router.delete('/users/delete/:id', authenticateToken, checkRole(ROLES.ADMIN), userController.deleteUser);
router.get('/users/rol/:id', authenticateToken, checkRole(ROLES.ADMIN), userController.getAllUsersByRolId);

router.use(errorHandler);  // Fix: Changed from errorhandler to errorHandler to match the import

module.exports = router;

