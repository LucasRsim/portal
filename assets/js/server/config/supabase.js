import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Carrega as variáveis de ambiente do seu arquivo .env
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

// Validação para garantir que as chaves foram configuradas no Render
if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("As variáveis de ambiente SUPABASE_URL e SUPABASE_SERVICE_KEY são obrigatórias.");
}

// Cria um cliente "admin" do Supabase.
// Ele usa a chave de serviço para ter permissões elevadas.
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

