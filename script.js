document.addEventListener('DOMContentLoaded', () => {
    // Seletores de Formulários
    const loginFormContainer = document.getElementById('login-form');
    const registerFormContainer = document.getElementById('register-form');
    const forgotFormContainer = document.getElementById('forgot-form');

    // Seletores de Links para troca
    const registerLink = document.querySelector('.register-link');
    const loginLinks = document.querySelectorAll('.login-link');
    const forgotPasswordLink = document.querySelector('.forgot-password-link');

    // Seletores de Elementos de Interação
    const togglePasswordIcons = document.querySelectorAll('.toggle-password');
    const registerPasswordInput = document.getElementById('register-password');
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const formMessage = document.getElementById('form-message');
    const submitButtons = document.querySelectorAll('.btn-submit');

    // --- LÓGICA PARA TROCAR DE FORMULÁRIO ---
    const showForm = (formToShow) => {
        [loginFormContainer, registerFormContainer, forgotFormContainer].forEach(form => {
            form.classList.add('hidden');
        });
        formToShow.classList.remove('hidden');
    };

    registerLink.addEventListener('click', (e) => {
        e.preventDefault();
        showForm(registerFormContainer);
    });

    forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        showForm(forgotFormContainer);
    });

    loginLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            showForm(loginFormContainer);
        });
    });

    // --- LÓGICA PARA ALTERNAR VISIBILIDADE DA SENHA ---
    togglePasswordIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            const input = icon.previousElementSibling;
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            }
        });
    });

    // --- LÓGICA PARA FORÇA DA SENHA ---
    const checkPasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.match(/[a-z]/)) strength++;
        if (password.match(/[A-Z]/)) strength++;
        if (password.match(/[0-9]/)) strength++;
        if (password.match(/[^a-zA-Z0-9]/)) strength++;

        switch (strength) {
            case 0:
            case 1:
            case 2:
                strengthBar.style.width = '33%';
                strengthBar.style.backgroundColor = 'var(--color-error)';
                strengthText.textContent = 'Força: Fraca';
                break;
            case 3:
            case 4:
                strengthBar.style.width = '66%';
                strengthBar.style.backgroundColor = '#f0ad4e'; // Amarelo
                strengthText.textContent = 'Força: Média';
                break;
            case 5:
                strengthBar.style.width = '100%';
                strengthBar.style.backgroundColor = 'var(--color-success)';
                strengthText.textContent = 'Força: Forte';
                break;
        }
    };

    if (registerPasswordInput) {
        registerPasswordInput.addEventListener('input', () => {
            checkPasswordStrength(registerPasswordInput.value);
            validatePasswords();
        });
    }
    
    // --- LÓGICA DE VALIDAÇÃO ---
    const validateEmail = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    const setValidationState = (input, isValid) => {
        const inputGroup = input.parentElement;
        inputGroup.classList.remove('success', 'error');
        if (isValid) {
            inputGroup.classList.add('success');
        } else {
            inputGroup.classList.add('error');
        }
    }
    
    const validatePasswords = () => {
        const passwordsMatch = registerPasswordInput.value === confirmPasswordInput.value && confirmPasswordInput.value !== '';
        setValidationState(confirmPasswordInput, passwordsMatch);
        return passwordsMatch;
    };

    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', validatePasswords);
    }
    
    // --- LÓGICA DE SUBMISSÃO SIMULADA ---
    submitButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const form = button.closest('form');
            const currentFormContainer = button.closest('.form-container');
            const messageContainer = currentFormContainer.querySelector('.form-message') || document.getElementById('form-message'); // Fallback para cadastro

            // Validação simples para exemplo
            let isValid = true;
            form.querySelectorAll('input[required]').forEach(input => {
                if (!input.value) {
                    isValid = false;
                    setValidationState(input, false);
                } else {
                     setValidationState(input, true);
                }
            });
            
            if (currentFormContainer.id === 'register-form' && !validatePasswords()) {
                isValid = false;
            }

            if (isValid) {
                button.classList.add('loading');
                if(messageContainer) messageContainer.textContent = '';

                setTimeout(() => {
                    button.classList.remove('loading');
                    if (messageContainer) {
                        messageContainer.textContent = 'Operação realizada com sucesso!';
                        messageContainer.className = 'form-message success';
                    }
                     // Limpar formulário após sucesso
                    form.reset();
                    form.querySelectorAll('.input-group').forEach(ig => ig.classList.remove('success', 'error'));
                    if(strengthBar) strengthBar.style.width = '0%';
                    if(strengthText) strengthText.textContent = '';

                }, 2000); // Simula 2 segundos de loading
            } else {
                 if (messageContainer) {
                    messageContainer.textContent = 'Por favor, corrija os campos em vermelho.';
                    messageContainer.className = 'form-message error';
                 }
            }
        });
    });
});
