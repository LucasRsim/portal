// Importa o cliente Supabase do nosso arquivo centralizado
import { supabase } from './supabase_client.js';

// Função para exibir notificações ao usuário
function showNotification(message, type = 'info') {
    alert(message);
    console.log(`[${type.toUpperCase()}]`, message);
}

// --- LÓGICA PARA AS PÁGINAS DE AUTENTICAÇÃO ---

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const forgotPasswordForm = document.getElementById('forgot-password-form');
    const resetPasswordForm = document.getElementById('reset-password-form');

    // --- Manipulador de Login ---
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = e.target.email.value;
            const password = e.target.password.value;

            const { data: { user, session }, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) {
                return showNotification(`Erro no login: ${error.message}`, 'error');
            }

            if (session) {
                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('is_approved')
                    .eq('id', user.id)
                    .single();

                if (profileError) {
                    return showNotification(`Erro ao buscar perfil: ${profileError.message}`, 'error');
                }

                if (profile.is_approved) {
                    showNotification('Login realizado com sucesso!');
                    window.location.href = '/pages/home.html';
                } else {
                    await supabase.auth.signOut();
                    showNotification('Seu cadastro ainda não foi aprovado por um administrador.', 'warning');
                }
            }
        });
    }

    // --- Manipulador de Registro ---
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = e.target.name.value;
            const email = e.target.email.value;
            const password = e.target.password.value;

            const { error } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        full_name: name
                    }
                }
            });

            if (error) {
                return showNotification(`Erro no registro: ${error.message}`, 'error');
            }
            showNotification('Cadastro realizado! Por favor, verifique seu e-mail para confirmar a conta.');
        });
    }

    // --- Manipulador de "Esqueci a Senha" ---
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = e.target.email.value;

            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/pages/reset-password.html`,
            });

            if (error) {
                return showNotification(`Erro: ${error.message}`, 'error');
            }
            showNotification('Se um usuário com este e-mail existir, um link de redefinição de senha será enviado.');
        });
    }
    
    // --- [CORRIGIDO] Manipulador da Página de Redefinição de Senha ---
    if (resetPasswordForm) {
        // O Supabase já terá processado o token da URL assim que a página carregar.
        // Nós apenas precisamos adicionar o listener ao formulário imediatamente.
        resetPasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const newPassword = e.target.password.value;

            // Esta função só funcionará se houver uma sessão de recuperação de senha ativa
            const { error } = await supabase.auth.updateUser({
              password: newPassword
            });

            if (error) {
                return showNotification(`Erro ao redefinir a senha: ${error.message}`, 'error');
            }
            
            showNotification('Senha alterada com sucesso! Você será redirecionado para a tela de login.');
            window.location.href = '/index.html'; // Redireciona para o login
        });
    }
});

// --- FIM DA LÓGICA DE AUTENTICAÇÃO ---