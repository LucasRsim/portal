// Este arquivo contém o código JavaScript que gerencia a interação do usuário com a tela de login.

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('login-form').addEventListener('submit', async function(event) {
        event.preventDefault(); // Evita o envio padrão do formulário

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('http://localhost:5000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                alert('Login realizado com sucesso!');
                console.log('Token:', data.token); // Exemplo: Salve o token no localStorage
                // Redirecionar para a página principal
                window.location.href = '../../pages/index.html'; // Altere o caminho conforme necessário
            } else {
                const error = await response.json();
                alert(`Erro: ${error.message}`);
            }
        } catch (err) {
            console.error('Erro ao fazer login:', err);
            alert('Erro ao conectar ao servidor.');
        }
    });
});