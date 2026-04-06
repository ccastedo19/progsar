<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ventas', function (Blueprint $table) {
            $table->id('id_venta');
            $table->integer('numero')->unique();
            $table->date('fecha');
            $table->unsignedTinyInteger('facturado_estado')->comment('0=no,1=si');
            $table->decimal('porcentaje_factura', 10, 2)->default(0);
            $table->decimal('delivery', 10, 2)->default(0);

            $table->unsignedBigInteger('id_cliente');

            $table->decimal('total_sin_factura', 12, 2);
            $table->decimal('total_con_factura', 12, 2);

            $table->text('motivo_anulacion')->nullable();
            $table->date('fecha_anulacion')->nullable();

            $table->unsignedTinyInteger('estado')->default(1)->comment('0=anulada,1=pre-registro,2=registrada');

            $table->timestamps();

            $table->foreign('id_cliente')
                ->references('id_cliente')
                ->on('clientes')
                ->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ventas');
    }
};