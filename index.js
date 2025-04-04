import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import mongoose from 'mongoose';
import connectDB from './assets/js/config/db.js';
import User from './assets/js/models/User.js';
import authController from './assets/js/controllers/authController.js';
import authMiddleware from './assets/js/middleware/authMiddleware.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import authRoutes from './assets/js/routes/authRoutes.js';

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

// Middleware para logar os métodos e URLs das requisições
app.use((req, res, next) => {
  console.log(`Requisição recebida: ${req.method} ${req.url}`);
  next();
});

// Configure o CORS para permitir o domínio do frontend
app.use(cors({
  origin: 'https://lucasrsim.github.io', // Substitua pelo domínio do GitHub Pages
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

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

// URL da API
const API_URL = 'https://portal-x09e.onrender.com'; // Substitua pela URL do Render

// Iniciar o servidor na porta definida no arquivo .env
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

export default app;