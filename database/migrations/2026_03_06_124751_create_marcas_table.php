<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('marcas', function (Blueprint $table) {
            $table->id('id_marca');
            $table->string('nombre', 100);
            $table->string('descripcion', 500)->nullable();
            $table->string('imagen', 500)->nullable();
            $table->integer('estado')->default(1); // 0=inactivo, 1=activo, 2=eliminado
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('marcas');
    }
};