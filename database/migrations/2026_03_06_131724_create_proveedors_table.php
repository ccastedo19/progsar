<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('proveedores', function (Blueprint $table) {
            $table->id('id_proveedor');
            $table->string('nit', 50)->nullable();
            $table->string('empresa', 150);
            $table->string('telefono', 20);
            $table->string('ciudad', 100)->nullable();
            $table->string('direccion', 255);
            $table->integer('estado')->default(1); // 1=activo, 2=eliminado
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('proveedores');
    }
};