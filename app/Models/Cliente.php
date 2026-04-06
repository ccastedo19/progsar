<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cliente extends Model
{
    use HasFactory;

    protected $table = 'clientes';
    protected $primaryKey = 'id_cliente';

    protected $fillable = [
        'Nombre',
        'Apellido',
        'telefono',
        'ci',
        'estado',
        'b2b',
        'id_usuario',
    ];

    protected $casts = [
        'estado' => 'integer',
        'b2b' => 'integer',
    ];

    public function usuario()
    {
        return $this->belongsTo(User::class, 'id_usuario', 'id_usuario');
    }
}