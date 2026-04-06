<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <title>@yield('title', 'Progsar')</title>

   <meta name="csrf-token" content="{{ csrf_token() }}">

  {{-- CSS --}}
  <link rel="stylesheet" href="{{ asset('css/estilos.css') }}">
  <link
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
    rel="stylesheet">
  <link
    href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css"
    rel="stylesheet">
</head>

<body>


    <nav class="navbar navbar-expand-lg navbar-dark bg-danger">
        <div class="container-fluid">

            <!-- IZQUIERDA: Logo -->
            <a class="navbar-brand d-flex align-items-center" href="#">
            <img
                src="images/progsar.png"
                alt="Logo"
                width="150"
                height="36"
                class="me-2"
                style="border-radius: 5px;"
            />
            </a>

            <!-- Toggler -->
            <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarTop"
            aria-controls="navbarTop"
            aria-expanded="false"
            aria-label="Toggle navigation"
            >
            <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarTop">

            <!-- CENTRO: Menú -->
            <ul class="navbar-nav mx-auto mb-2 mb-lg-0 gap-lg-3">

                <li class="nav-item">
                <a class="nav-link" href="{{ url('/dashboard') }}" data-spa>
                    <i class="bi bi-house-door me-1"></i> Inicio
                </a>
                </li>

                <!-- Personas -->
                <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">
                    <i class="bi bi-people me-1"></i> Personas
                </a>
                <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="{{ url('/usuarios') }}" data-spa><i class="bi bi-person-badge me-1"></i> Usuarios</a></li>
                    <li><a class="dropdown-item" href="{{ url('/clientes') }}" data-spa><i class="bi bi-person-lines-fill me-1"></i> Clientes</a></li>
                    {{-- <li><a class="dropdown-item" href="#"><i class="bi bi-building me-1"></i> Clientes B2B</a></li> --}}
                </ul>
                </li>

                <!-- Almacén -->
                <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">
                    <i class="bi bi-box-seam me-1"></i> Almacén
                </a>
                <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="{{ url('/productos') }}" data-spa><i class="bi bi-box me-1"></i> Productos</a></li>
                    <li><a class="dropdown-item" href="{{ url('/proveedores') }}" data-spa><i class="bi bi-shop me-1"></i> Proveedores</a></li>
                    <li><a class="dropdown-item" href="{{ url('/categorias') }}" data-spa><i class="bi bi-tags me-1"></i> Categorías</a></li>
                    <li><a class="dropdown-item" href="{{ url('/marcas') }}" data-spa><i class="bi bi-award me-1"></i> Marcas</a></li>
                </ul>
                </li>

                <!-- Cotizaciones -->
                <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">
                    <i class="bi bi-file-earmark-text me-1"></i> Cotizaciones
                </a>
                <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="{{ url('/generar_cotizacion') }}" data-spa><i class="bi bi-plus-circle me-1"></i> Generar Cotización</a></li>
                    <li><a class="dropdown-item" href="{{ url('/cotizaciones') }}" data-spa><i class="bi bi-list-check me-1"></i> Registro de Cotizaciones</a></li>
                </ul>
                </li>

                <!-- Ventas -->
                <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">
                    <i class="bi bi-cash-coin me-1"></i> Ventas
                </a>
                <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="{{ url('/generar_venta') }}" data-spa><i class="bi bi-cart-check me-1"></i> Generar Venta</a></li>
                    <li><a class="dropdown-item" href="{{ url('/pre_registro_venta') }}" data-spa><i class="bi bi-calendar-day me-1"></i> Pre-Registro Venta</a></li>
                    <li><a class="dropdown-item" href="{{ url('/registro_venta') }}" data-spa><i class="bi bi-calendar-range me-1"></i> Registro de Ventas</a></li>
                    <li><a class="dropdown-item" href="{{ url('/ventas_anuladas') }}" data-spa><i class="bi bi-x-circle me-1"></i> Anulados</a></li>
                </ul>
                </li>

                <!-- Configuración -->
                <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">
                    <i class="bi bi-gear me-1"></i> Configuración
                </a>
                <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="#"><i class="bi bi-building me-1"></i> Datos de Empresa</a></li>
                    <li><a class="dropdown-item" href="#"><i class="bi bi-cloud-arrow-down me-1"></i> Backups</a></li>
                </ul>
                </li>

            </ul>

            <!-- DERECHA: Avatar -->
            <div class="dropdown">
                <a class="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
                href="#" data-bs-toggle="dropdown">
                <img
                    src="https://i.pravatar.cc/40?img=3"
                    alt="Avatar"
                    width="40"
                    height="40"
                    class="rounded-circle me-2 border border-light"
                />
                <span class="d-none d-lg-inline">Cuenta</span>
                </a>

                <ul class="dropdown-menu dropdown-menu-end">
                <li><a class="dropdown-item" href="#"><i class="bi bi-person-circle me-1"></i> Perfil</a></li>
                <li><hr class="dropdown-divider"></li>
                <li>
                    <a class="dropdown-item" href="#" id="btn-logout">
                        <i class="bi bi-box-arrow-right me-1"></i> Salir
                    </a>
                </li>
                </ul>
            </div>

            </div>
        </div>
    </nav>

    <main id="spa-app">
        @yield('content')
    </main>


    <script>
    (function () {
        const token = localStorage.getItem('auth_token');
        if (!token) {
        window.location.replace('/login');
        }
    })();
    </script>

  {{-- JS base --}}
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>

  {{-- JS propio --}}
  <script src="{{ asset('js/spa.js') }}"></script>

  @stack('scripts')
</body>
</html>
