<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Sistema</title>
    
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Bootstrap Icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css">
    
    <!-- CSS personalizado -->
    <link rel="stylesheet" href="css/login.css">
    <meta name="csrf-token" content="{{ csrf_token() }}">


    
</head>
<body>
    <div class="login-container">
        <div class="login-card">
            <div class="login-header">
                <i class="bi bi-shield-lock login-logo"></i>
                <h1 class="h4 mb-0">Iniciar Sesión</h1>
                <p class="small mb-0">Ingresa tus credenciales</p>
            </div>
            
            <div class="login-body">
                <form id="loginForm">
                    <!-- Email -->
                    <div class="mb-3">
                        <label for="email" class="form-label">Email o Usuario</label>
                        <div class="input-group">
                            <span class="input-group-text">
                                <i class="bi bi-envelope"></i>
                            </span>
                            <input type="text" 
                                   class="form-control" 
                                   id="email" 
                                   placeholder="Email o Usuario"
                                   required>
                        </div>
                        <div class="invalid-feedback" id="email-error"></div>
                    </div>
                    
                    <!-- Password -->
                    <div class="mb-3">
                        <label for="password" class="form-label">Contraseña</label>
                        <div class="input-group">
                            <span class="input-group-text">
                                <i class="bi bi-lock"></i>
                            </span>
                            <input type="password" 
                                   class="form-control" 
                                   id="password" 
                                   placeholder="Tu contraseña"
                                   required>
                            <button class="btn btn-outline-secondary" type="button" id="togglePassword">
                                <i class="bi bi-eye"></i>
                            </button>
                        </div>
                        <div class="invalid-feedback" id="password-error"></div>
                    </div>
                    
                    <!-- Remember me -->
                    <div class="mb-3 form-check">
                        <input type="checkbox" class="form-check-input" id="remember">
                        <label class="form-check-label" for="remember">Recordarme</label>
                    </div>
                    
                    <!-- Submit -->
                    <div class="d-grid">
                        <button type="submit" class="btn btn-primary">
                            <span class="spinner-border spinner-border-sm d-none" id="spinner"></span>
                            <span id="submitText">Ingresar</span>
                        </button>
                    </div>
                </form>
            </div>
            
            <div class="login-footer text-center">
                <p class="small text-muted mb-0">&copy; 2026 PROGSAR</p>
            </div>
        </div>
    </div>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    
    <!-- JS personalizado -->
    <script src="js/login.js"></script>
</body>
</html>