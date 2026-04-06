<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CotizacionDetalle extends Model
{
    use HasFactory;

    protected $table = 'cotizaciones_detalles';
    protected $primaryKey = 'id_cotizacion_detalle';

    protected $fillable = [
        'id_cotizacion',
        'id_producto',
        'codigo',
        'nombre_producto',
        'precio_unitario',
        'cantidad',
        'descuento',
        'total_producto',
    ];

    protected $casts = [
        'precio_unitario' => 'decimal:2',
        'descuento' => 'decimal:2',
        'total_producto' => 'decimal:2',
    ];

    public function cotizacion()
    {
        return $this->belongsTo(Cotizacion::class, 'id_cotizacion', 'id_cotizacion');
    }

    public function producto()
    {
        return $this->belongsTo(Producto::class, 'id_producto', 'id_producto');
    }

    
}