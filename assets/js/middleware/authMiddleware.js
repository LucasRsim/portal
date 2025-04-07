import jwt from 'jsonwebtoken';

export default function authMiddleware(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1]; // Extrai o token do cabeçalho Authorization

    if (!token) {
        return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifica o token
        req.user = decoded; // Adiciona os dados do usuário à requisição
        next(); // Continua para a próxima função
    } catch (error) {
        res.status(401).json({ message: 'Token inválido ou expirado.' });
    }
}