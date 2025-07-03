// assets/js/auth.js

document.addEventListener('DOMContentLoaded', () => {
    // Função para login
    // Selecionando o formulário de login pelo ID 'loginForm'
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const userInput = document.getElementById('username');
            const passInput = document.getElementById('password');
            const errorMsg = document.getElementById('error-msg');

            const user = userInput.value.trim();
            const pass = passInput.value;

            errorMsg.textContent = '';
            userInput.setAttribute('aria-invalid', 'false');
            passInput.setAttribute('aria-invalid', 'false');

            if (!user || !pass) {
                errorMsg.textContent = 'Por favor, preencha todos os campos.';
                if (!user) userInput.setAttribute('aria-invalid', 'true');
                if (!pass) passInput.setAttribute('aria-invalid', 'true');
                return;
            }

            // Acessando o localStorage para verificar as credenciais
            const storedPass = localStorage.getItem(user);

            if (storedPass && storedPass === pass) {
                errorMsg.textContent = '';
                // Redireciona para a página principal após login bem-sucedido
                window.location.href = 'pagina-principal.html';
            } else {
                errorMsg.textContent = 'Usuária ou senha inválidos.';
                userInput.setAttribute('aria-invalid', 'true');
                passInput.setAttribute('aria-invalid', 'true');
            }
        });

        // Auto-preenche com último usuário salvo
        const lastUser = localStorage.getItem('lastUser');
        if (lastUser) {
            const usernameInput = document.getElementById('username');
            if (usernameInput) {
                usernameInput.value = lastUser;
            }
        }
    }

    // Função para cadastro
    // Assumindo que é o único formulário em cadastro.html, ou adicione um ID a ele.
    const cadastroForm = document.querySelector('form');
    if (cadastroForm) {
        cadastroForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const user = document.getElementById('newUser').value.trim();
            const pass = document.getElementById('newPass').value;
            const confirm = document.getElementById('confirmPass').value;
            const msg = document.getElementById('msg');

            // Verifica se as senhas coincidem
            if (pass !== confirm) {
                msg.textContent = "As senhas não coincidem.";
                msg.className = "feedback error";
                return;
            }

            // Verifica se a usuária já existe no localStorage
            if (localStorage.getItem(user)) {
                msg.textContent = "Essa usuária já existe.";
                msg.className = "feedback error";
            } else {
                // Salva a nova usuária e senha no localStorage
                localStorage.setItem(user, pass);
                localStorage.setItem('lastUser', user); // Salva para o auto-complete no login
                msg.textContent = "Usuária cadastrada com sucesso!";
                msg.className = "feedback success";
                cadastroForm.reset(); // Limpa o formulário
                // Redireciona para a página de login após o cadastro
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1500);
            }
        });
    }

    // Função para alterar senha
    // Selecionando o formulário de alterar senha pelo ID 'alterarSenhaForm'
    const alterarSenhaForm = document.getElementById('alterarSenhaForm');
    if (alterarSenhaForm) {
        alterarSenhaForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const user = document.getElementById('user').value.trim();
            const oldPass = document.getElementById('oldPass').value;
            const newPass = document.getElementById('newPass').value;
            const confirmNewPass = document.getElementById('confirmNewPass').value;
            const msg = document.getElementById('msgFeedback');

            msg.textContent = '';
            msg.className = 'feedback'; // Reseta as classes

            // Validação de campos vazios
            if (!user || !oldPass || !newPass || !confirmNewPass) {
                msg.textContent = 'Preencha todos os campos.';
                msg.classList.add('error');
                return;
            }

            // Busca a senha antiga no localStorage
            const storedPass = localStorage.getItem(user);

            // Valida se a usuária existe
            if (!storedPass) {
                msg.textContent = 'Usuária não encontrada.';
                msg.classList.add('error');
                return;
            }

            // Valida se a senha antiga está correta
            if (storedPass !== oldPass) {
                msg.textContent = 'Senha antiga incorreta.';
                msg.classList.add('error');
                return;
            }

            // Valida se as novas senhas coincidem
            if (newPass !== confirmNewPass) {
                msg.textContent = 'As novas senhas não coincidem.';
                msg.classList.add('error');
                return;
            }

            // Atualiza a senha no localStorage
            localStorage.setItem(user, newPass);

            msg.textContent = 'Senha alterada com sucesso!';
            msg.classList.add('success');

            event.target.reset(); // Limpa o formulário

            // Redireciona para a página de login
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        });
    }
});