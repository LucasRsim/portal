import express from 'express';
import { supabaseAdmin } from '../config/supabase.js';

const router = express.Router();

// Rota para aprovar um usuário.
// No futuro, podemos adicionar um middleware para garantir que apenas um admin possa chamar esta rota.
router.post('/approve-user', async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ error: 'O ID do usuário (userId) é obrigatório.' });
    }

    try {
        // Usa o cliente admin para atualizar a tabela 'profiles'
        const { data, error } = await supabaseAdmin
            .from('profiles')
            .update({ is_approved: true })
            .eq('id', userId)
            .select()
            .single();

        if (error) {
            // Se o Supabase retornar um erro (ex: usuário não encontrado), lança o erro.
            throw error;
        }

        if (!data) {
             return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        res.status(200).json({ message: 'Usuário aprovado com sucesso!', user: data });

    } catch (error) {
        console.error('Erro ao aprovar usuário:', error);
        res.status(500).json({ error: 'Erro interno do servidor ao aprovar usuário.', details: error.message });
    }
});

export default router;

