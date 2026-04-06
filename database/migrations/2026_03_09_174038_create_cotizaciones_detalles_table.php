<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cotizaciones_detalles', function (Blueprint $table) {
            $table->id('id_cotizacion_detalle');

            $table->unsignedBigInteger('id_cotizacion');
            $table->unsignedBigInteger('id_producto');

            $table->string('codigo', 100);
            $table->string('nombre_producto', 255);

            $table->decimal('precio_unitario', 12, 2)->default(0);
            $table->integer('cantidad')->default(1);
            $table->decimal('descuento', 12, 2)->default(0);
            $table->decimal('total_producto', 12, 2)->default(0);

            $table->timestamps();

            $table->foreign('id_cotizacion')
                ->references('id_cotizacion')
                ->on('cotizaciones')
                ->onDelete('cascade')
                ->onUpdate('cascade');

            $table->foreign('id_producto')
                ->references('id_producto')
                ->on('productos')
                ->onDelete('restrict')
                ->onUpdate('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cotizaciones_detalles');
    }
};