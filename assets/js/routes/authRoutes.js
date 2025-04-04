import express from 'express';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';
import authMiddleware from '../middleware/authMiddleware.js';

dotenv.config();

const router = express.Router();

// Rota de Registro
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, username } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Todos os campos obrigatórios devem ser preenchidos' });
        }

        // Verifica se o usuário já existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Usuário já cadastrado' });
        }

        // Hash da senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // Criar novo usuário
        const newUser = new User({ name, email, password: hashedPassword, username, isApproved: false });
        await newUser.save();

        res.status(201).json({ message: 'Usuário cadastrado com sucesso, aguarde aprovação' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao cadastrar usuário', error });
    }
});

// Rota de Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Tentativa de login com email:', email);

        const user = await User.findOne({ email });
        if (!user) {
            console.log('Usuário não encontrado:', email);
            return res.status(400).json({ message: 'Usuário não encontrado' });
        }

        console.log('Usuário encontrado:', user);

        // Verifica se o usuário está aprovado
        if (!user.isApproved) {
            console.log('Usuário não aprovado:', email);
            return res.status(403).json({ message: 'Acesso negado. Aguarde aprovação do administrador' });
        }

        // Verifica a senha
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Senha inválida para o usuário:', email);
            return res.status(400).json({ message: 'Senha inválida' });
        }

        console.log('Senha válida, gerando token...');

        // Gera o token JWT
        const token = jwt.sign(
            { userId: user._id, isAdmin: user.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        console.log('Token gerado com sucesso:', token);

        res.status(200).json({ token });
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).json({ message: 'Erro ao fazer login', error });
    }
});

// Rota de Aprovação de Usuário (somente admins podem aprovar)
router.put('/approve/:userId', authMiddleware, async (req, res) => {
    try {
        const { userId } = req.params;

        // Atualiza o campo isApproved para true
        const user = await User.findByIdAndUpdate(userId, { isApproved: true }, { new: true });

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        res.status(200).json({ message: 'Usuário aprovado com sucesso', user });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao aprovar usuário', error });
    }
});

// Rota de Logout
router.post('/logout', authMiddleware, (req, res) => {
    // Para logout, você pode simplesmente remover o token do lado do cliente
    res.status(200).json({ message: 'Logout realizado com sucesso' });
});

// Rota para solicitar redefinição de senha
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        console.log('Tentativa de redefinição de senha para o e-mail:', email);

        // Verifique se o usuário existe
        const user = await User.findOne({ email });
        if (!user) {
            console.log('Usuário não encontrado:', email);
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        console.log('Usuário encontrado:', user);

        // Gere o token de redefinição de senha
        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hora
        await user.save();

        console.log('Token salvo no banco de dados para o usuário:', user);

        res.status(200).json({
            message: 'Solicitação de redefinição de senha registrada. Entre em contato com o administrador do sistema.',
        });
    } catch (error) {
        console.error('Erro ao registrar solicitação de redefinição de senha:', error);
        res.status(500).json({ message: 'Erro ao registrar solicitação de redefinição de senha', error });
    }
});

// Rota para redefinir a senha (usada pelo administrador)
router.post('/reset-password/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        console.log('Tentativa de redefinição de senha com o token:', token);

        // Verifique se o token é válido
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }, // Verifica se o token ainda é válido
        });

        if (!user) {
            console.log('Token inválido ou expirado:', token);
            return res.status(400).json({ message: 'Token inválido ou expirado' });
        }

        // Atualize a senha
        user.password = await bcrypt.hash(newPassword, 10); // Hash da nova senha
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        console.log('Senha redefinida com sucesso para o usuário:', user);

        res.json({ message: 'Senha redefinida com sucesso!' });
    } catch (error) {
        console.error('Erro ao redefinir senha:', error);
        res.status(500).json({ message: 'Erro ao redefinir senha', error });
    }
});

export default router;
