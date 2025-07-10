// assets/js/utils.js

document.addEventListener('DOMContentLoaded', () => {
    // Lógica para Frases Motivacionais em loop
    const frases = [
        "Você é mais forte do que imagina.",
        "Cada passo é uma conquista.",
        "Acredite no seu poder de transformação.",
        "Juntas somos invencíveis.",
        "A cura começa aqui.",
        "Você merece paz e amor.",
        "Nunca desista de você mesma."
    ];

    const balloon = document.getElementById("motivationalBalloon");
    let index = 0;

    function showFrase() {
        if (!balloon) return; // Garante que o elemento existe
        balloon.textContent = frases[index];
        balloon.classList.add("show");

        setTimeout(() => {
            balloon.classList.remove("show");
            setTimeout(() => {
                index = (index + 1) % frases.length;
                showFrase();
            }, 1200); // Tempo para a frase desaparecer antes de mudar
        }, 1000); // Tempo que a frase fica visível
    }

    // Inicia a exibição das frases se o elemento existir
    if (balloon) {
        showFrase();
    }

    // Lógica para Toggle de contatos de emergência
    const emergenciaButton = document.querySelector('a.card-button[aria-label^="Contatos de emergência"]');
    const emergenciaInfo = document.getElementById('emergencia-info');

    if (emergenciaButton && emergenciaInfo) {
        emergenciaButton.addEventListener('click', (e) => {
            e.preventDefault(); // Evita que a página seja recarregada ou navegue para '#'
            const expanded = emergenciaButton.getAttribute('aria-expanded') === 'true';
            emergenciaButton.setAttribute('aria-expanded', String(!expanded));
            emergenciaInfo.hidden = expanded; // Altera a visibilidade do elemento
        });

        // Adiciona suporte a teclado para acessibilidade
        emergenciaButton.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                emergenciaButton.click(); // Simula o clique para ativar o toggle
            }
        });
    }
});