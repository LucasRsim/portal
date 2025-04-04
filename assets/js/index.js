import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import User from './models/User.js';
import authController from './controllers/authController.js';
import authMiddleware from './middleware/authMiddleware.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import authRoutes from './routes/authRoutes.js';

// Obter o equivalente ao __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurar dotenv com o caminho absoluto do .env
dotenv.config({ path: path.resolve(__dirname, '.env') });

dotenv.config();

connectDB();

console.log('MONGO_URI:', process.env.MONGO_URI); // Testar se a variável está sendo carregada

// Criar o aplicativo Express
const app = express();

// Middleware para tratar o corpo das requisições (req.body)
app.use(express.json());
app.use(cors());

console.log('Middleware executado');

// Conectar ao banco de dados MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Conectado ao MongoDB');
    })
    .catch((error) => {
        console.error('Erro ao conectar ao MongoDB', error);
    });

// Usar as rotas de autenticação
app.use("/auth", authRoutes);

// Rota para testar se o servidor está funcionando
app.get('/', (req, res) => {
    res.send('Servidor funcionando!');
});

// Iniciar o servidor na porta definida no arquivo .env
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

export default app;