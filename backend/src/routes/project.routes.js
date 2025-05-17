const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project.controller');
const ROLES = require('../utils/constants');
const {authenticateToken, checkRole}= require('../middlewares/auth.middleware');

router.post('/projects/create', authenticateToken, checkRole(ROLES.ADMIN), projectController.createProject);
router.put('/projects/update/:id', authenticateToken, checkRole(ROLES.ADMIN), projectController.updateProject);
router.get('/projects', authenticateToken, checkRole(ROLES.ADMIN), projectController.getAllProjects);
router.delete('/projects/delete/:id', authenticateToken, checkRole(ROLES.ADMIN), projectController.deleteProject);
router.get('/projects/rol/:id', authenticateToken, checkRole(ROLES.USER), projectController.getProjectsByUserId);  // Fixed method name

router.post('/projects/assign/:projectId', authenticateToken, checkRole(ROLES.ADMIN), projectController.assignUserToProject);
router.delete('/projects/unassign/:projectId', authenticateToken, checkRole(ROLES.ADMIN), projectController.removeUserFromProject);

module.exports = router;