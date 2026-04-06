<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    protected $table = 'productos';
    protected $primaryKey = 'id_producto';

    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'nombre',
        'descripcion',
        'codigo',
        'stock',
        'imagen_1',
        'imagen_2',
        'imagen_3',
        'id_categoria',
        'id_marca',
        'id_proveedor',
        'precio_venta',
        'precio_compra',
        'url_amigable',
        'meta_titulo',
        'meta_descripcion',
        'estado',
    ];

    protected $casts = [
        'stock' => 'integer',
        'precio_venta' => 'decimal:2',
        'precio_compra' => 'decimal:2',
        'estado' => 'integer',
    ];

    public function categoria()
    {
        return $this->belongsTo(Categoria::class, 'id_categoria', 'id_categoria');
    }

    public function marca()
    {
        return $this->belongsTo(Marca::class, 'id_marca', 'id_marca');
    }

    public function proveedor()
    {
        return $this->belongsTo(Proveedor::class, 'id_proveedor', 'id_proveedor');
    }

    public function fichasTecnicas()
    {
        return $this->hasMany(FichaTecnica::class, 'id_producto', 'id_producto');
    }
}