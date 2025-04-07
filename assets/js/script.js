document.addEventListener('DOMContentLoaded', function() {
    const btnLimpar = document.getElementById('btnLimpar');

    btnLimpar.addEventListener('click', function() {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');

        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });

    });
});


// Chame a função em todas as páginas protegidas
checkAuthentication();

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
