// login.js
document.addEventListener('DOMContentLoaded', function() {
    const existing = localStorage.getItem('auth_token');
    const existingUser = localStorage.getItem('auth_user');

    if (existing && existingUser) {
    window.location.href = '/dashboard';
    return;
    }

// si hay token pero no user (estado inconsistente)
if (existing && !existingUser) {
  localStorage.removeItem('auth_token');
}

    const form = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const submitBtn = form.querySelector('button[type="submit"]');
    const spinner = document.getElementById('spinner');
    const submitText = document.getElementById('submitText');

    // Validación de email
    function validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    // Mostrar/ocultar contraseña
    togglePasswordBtn.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        const icon = this.querySelector('i');
        icon.className = type === 'password' ? 'bi bi-eye' : 'bi bi-eye-slash';
    });

    // Validar formulario
    function validateForm() {
        let isValid = true;
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email) {
        showError(emailInput, 'El email o usuario es requerido');
            isValid = false;
        } else if (!validateLogin(email)) {
            showError(emailInput, 'Email o usuario no válido');
            isValid = false;
        } else {
            clearError(emailInput);
        }


        // Validar contraseña
        if (!password) {
            showError(passwordInput, 'La contraseña es requerida');
            isValid = false;
        } else if (password.length < 6) {
            showError(passwordInput, 'Mínimo 6 caracteres');
            isValid = false;
        } else {
            clearError(passwordInput);
        }

        return isValid;
    }

    // Mostrar error
    function showError(input, message) {
        input.classList.add('is-invalid');
        const errorElement = document.getElementById(input.id + '-error');
        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    // Limpiar error
    function clearError(input) {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
        const errorElement = document.getElementById(input.id + '-error');
        if (errorElement) {
            errorElement.textContent = '';
        }
    }

    // Mostrar loading
    function showLoading() {
        submitBtn.disabled = true;
        spinner.classList.remove('d-none');
        submitText.textContent = 'Verificando...';
    }

    // Ocultar loading
    function hideLoading() {
        submitBtn.disabled = false;
        spinner.classList.add('d-none');
        submitText.textContent = 'Ingresar';
    }

    const TOKEN_KEY = 'auth_token';
    const USER_KEY  = 'auth_user';

    function saveToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
    }

    function saveUser(usuario) {
    const payload = {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        telefono: usuario.telefono,
        id_rol: usuario.id_rol,
        estado: usuario.estado,
    };
    localStorage.setItem(USER_KEY, JSON.stringify(payload));
    }

    function getCsrfToken() {
        const el = document.querySelector('meta[name="csrf-token"]');
        return el ? el.getAttribute('content') : '';
    }

    async function apiLogin(email, password) {
    const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-CSRF-TOKEN': getCsrfToken(), // no rompe nada; útil si web middleware aplica
        },
       body: JSON.stringify({
        login: email,       // aquí mandas el email en el campo que pide el backend
        password,
        device_name: 'web'
        })
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        // Mensaje típico de Laravel validation: data.errors o data.message
        const msg =
        (data?.errors?.login && data.errors.login[0]) ||
        (data?.errors?.email && data.errors.email[0]) ||
        data?.message ||
        'No se pudo iniciar sesión';

        throw new Error(msg);
    }

    return data; // { token, token_type, usuario }
    }

    // Manejar submit
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        
        showLoading();
        
        try {
           const result = await apiLogin(email, password);

            saveToken(result.token);
            saveUser(result.usuario);

            window.location.href = '/dashboard'

            
            // En un caso real, redirigirías al dashboard
            // window.location.href = '/dashboard';
            
        } catch (error) {
            // Mostrar mensaje de error
            alert(error.message);
            
            // Resaltar campos con error
            showError(emailInput, 'Credenciales incorrectas');
            showError(passwordInput, 'Credenciales incorrectas');
            
        } finally {
            hideLoading();
        }
    });

    function isEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    function isUsername(value) {
        // letras, números, punto y guion bajo, mínimo 3
        return /^[a-zA-Z0-9._]{3,}$/.test(value);
    }

    function validateLogin(value) {
        return isEmail(value) || isUsername(value);
    }


    // Validación en tiempo real LOGIN (email o usuario)
    emailInput.addEventListener('blur', function () {
        const login = this.value.trim();

        if (!login) {
            showError(this, 'El email o usuario es requerido');
            return;
        }

        if (!validateLogin(login)) {
            showError(this, 'Ingresa un email o usuario válido');
            return;
        }

        clearError(this);
    });


    passwordInput.addEventListener('blur', function() {
        const password = this.value.trim();
        if (password && password.length < 6) {
            showError(this, 'Mínimo 6 caracteres');
        } else if (password) {
            clearError(this);
        }
    });
});