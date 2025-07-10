// assets/js/global.js

// Função para mostrar/ocultar senha
function togglePass(id, btn) {
  const input = document.getElementById(id);
  const isPass = input.type === 'password';
  input.type = isPass ? 'text' : 'password';
  btn.textContent = isPass ? '🙈' : '👁️';
}

// Função para verificar autenticação e proteger rotas
function requireAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
    }
}

// Função de logout seguro
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.href = 'login.html';
}

// Carrossel de depoimentos

document.addEventListener('DOMContentLoaded', function() {
  const slides = document.querySelectorAll('.carrossel .slide');
  const prevBtn = document.querySelector('.carrossel .prev');
  const nextBtn = document.querySelector('.carrossel .next');
  if (!slides.length || !prevBtn || !nextBtn) return;
  let current = 0;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('ativo', i === index);
    });
  }

  prevBtn.onclick = function() {
    current = (current - 1 + slides.length) % slides.length;
    showSlide(current);
  };

  nextBtn.onclick = function() {
    current = (current + 1) % slides.length;
    showSlide(current);
  };

  showSlide(current);
});