<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UsuarioController;
use App\Http\Controllers\Api\ClienteController;
use App\Http\Controllers\Api\CategoriaController;
use App\Http\Controllers\Api\MarcaController;
use App\Http\Controllers\Api\ProveedorController;
use App\Http\Controllers\Api\ProductoController;
use App\Http\Controllers\Api\CotizacionController;
use App\Http\Controllers\Api\VentaController;



Route::post('/login', [AuthController::class, 'login']);

//login
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

//usuario
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/usuarios', [UsuarioController::class, 'index']);
    Route::post('/usuarios', [UsuarioController::class, 'store']);
    Route::get('/usuarios/{id}', [UsuarioController::class, 'show']);
    Route::put('/usuarios/{id}', [UsuarioController::class, 'update']);
    Route::patch('/usuarios/{id}/estado', [UsuarioController::class, 'updateEstado']);
    Route::delete('/usuarios/{id}', [UsuarioController::class, 'destroy']);
});

//clientes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/clientes', [ClienteController::class, 'index']);
    Route::post('/clientes', [ClienteController::class, 'store']);
    Route::get('/clientes/{id_cliente}', [ClienteController::class, 'show']);
    Route::put('/clientes/{id_cliente}', [ClienteController::class, 'update']);
    Route::patch('/clientes/{id_cliente}/estado', [ClienteController::class, 'updateEstado']);

    // Opcional (si quieres endpoint dedicado para b2b)
    Route::patch('/clientes/{id_cliente}/b2b', [ClienteController::class, 'updateB2B']);

    Route::delete('/clientes/{id_cliente}', [ClienteController::class, 'destroy']);
});


//categoria
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/categorias', [CategoriaController::class, 'index']);
    Route::post('/categorias', [CategoriaController::class, 'store']);
    Route::get('/categorias/{id}', [CategoriaController::class, 'show']);
    Route::put('/categorias/{id}', [CategoriaController::class, 'update']);
    Route::patch('/categorias/{id}/estado', [CategoriaController::class, 'updateEstado']);
    Route::delete('/categorias/{id}', [CategoriaController::class, 'destroy']);
});

//marcas
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/marcas', [MarcaController::class, 'index']);
    Route::post('/marcas', [MarcaController::class, 'store']);
    Route::get('/marcas/{id}', [MarcaController::class, 'show']);
    Route::put('/marcas/{id}', [MarcaController::class, 'update']);
    Route::patch('/marcas/{id}/estado', [MarcaController::class, 'updateEstado']);
    Route::delete('/marcas/{id}', [MarcaController::class, 'destroy']);
});

//proveedores
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/proveedores', [ProveedorController::class, 'index']);
    Route::post('/proveedores', [ProveedorController::class, 'store']);
    Route::get('/proveedores/{id}', [ProveedorController::class, 'show']);
    Route::put('/proveedores/{id}', [ProveedorController::class, 'update']);
    Route::delete('/proveedores/{id}', [ProveedorController::class, 'destroy']);
});

//productos
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/productos', [ProductoController::class, 'index']);
    Route::post('/productos', [ProductoController::class, 'store']);
    Route::get('/productos/{id}', [ProductoController::class, 'show']);
    Route::put('/productos/{id}', [ProductoController::class, 'update']);
    Route::patch('/productos/{id}/estado', [ProductoController::class, 'updateEstado']);
    Route::delete('/productos/{id}', [ProductoController::class, 'destroy']);
});


//cotizaciones
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/cotizaciones', [CotizacionController::class, 'index']);
    Route::get('/cotizaciones/{id}', [CotizacionController::class, 'show']);
    Route::post('/cotizaciones', [CotizacionController::class, 'store']);

});

//ventas
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/ventas', [VentaController::class, 'index']);
    Route::get('/ventas/{id}', [VentaController::class, 'show']);
    Route::post('/ventas', [VentaController::class, 'store']);
    Route::patch('/ventas/{id}/completar-pre-registro', [VentaController::class, 'completarPreRegistro']);
    Route::patch('/ventas/{id}/anular', [VentaController::class, 'anular']);
    

});

