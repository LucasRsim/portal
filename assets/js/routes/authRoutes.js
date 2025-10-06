// server/routes/authRoutes.js

import express from 'express';
import { supabase } from '../config/supabase.js'; // Cliente admin do Supabase

const router = express.Router();

// Rota para um admin aprovar um usuário
// Futuramente, esta rota deve ser protegida para que apenas admins possam chamá-la.
router.post('/approve-user', async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ message: 'O ID do usuário é obrigatório.' });
    }

    try {
        // Atualiza a tabela 'profiles' para marcar o usuário como aprovado
        const { data, error } = await supabase
            .from('profiles')
            .update({ is_approved: true })
            .eq('id', userId)
            .select();

        if (error) {
            throw error;
        }

        if (data.length === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        res.status(200).json({ message: 'Usuário aprovado com sucesso!', user: data[0] });

    } catch (error) {
        console.error('Erro ao aprovar usuário:', error);
        res.status(500).json({ message: 'Erro no servidor ao aprovar usuário.' });
    }
});

export default router;
