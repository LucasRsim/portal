import { supabase } from './supabase-client.js';

// Função auto-executável para proteger a página
(async () => {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        // Se NÃO houver sessão (usuário não logado), redireciona para a página de login
        alert('Acesso negado. Por favor, faça o login.');
        window.location.href = '/index.html'; // Altere para a sua página de login
    }
    // Se houver uma sessão, o script termina e a página carrega normalmente.
})();
