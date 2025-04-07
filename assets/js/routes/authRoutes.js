import express from 'express';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';
import authMiddleware from '../middleware/authMiddleware.js';
import sgMail from '@sendgrid/mail';

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const router = express.Router();

const API_URL = process.env.API_URL || 'https://portal-x09e.onrender.com'; // Substitua pela URL do Render

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
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        // Gerar token de redefinição de senha
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hora
        await user.save();

        // Enviar e-mail com o link de redefinição
        const resetLink = `https://portal-x09e.onrender.com/reset-password.html?token=${resetToken}`;
        const msg = {
            to: user.email,
            from: process.env.EMAIL_FROM,
            subject: 'Redefinição de Senha',
            text: `Você solicitou a redefinição de senha. Clique no link abaixo para redefinir sua senha:\n\n${resetLink}`,
            html: `<p>Você solicitou a redefinição de senha. Clique no link abaixo para redefinir sua senha:</p>
                   <a href="${resetLink}">${resetLink}</a>`,
        };

        await sgMail.send(msg);

        res.status(200).json({ message: 'E-mail de redefinição de senha enviado com sucesso' });
    } catch (error) {
        console.error('Erro ao processar solicitação:', error);
        res.status(500).json({ message: 'Erro ao processar solicitação' });
    }
});

// Rota para redefinir a senha
router.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        // Localizar o usuário pelo token e verificar se o token ainda é válido
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }, // Verifica se o token ainda não expirou
        });

        if (!user) {
            return res.status(400).json({ message: 'Token inválido ou expirado' });
        }

        // Atualizar a senha
        user.password = await bcrypt.hash(password, 10); // Criptografa a nova senha
        user.resetPasswordToken = undefined; // Remove o token
        user.resetPasswordExpires = undefined; // Remove a expiração
        await user.save();

        res.status(200).json({ message: 'Senha redefinida com sucesso' });
    } catch (error) {
        console.error('Erro ao redefinir senha:', error);
        res.status(500).json({ message: 'Erro ao redefinir senha' });
    }
});

// Exemplo de uso do fetch para login
router.post('/auth/login', (req, res) => {
    const { email, password } = req.body; // Certifique-se de que o corpo da requisição contém essas variáveis

    if (!email || !password) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    // Exemplo de uso
    fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password }) // Agora as variáveis estão definidas
    })
        .then(response => response.json())
        .then(data => res.json(data))
        .catch(error => res.status(500).json({ error: 'Erro ao fazer login' }));
});

export default router;
