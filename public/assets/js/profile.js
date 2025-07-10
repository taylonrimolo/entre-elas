// assets/js/profile.js

document.addEventListener('DOMContentLoaded', () => {
    // Função para alterar senha
    const alterarSenhaForm = document.getElementById('form-alterar-senha');
    if (alterarSenhaForm) {
        alterarSenhaForm.addEventListener('submit', async function(event) {
            event.preventDefault();

            const user = document.getElementById('alterar-username').value.trim();
            const oldPass = document.getElementById('alterar-old-password').value;
            const newPass = document.getElementById('alterar-new-password').value;
            const confirmNewPass = document.getElementById('alterar-confirm-password').value;
            const msg = document.getElementById('msgFeedback');
            const submitBtn = document.getElementById('alterar-submit');

            msg.classList.remove('hide');
            msg.textContent = '';
            msg.className = 'feedback'; // Reseta as classes

            // Validação de campos vazios
            if (!user || !oldPass || !newPass || !confirmNewPass) {
                msg.textContent = 'Preencha todos os campos.';
                msg.classList.add('error');
                msg.classList.remove('hide');
                msg.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
            }

            // Valida se as novas senhas coincidem
            if (newPass !== confirmNewPass) {
                msg.textContent = 'As novas senhas não coincidem.';
                msg.classList.add('error');
                msg.classList.remove('hide');
                msg.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
            }

            // Validação de requisitos de senha
            const senhaForte = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
            if (!senhaForte.test(newPass)) {
                msg.textContent = 'A nova senha deve ter pelo menos 6 caracteres, incluindo letra e número.';
                msg.classList.add('error');
                msg.classList.remove('hide');
                msg.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
            }

            // Loader
            submitBtn.disabled = true;
            const originalText = submitBtn.textContent;
            submitBtn.innerHTML = 'Alterando <span class="button-loader"></span>';

            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/alterar-senha', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        // 'Authorization': `Bearer ${token}` // (opcional, se backend exigir)
                    },
                    body: JSON.stringify({ username: user, oldPassword: oldPass, newPassword: newPass })
                });
                const data = await response.json();
                if (response.ok) {
                    msg.textContent = data.message;
                    msg.classList.add('success');
                    alterarSenhaForm.reset();
                    msg.classList.remove('hide');
                    msg.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    setTimeout(() => {
                        window.location.href = '/login';
                    }, 1500);
                } else {
                    msg.textContent = data.error || 'Erro ao alterar senha.';
                    msg.classList.add('error');
                    msg.classList.remove('hide');
                    msg.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            } catch (err) {
                msg.textContent = 'Erro de conexão com o servidor.';
                msg.classList.add('error');
                msg.classList.remove('hide');
                msg.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        });
    }
}); 