const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

// Changed from JWT_SECRET_KEY to JWT_SECRET to match the environment variable name
const SECRET_KEY = process.env.JWT_SECRET;

const authenticateToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
        return res.status(401).json({ message: 'Acceso denegado, no se proporcionó un token' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: 'Acceso denegado, no se proporcionó un token' });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Token inválido' });
        }
        req.user = decoded;
        next();
    });
};

const checkRole = (roles) => {
    return (req, res, next) => {
        const {rol_id} = req.user;

        if (!roles.includes(rol_id)) {
            return res.status(403).json({ message: 'Acceso denegado, no tienes permiso para realizar esta acción' });
        }
        next();
    };
};

module.exports = { authenticateToken, checkRole};