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

    document.getElementById("current-year").textContent = new Date().getFullYear();
});