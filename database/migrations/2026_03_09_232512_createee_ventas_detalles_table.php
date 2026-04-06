<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ventas_detalles', function (Blueprint $table) {
            $table->id('id_ventas_detalle');

            $table->unsignedBigInteger('id_venta');
            $table->unsignedBigInteger('id_producto');

            $table->string('codigo', 100);
            $table->string('nombre_producto', 255);

            $table->decimal('precio_unitario', 12, 2);
            $table->decimal('precio_compra', 12, 2)->default(0);
            $table->integer('cantidad');
            $table->decimal('descuento', 12, 2)->default(0);
            $table->decimal('total_producto', 12, 2);

            $table->timestamps();

            $table->foreign('id_venta')
                ->references('id_venta')
                ->on('ventas')
                ->onDelete('cascade');

            $table->foreign('id_producto')
                ->references('id_producto')
                ->on('productos')
                ->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ventas_detalles');
    }
};