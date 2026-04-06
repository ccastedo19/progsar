<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FichaTecnica extends Model
{
    protected $table = 'ficha_tecnica';
    protected $primaryKey = 'id_ficha_tecnica';

    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'id_producto',
        'caracteristica',
        'especificacion',
    ];

    public function producto()
    {
        return $this->belongsTo(Producto::class, 'id_producto', 'id_producto');
    }
}