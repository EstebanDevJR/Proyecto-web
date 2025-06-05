const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project.controller');
const ROLES = require('../utils/constants');
const {authenticateToken, checkRole}= require('../middlewares/auth.middleware');

// Endpoints de debugging/testing (sin autenticación)
router.get('/projects/test', (req, res) => {
    console.log('🧪 Test endpoint llamado');
    projectController.getAllProjects(req, res);
});

router.get('/projects/debug', async (req, res) => {
    try {
        console.log('🔍 Debug endpoint llamado');
        const Project = require('../models/project.model');
        const User = require('../models/user.model');
        
        const projects = await Project.findAll({
            include: [
                {
                    model: User,
                    as: 'administrador',
                    attributes: ['id', 'nombre']
                }
            ]
        });
        
        res.status(200).json({
            message: 'Debug - Proyectos obtenidos',
            total: projects.length,
            proyectos: projects
        });
    } catch (error) {
        console.error('Error en debug:', error);
        res.status(500).json({ error: error.message });
    }
});

// Endpoints principales con autenticación
router.post('/projects/create', authenticateToken, checkRole(ROLES.ADMIN), projectController.createProject);
router.put('/projects/update/:id', authenticateToken, checkRole(ROLES.ADMIN), projectController.updateProject);
router.get('/projects', authenticateToken, checkRole(ROLES.ADMIN), projectController.getAllProjects);
router.get('/projects/:id', authenticateToken, checkRole(ROLES.ADMIN), projectController.getProject);
router.delete('/projects/delete/:id', authenticateToken, checkRole(ROLES.ADMIN), projectController.deleteProject);
router.get('/projects/rol/:id', authenticateToken, checkRole(ROLES.USER), projectController.getProjectsByUserId);

router.post('/projects/assign/:projectId', authenticateToken, checkRole(ROLES.ADMIN), projectController.assignUserToProject);
router.delete('/projects/unassign/:projectId', authenticateToken, checkRole(ROLES.ADMIN), projectController.removeUserFromProject);

module.exports = router;