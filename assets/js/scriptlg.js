// public/assets/js/auth.js

import { createClient } from '[https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm](https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm)';

// --- CONFIGURAÇÃO ---
// Crie um arquivo 'config.js' ou coloque suas chaves aqui.
// É seguro expor a ANON_KEY no frontend.
const SUPABASE_URL = ''; 
const SUPABASE_ANON_KEY = 'SUA_CHAVE_ANON_SUPABASE';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- LÓGICA ---
document.addEventListener('DOMContentLoaded', () => {

    // Formulário de Login
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = loginForm.querySelector('#email').value;
            const password = loginForm.querySelector('#password').value;

            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) {
                alert('Erro no login: ' + error.message);
            } else {
                // Precisamos verificar se o usuário está aprovado
                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('is_approved')
                    .eq('id', data.user.id)
                    .single();

                if (profileError || !profile) {
                     await supabase.auth.signOut(); // Desloga se não encontrar o perfil
                     alert('Erro ao verificar perfil. Tente novamente.');
                } else if (!profile.is_approved) {
                    await supabase.auth.signOut(); // Desloga o usuário não aprovado
                    alert('Seu cadastro ainda não foi aprovado por um administrador.');
                } else {
                    alert('Login realizado com sucesso!');
                    window.location.href = '/pages/home.html'; // Redireciona para a home
                }
            }
        });
    }

    // Formulário de Registro
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = registerForm.querySelector('#name').value;
            const email = registerForm.querySelector('#email').value;
            const password = registerForm.querySelector('#password').value;

            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        name: name // Estes dados serão usados pelo trigger no banco
                    }
                }
            });

            if (error) {
                alert('Erro no registro: ' + error.message);
            } else {
                alert('Registro realizado! Verifique seu e-mail para confirmação e aguarde a aprovação de um administrador.');
                window.location.href = '/index.html'; // Volta para a página de login
            }
        });
    }

    // Formulário de "Esqueci minha senha"
    const forgotPasswordForm = document.getElementById('forgot-password-form');
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = forgotPasswordForm.querySelector('#email').value;
            
            const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: 'URL_DA_SUA_PAGINA_DE_RESETAR_SENHA', // Ex: [https://seusite.com/reset-password.html](https://seusite.com/reset-password.html)
            });

            if (error) {
                alert('Erro: ' + error.message);
            } else {
                alert('Se o e-mail estiver cadastrado, um link para redefinir a senha foi enviado.');
            }
        });
    }

    // Formulário para redefinir a senha (na página de reset)
    const resetPasswordForm = document.getElementById('reset-password-form');
    if (resetPasswordForm) {
        resetPasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const password = resetPasswordForm.querySelector('#password').value;

            const { data, error } = await supabase.auth.updateUser({ password: password });

            if (error) {
                alert('Erro ao redefinir a senha: ' + error.message);
            } else {
                alert('Senha redefinida com sucesso!');
                window.location.href = '/index.html';
            }
        });
    }
});
