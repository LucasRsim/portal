import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
console.log('Middleware executado');
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        // Verifique se o usuário é administrador
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: 'Acesso negado. Apenas administradores podem realizar esta ação.' });
        }

        next();
    } catch (error) {
        res.status(401).json({ message: 'Token inválido.' });
    }
};

export default authMiddleware;