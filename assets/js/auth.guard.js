import { supabase } from './supabase-client.js';

// Função que retorna uma Promessa resolvida quando a verificação terminar
const checkAuth = () => {
  return new Promise((resolve) => {
    supabase.auth.onAuthStateChange((event, session) => {
      // Se o evento for SIGNED_IN, sabemos que há um usuário.
      if (session && session.user) {
        resolve(true); // Usuário está logado.
      } else {
        // Se não houver sessão, o usuário não está logado.
        resolve(false);
      }
    }).unsubscribe(); // Nos desinscrevemos para não ficar escutando para sempre.
  });
};


// Função principal auto-executável para proteger a página
(async () => {
    // Primeiro, verifica a sessão rapidamente. Isso funciona se o usuário acabou de logar.
    const { data: { session } } = await supabase.auth.getSession();

    if (session) {
        // Se a sessão já existe, permite o acesso.
        return;
    }

    // Se não houver sessão imediata, usa a verificação mais robusta.
    const isLoggedIn = await checkAuth();
    if (!isLoggedIn) {
        console.warn('Nenhum usuário logado. Redirecionando para a página de login.');
        alert('Acesso negado. Por favor, faça o login para continuar.');
        window.location.href = '/index.html'; // Certifique-se que o caminho está correto
    }
})();

// --- FIM DA LÓGICA DE AUTENTICAÇÃO ---