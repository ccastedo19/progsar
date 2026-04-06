<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

Route::redirect('/', '/dashboard');
Route::get('/login', fn() => view('auth.login'))->name('login');

// Shell público
Route::get('/dashboard', fn() => view('pages.dashboard'));
Route::get('/usuarios', fn() => view('pages.usuarios'));
Route::get('/productos', fn() => view('pages.productos'));
Route::get('/clientes', fn() => view('pages.clientes'));
Route::get('/categorias', fn() => view('pages.categorias'));
Route::get('/marcas', fn() => view('pages.marcas'));
Route::get('/proveedores', fn() => view('pages.proveedores'));
Route::get('/generar_cotizacion', fn() => view('pages.generar_cotizacion'));
Route::get('/cotizaciones', fn() => view('pages.cotizaciones'));
Route::get('/generar_venta', fn() => view('pages.generar_venta'));
Route::get('/pre_registro_venta', fn() => view('pages.pre_registro_venta'));
Route::get('/ventas_anuladas', fn() => view('pages.ventas_anuladas'));
Route::get('/registro_venta', fn() => view('pages.registro_venta'));

// Partials protegidos
Route::middleware('auth:sanctum')->prefix('spa')->group(function () {
    Route::get('/dashboard', fn() => response()->view('partials.dashboard'));
    Route::get('/usuarios', fn() => response()->view('partials.usuarios'));
    Route::get('/productos', fn() => response()->view('partials.productos'));
    Route::get('/clientes', fn() => response()->view('partials.clientes'));
    Route::get('/categorias', fn() => response()->view('partials.categorias'));
    Route::get('/marcas', fn() => response()->view('partials.marcas'));
    Route::get('/proveedores', fn() => response()->view('partials.proveedores'));
    Route::get('/generar_cotizacion', fn() => response()->view('partials.generar_cotizacion'));
    Route::get('/cotizaciones', fn() => response()->view('partials.cotizaciones'));
    Route::get('/generar_venta', fn() => response()->view('partials.generar_venta'));
    Route::get('/pre_registro_venta', fn() => response()->view('partials.pre_registro_venta'));
    Route::get('/ventas_anuladas', fn() => response()->view('partials.ventas_anuladas'));
    Route::get('/registro_venta', fn() => response()->view('partials.registro_venta'));
});
