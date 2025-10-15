import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares essenciais
app.use(cors()); // Permite que seu frontend se comunique com este backend
app.use(express.json()); // Permite que o servidor entenda JSON

// Rota principal da API
app.get('/api', (req, res) => {
  res.send('API do Portal RSim está no ar!');
});

// Usa as rotas de autenticação que criamos
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
