document.addEventListener('DOMContentLoaded', function() {
    const btnLimpar = document.getElementById('btnLimpar');

    btnLimpar.addEventListener('click', function() {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');

        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });

    });

    document.getElementById('login-form').addEventListener('submit', async function(event) {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('https://portal-x09e.onrender.com/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token); // Salva o token no localStorage
                alert('Login realizado com sucesso!');
                window.location.href = 'pages/home.html'; // Redireciona para a página protegida
            } else {
                const error = await response.json();
                alert(`Erro: ${error.message}`);
            }
        } catch (err) {
            console.error('Erro ao conectar ao servidor:', err);
            alert('Erro ao conectar ao servidor. Por favor, tente novamente mais tarde.');
        }
    });
});

/*function checkAuthentication() {
    const token = localStorage.getItem('token'); // Recupera o token do localStorage
    if (!token) {
        // Se o token não existir, redireciona para a página de login
        alert('Você precisa estar logado para acessar esta página.');
        window.location.href = '../index.html';
    } else {
        // Valide o token no backend para garantir que ele é válido
        fetch('https://portal-x09e.onrender.com/auth/validate-token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Token inválido ou expirado');
                }
            })
            .catch(() => {
                alert('Sessão expirada. Faça login novamente.');
                localStorage.removeItem('token'); // Remove o token inválido
                window.location.href = '../index.html';
            });
    }
}

// Chame a função em todas as páginas protegidas
checkAuthentication();*/

let logoutTimer;

// Função para deslogar o usuário
function logoutUser() {
    alert('Você foi deslogado devido à inatividade.');
    localStorage.removeItem('token'); // Remove o token do localStorage
    window.location.href = '../index.html'; // Redireciona para a página de login
}

// Função para resetar o timer de inatividade
function resetLogoutTimer() {
    clearTimeout(logoutTimer);
    logoutTimer = setTimeout(logoutUser, 15 * 60 * 1000); // 15 minutos de inatividade
}

// Reseta o timer em eventos de interação do usuário
window.onload = resetLogoutTimer;
document.onmousemove = resetLogoutTimer;
document.onkeypress = resetLogoutTimer;
document.onscroll = resetLogoutTimer;
