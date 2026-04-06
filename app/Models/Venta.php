<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Venta extends Model
{
    protected $table = 'ventas';
    protected $primaryKey = 'id_venta';

    protected $fillable = [
        'numero',
        'fecha',
        'facturado_estado',
        'porcentaje_factura',
        'delivery',
        'id_cliente',
        'total_sin_factura',
        'total_con_factura',
        'estado',
    ];

    protected $casts = [
        'fecha' => 'date:Y-m-d',
        'porcentaje_factura' => 'decimal:2',
        'delivery' => 'decimal:2',
        'total_sin_factura' => 'decimal:2',
        'total_con_factura' => 'decimal:2',
    ];

    public function cliente()
    {
        return $this->belongsTo(\App\Models\Cliente::class, 'id_cliente', 'id_cliente');
    }

    public function detalles()
    {
        return $this->hasMany(\App\Models\VentaDetalle::class, 'id_venta', 'id_venta');
    }
}