document.addEventListener('DOMContentLoaded', function() {
    const btnLimpar = document.getElementById('btnLimpar');

    btnLimpar.addEventListener('click', function() {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');

        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });

    });
});
