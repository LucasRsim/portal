document.getElementById('reset-password-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const password = document.getElementById('password').value;
    const token = new URLSearchParams(window.location.search).get('token');

    try {
        const response = await fetch(`https://portal-x09e.onrender.com/auth/reset-password/${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password }),
        });

        if (response.ok) {
            alert('Senha redefinida com sucesso!');
            window.location.href = '../index.html';
        } else {
            const error = await response.json();
            alert(`Erro: ${error.message}`);
        }
    } catch (err) {
        console.error('Erro ao conectar ao servidor:', err);
        alert('Erro ao conectar ao servidor. Por favor, tente novamente mais tarde.');
    }
});