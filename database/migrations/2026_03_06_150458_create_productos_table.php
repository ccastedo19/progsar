<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('productos', function (Blueprint $table) {
            $table->id('id_producto');

            $table->string('nombre', 150);
            $table->string('descripcion', 1000);
            $table->string('codigo', 100)->unique();
            $table->integer('stock')->default(0);

            $table->string('imagen_1', 500);
            $table->string('imagen_2', 500)->nullable();
            $table->string('imagen_3', 500)->nullable();

            $table->unsignedBigInteger('id_categoria');
            $table->unsignedBigInteger('id_marca');
            $table->unsignedBigInteger('id_proveedor');

            $table->decimal('precio_venta', 10, 2);
            $table->decimal('precio_compra', 10, 2);

            $table->string('url_amigable', 200)->nullable()->unique();
            $table->string('meta_titulo', 255)->nullable();
            $table->string('meta_descripcion', 500)->nullable();

            $table->integer('estado')->default(1); // 0=inactivo, 1=activo, 2=eliminado

            $table->timestamps();

            $table->foreign('id_categoria')->references('id_categoria')->on('categorias');
            $table->foreign('id_marca')->references('id_marca')->on('marcas');
            $table->foreign('id_proveedor')->references('id_proveedor')->on('proveedores');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('productos');
    }
};