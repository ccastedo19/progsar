<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cotizaciones', function (Blueprint $table) {
            $table->id('id_cotizacion');
            $table->unsignedBigInteger('numero')->unique();
            $table->date('fecha');
            $table->date('fecha_vigencia')->nullable();

            // 0 = no, 1 = si, 2 = ambos
            $table->unsignedTinyInteger('facturado_estado')->default(0);

            $table->decimal('porcentaje_factura', 12, 2)->default(0);
            $table->decimal('delivery', 12, 2)->default(0);

            $table->unsignedBigInteger('id_cliente');

            $table->decimal('total_sin_factura', 12, 2)->default(0);
            $table->decimal('total_con_factura', 12, 2)->default(0);

            // 1 = activa, 0 = anulada
            $table->unsignedTinyInteger('estado')->default(1);

            $table->timestamps();

            $table->foreign('id_cliente')
                ->references('id_cliente')
                ->on('clientes')
                ->onDelete('restrict')
                ->onUpdate('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cotizaciones');
    }
};