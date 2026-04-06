<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VentaDetalle extends Model
{
    protected $table = 'ventas_detalles';
    protected $primaryKey = 'id_ventas_detalle';

    protected $fillable = [
        'id_venta',
        'id_producto',
        'codigo',
        'nombre_producto',
        'precio_unitario',
        'precio_compra',
        'cantidad',
        'descuento',
        'total_producto',
    ];

    protected $casts = [
        'precio_compra' => 'decimal:2',
        'precio_unitario' => 'decimal:2',
        'descuento' => 'decimal:2',
        'total_producto' => 'decimal:2',
    ];

    public function venta()
    {
        return $this->belongsTo(\App\Models\Venta::class, 'id_venta', 'id_venta');
    }

    public function producto()
    {
        return $this->belongsTo(\App\Models\Producto::class, 'id_producto', 'id_producto');
    }
}