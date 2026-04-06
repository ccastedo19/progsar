<?php

namespace App\Http\Controllers\Api;

use App\Models\Usuario;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * POST /api/login
     * Body: { "email": "...", "password": "..." }
     */
    public function login(Request $request)
    {
        $request->validate([
        'login' => ['required','string'],   // email o username
        'password' => ['required','string'],
        'device_name' => ['nullable','string','max:255'],
        ]);


        $login = $request->input('login');

        $usuario = Usuario::where('email', $login)
        ->orWhere('username', $login)
        ->first();

        // No revelar si existe o no el usuario (buena práctica)
        if (!$usuario || !Hash::check($request->password, $usuario->password)) {
            throw ValidationException::withMessages([
                'email' => ['Credenciales inválidas.'],
            ]);
        }

        if (!$usuario->estado) {
            throw ValidationException::withMessages([
                'email' => ['Usuario inactivo.'],
            ]);
        }
        
        if ((int)$usuario->estado !== 1) {
        throw ValidationException::withMessages([
            'login' => ['Usuario inactivo o eliminado.'],
        ]);
        }

        // Opcional: invalidar tokens previos en cada login
        // $usuario->tokens()->delete();

        $deviceName = $request->input('device_name', 'api');

        $token = $usuario->createToken($deviceName)->plainTextToken;

        return response()->json([
            'token' => $token,
            'token_type' => 'Bearer',
            'usuario' => [
                'id_usuario' => $usuario->id_usuario,
                'nombre' => $usuario->nombre,
                'apellido' => $usuario->apellido,
                'email' => $usuario->email,
                'telefono' => $usuario->telefono,
                'id_rol' => $usuario->id_rol,
                'estado' => $usuario->estado,
            ],
        ]);
    }

    

    /**
     * POST /api/logout
     * Header: Authorization: Bearer <token>
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Sesión cerrada.',
        ]);
    }

    /**
     * GET /api/me
     * Header: Authorization: Bearer <token>
     */
    public function me(Request $request)
    {
        return response()->json([
            'usuario' => $request->user(),
        ]);
    }
}
