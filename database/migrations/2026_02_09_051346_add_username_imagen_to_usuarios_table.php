<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('usuarios', function (Blueprint $table) {
            $table->string('username', 100)->unique()->after('email');
            $table->string('imagen')->nullable()->after('telefono'); // guarda ruta tipo: usuarios/xxx.jpg
        });
    }

    public function down(): void
    {
        Schema::table('usuarios', function (Blueprint $table) {
            $table->dropUnique(['username']);
            $table->dropColumn(['username', 'imagen']);
        });
    }
};
