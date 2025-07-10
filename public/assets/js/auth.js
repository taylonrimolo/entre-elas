// assets/js/auth.js

document.addEventListener('DOMContentLoaded', () => {
    // Função para login
    // Selecionando o formulário de login pelo ID 'form-login'
    const loginForm = document.getElementById('form-login');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(event) {
            event.preventDefault();

            const userInput = document.getElementById('login-username');
            const passInput = document.getElementById('login-password');
            const errorMsg = document.getElementById('error-msg');
            const successMsg = document.getElementById('success-msg');
            const submitBtn = document.getElementById('login-submit');

            const user = userInput.value.trim();
            const pass = passInput.value;

            errorMsg.classList.remove('hide');
            errorMsg.textContent = '';
            successMsg.classList.add('hide');
            successMsg.textContent = '';
            userInput.setAttribute('aria-invalid', 'false');
            passInput.setAttribute('aria-invalid', 'false');

            if (!user || !pass) {
                errorMsg.textContent = 'Por favor, preencha todos os campos.';
                if (!user) userInput.setAttribute('aria-invalid', 'true');
                if (!pass) passInput.setAttribute('aria-invalid', 'true');
                errorMsg.classList.remove('hide');
                errorMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
            }

            // Loader
            submitBtn.disabled = true;
            const originalText = submitBtn.textContent;
            submitBtn.innerHTML = 'Entrando <span class="button-loader"></span>';

            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: user, password: pass })
                });
                const data = await response.json();
                if (response.ok && data.token) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('username', user);
                    errorMsg.textContent = '';
                    errorMsg.classList.add('hide');
                    successMsg.textContent = 'Login realizado com sucesso! Redirecionando...';
                    successMsg.classList.remove('hide');
                    successMsg.focus && successMsg.focus();
                    setTimeout(() => {
                        window.location.href = '/pagina-principal';
                    }, 1200);
                } else {
                    errorMsg.textContent = data.error || 'Usuária ou senha inválidos.';
                    userInput.setAttribute('aria-invalid', 'true');
                    passInput.setAttribute('aria-invalid', 'true');
                    errorMsg.classList.remove('hide');
                    errorMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            } catch (err) {
                errorMsg.textContent = 'Erro de conexão com o servidor.';
                userInput.setAttribute('aria-invalid', 'true');
                passInput.setAttribute('aria-invalid', 'true');
                errorMsg.classList.remove('hide');
                errorMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
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
    // Selecionando o formulário de cadastro pelo ID 'form-cadastro'
    const cadastroForm = document.getElementById('form-cadastro');
    if (cadastroForm) {
        cadastroForm.addEventListener('submit', async function(event) {
            event.preventDefault();

            const user = document.getElementById('cadastro-username').value.trim();
            const pass = document.getElementById('cadastro-password').value;
            const confirm = document.getElementById('cadastro-confirm-password').value;
            const msg = document.getElementById('msg');
            const msgSuccess = document.getElementById('msg-success');
            const submitBtn = document.getElementById('cadastro-submit');

            msg.classList.remove('hide');
            msgSuccess.classList.add('hide');
            msg.textContent = '';
            msgSuccess.textContent = '';

            // Verifica se as senhas coincidem
            if (pass !== confirm) {
                msg.textContent = "As senhas não coincidem.";
                msg.className = "feedback error";
                msg.classList.remove('hide');
                msg.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
            }

            // Validação de requisitos de senha
            const senhaForte = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
            if (!senhaForte.test(pass)) {
                msg.textContent = "A senha deve ter pelo menos 6 caracteres, incluindo letra e número.";
                msg.className = "feedback error";
                msg.classList.remove('hide');
                msg.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
            }

            // Loader
            submitBtn.disabled = true;
            const originalText = submitBtn.textContent;
            submitBtn.innerHTML = 'Cadastrando <span class="button-loader"></span>';

            try {
                const response = await fetch('/cadastro', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: user, password: pass })
                });
                const data = await response.json();
                if (response.ok) {
                    msg.textContent = '';
                    msg.classList.add('hide');
                    msgSuccess.textContent = data.message;
                    msgSuccess.className = "feedback success";
                    msgSuccess.classList.remove('hide');
                    msgSuccess.focus && msgSuccess.focus();
                    cadastroForm.reset();
                    msgSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    setTimeout(() => {
                        window.location.href = '/login';
                    }, 1500);
                } else {
                    msg.textContent = data.error || 'Erro ao cadastrar usuária.';
                    msg.className = "feedback error";
                    msg.classList.remove('hide');
                    msg.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            } catch (err) {
                msg.textContent = 'Erro de conexão com o servidor.';
                msg.className = "feedback error";
                msg.classList.remove('hide');
                msg.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        });
    }

    // Função para alterar senha
    // Selecionando o formulário de alterar senha pelo ID 'alterarSenhaForm'
    // (Removido: agora está em profile.js)
});