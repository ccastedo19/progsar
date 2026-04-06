<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class UsuariosSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        // Crear usuarios (password en bcrypt)
        DB::table('usuarios')->updateOrInsert(
            ['email' => 'admin@example.com'],
            [
                'nombre' => 'Cesar',
                'apellido' => 'Castedo',
                'telefono' => '76000898',
                'password' => Hash::make('alejo123'),
                'id_rol' => 1,
                'estado' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ]
        );

    }
}
