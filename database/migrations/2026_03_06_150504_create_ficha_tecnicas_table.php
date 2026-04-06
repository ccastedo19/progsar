<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ficha_tecnica', function (Blueprint $table) {
            $table->id('id_ficha_tecnica');
            $table->unsignedBigInteger('id_producto');
            $table->string('caracteristica', 150);
            $table->string('especificacion', 500);
            $table->timestamps();

            $table->foreign('id_producto')
                ->references('id_producto')
                ->on('productos')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ficha_tecnica');
    }
};