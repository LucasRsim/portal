document.getElementById('register-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Evita o envio padrão do formulário

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:5000/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
        });

        if (response.ok) {
            alert('Cadastro realizado com sucesso!');
            // Redirecionar para a tela de login
            window.location.href = '../../../index.html';
        } else {
            const error = await response.json();
            alert(`Erro: ${error.message}`);
        }
    } catch (err) {
        console.error('Erro ao cadastrar:', err);
        alert('Erro ao conectar ao servidor.');
    }
});