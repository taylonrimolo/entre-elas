// assets/js/global.js

// Função para mostrar/ocultar senha
function togglePass(inputId, button) {
    const input = document.getElementById(inputId);
    if (input.type === "password") {
        input.type = "text";
        button.textContent = "🙈"; // Ícone de olho riscado
        button.setAttribute('aria-label', 'Ocultar senha');
    } else {
        input.type = "password";
        button.textContent = "👁️"; // Ícone de olho
        button.setAttribute('aria-label', 'Mostrar senha');
    }
}