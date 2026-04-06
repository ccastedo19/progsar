<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cotizacion extends Model
{
    use HasFactory;

    protected $table = 'cotizaciones';
    protected $primaryKey = 'id_cotizacion';

    protected $fillable = [
        'numero',
        'fecha',
        'fecha_vigencia',
        'facturado_estado',
        'porcentaje_factura',
        'delivery',
        'id_cliente',
        'total_sin_factura',
        'total_con_factura',
        'estado',
    ];

    protected $casts = [
        'fecha' => 'date',
        'fecha_vigencia' => 'date',
        'porcentaje_factura' => 'decimal:2',
        'delivery' => 'decimal:2',
        'total_sin_factura' => 'decimal:2',
        'total_con_factura' => 'decimal:2',
    ];

    public function detalles()
    {
        return $this->hasMany(CotizacionDetalle::class, 'id_cotizacion', 'id_cotizacion');
    }

    public function cliente()
    {
        return $this->belongsTo(Cliente::class, 'id_cliente', 'id_cliente');
    }
}