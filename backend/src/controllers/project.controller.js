const projectService = require('../services/project.service');

exports.createProject = async (req, res) => {
    try {
        const { data } = req.body;
        const project = await projectService.createProject(data);
        return res.status(200).json({ message: 'Proyecto creado con éxito.', proyecto: project });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

exports.updateProject = async (req , res ) => {
    const { id } = req.params;
    const { data } = req.body;
    try{
        const updatedProject = await projectService.updateProject(id, data);
        res.status(200).json({message : 'Proyecto actualizado con éxito', project});
    }catch (err) {
        res.status(500).json({message: err.message});
    }
};

exports.deleteProject = async (req, res) => {
    try{
        const { id } = req.params;
        const deletedProject = await projectService.deleteProject(id);
        return res.status(200).json({ message: 'Proyecto eliminado con éxito.' });
}catch (err){
    return res.status(500).json({ error: err.message });
}
};

exports.getProject = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await projectService.getProject(id);
        return res.status(200).json({ message: 'Proyecto obtenido con éxito.', proyecto: project });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

exports.getAllProjects = async (req, res) => {
    try {
        const projects = await projectService.getAllProjects();
        return res.status(200).json({ message: 'Proyectos obtenidos con éxito.', proyectos: projects });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

exports.getProjectsByUserId = async (req, res) => {
    try {
        const { userid } = req.params;
        const projects = await projectService.getProjectsByUserId(userid);
        return res.status(200).json({ message: 'Proyectos obtenidos con éxito.', proyectos: projects });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
exports.assignUserToProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { userIds } = req.body;
        const project = await projectService.assignUsersToProject({ projectId, userIds });
        return res.status(200).json({ message: 'Usuarios asignados con éxito.', proyecto: project });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

exports.removeUserFromProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { userId } = req.body;
        await projectService.removeUserFromProject({ projectId, userId });
        return res.status(200).json({ message: 'Usuario removido del proyecto con éxito.' });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};