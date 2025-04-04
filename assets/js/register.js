document.getElementById('register-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Evita o envio padrão do formulário

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('https://portal-x09e.onrender.com/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
        });

        if (response.ok) {
            alert('Cadastro realizado com sucesso!');
            // Redirecionar para a tela de login
            window.location.href = './index.html';
        } else {
            const error = await response.json();
            console.error('Erro no registro:', error);
            alert(`Erro: ${error.message}`);
        }
    } catch (err) {
        console.error('Erro ao conectar ao servidor:', err);
        alert('Erro ao conectar ao servidor. Por favor, tente novamente mais tarde.');
    }
});