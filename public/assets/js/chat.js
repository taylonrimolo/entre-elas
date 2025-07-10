// assets/js/chat.js

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Sessão expirada. Faça login novamente.');
        window.location.href = 'login.html';
        return;
    }
    // Função para decodificar o token JWT e pegar o username
    function getUsernameFromToken(token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.username;
        } catch (e) { return ''; }
    }
    let nomeReal = getUsernameFromToken(token) || localStorage.getItem('username') || '';
    let username = '';
    // Modal de escolha
    const modal = document.getElementById('modal-nome-chat');
    const btnNome = document.getElementById('btn-nome-real');
    const btnAnonima = document.getElementById('btn-anonima');
    function escolherNome(nome) {
        username = nome;
        modal.style.display = 'none';
        iniciarChat();
    }
    btnNome.onclick = () => escolherNome(nomeReal);
    btnAnonima.onclick = () => escolherNome('Anônima');
    // Só inicia o chat após escolha
    function iniciarChat() {
        const socket = io({ auth: { token } });
        const form = document.getElementById('chat-form');
        const input = document.getElementById('chat-input');
        const messages = document.getElementById('chat-messages');
        const usernameDisplay = document.getElementById('user-logado');
        const statusDisplay = document.getElementById('chat-status');
        usernameDisplay.textContent = 'Usuária: ' + username;
        input.focus();
        function setStatus(msg, success = true) {
            if (!statusDisplay) return;
            statusDisplay.textContent = msg;
            statusDisplay.style.color = success ? 'var(--texto-success, #28a745)' : 'var(--texto-error, #e63946)';
            setTimeout(() => { statusDisplay.textContent = ''; }, 3000);
        }
        setStatus('Conectada ao chat!', true);
        socket.on('connect', () => setStatus('Conectada ao chat!', true));
        socket.on('disconnect', () => setStatus('Desconectada!', false));
        socket.on('connect_error', (err) => {
            alert('Sessão expirada ou inválida. Faça login novamente.');
            logout();
        });
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (input.value.trim()) {
                socket.emit('chat message', { text: input.value, user: username, id: socket.id });
                input.value = '';
                input.focus();
            }
        });
        function addMessageToChat(data, isMyMessage) {
            const item = document.createElement('li');
            item.setAttribute('tabindex', '0');
            if (isMyMessage) {
                item.innerHTML = `<strong>Você:</strong> ${data.text}`;
                item.classList.add('my-message');
            } else {
                item.innerHTML = `<strong>${data.user}:</strong> ${data.text}`;
                item.classList.add('other-message');
            }
            messages.appendChild(item);
            messages.scrollTop = messages.scrollHeight;
            item.focus();
        }
        socket.on('chat message', (data) => {
            addMessageToChat(data, data.id === socket.id);
        });
        socket.on('history', (history) => {
            messages.innerHTML = '';
            history.forEach(data => {
                addMessageToChat(data, data.id === socket.id);
            });
            messages.scrollTop = messages.scrollHeight;
        });
    }
}); 