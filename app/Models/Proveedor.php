<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Proveedor extends Model
{
    protected $table = 'proveedores';
    protected $primaryKey = 'id_proveedor';

    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'nit',
        'empresa',
        'telefono',
        'ciudad',
        'direccion',
        'estado',
    ];

    protected $casts = [
        'estado' => 'integer',
    ];
}