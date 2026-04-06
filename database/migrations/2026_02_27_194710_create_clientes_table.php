<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('clientes', function (Blueprint $table) {
            $table->id('id_cliente');

            $table->string('Nombre');                 // obligatorio (validación)
            $table->string('Apellido')->nullable();
            $table->string('telefono');               // obligatorio (validación)
            $table->string('ci')->nullable();

            $table->tinyInteger('estado')->default(1); // 1 habilitado, 0 eliminado
            $table->tinyInteger('b2b')->default(0);    // 0 normal, 1 b2b

            $table->unsignedBigInteger('id_usuario');  // FK users.id

            $table->timestamps();

            $table->foreign('id_usuario')
                ->references('id')
                ->on('usuarios')
                ->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('clientes');
    }
};