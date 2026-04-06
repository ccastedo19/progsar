<?php

namespace App\Http\Controllers\Api;

use App\Models\Usuario;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class UsuarioController extends Controller
{
    // GET /api/usuarios
    public function index(Request $request)
    {
        $estado = $request->query('estado'); // 1,2,3,all
        $qtxt   = trim((string)$request->query('q', ''));

        $q = Usuario::query();

        if ($estado === null) {
            $q->where('estado', '!=', 3);
        } elseif ($estado !== 'all') {
            $q->where('estado', (int)$estado);
        }

        if ($qtxt !== '') {
            $q->where(function ($w) use ($qtxt) {
                $w->where('nombre', 'like', "%{$qtxt}%")
                  ->orWhere('apellido', 'like', "%{$qtxt}%")
                  ->orWhere('email', 'like', "%{$qtxt}%")
                  ->orWhere('username', 'like', "%{$qtxt}%")
                  ->orWhere('telefono', 'like', "%{$qtxt}%");
            });
        }

        return response()->json(
            $q->orderByDesc('id_usuario')->get()
        );
    }

    // POST /api/usuarios
    public function store(Request $request)
    {
        $data = $request->validate([
            'nombre'   => ['required','string','max:100'],
            'apellido' => ['required','string','max:100'],
            'telefono' => ['nullable','string','max:20'],
            'email'    => ['required','email','max:255','unique:usuarios,email'],
            'username' => ['required','string','min:3','max:100','unique:usuarios,username'],
            'password' => ['required','string','min:6'],
            'id_rol'   => ['required','integer','exists:roles,id_rol'],
            'estado'   => ['nullable','integer', Rule::in([1,2])],
            'imagen'   => ['nullable','image','max:5120'], // 5MB
        ]);

        $path = null;
        if ($request->hasFile('imagen')) {
            $path = $request->file('imagen')->store('usuarios', 'public'); // usuarios/xxx.jpg
        }

        $usuario = Usuario::create([
            'nombre'   => $data['nombre'],
            'apellido' => $data['apellido'],
            'telefono' => $data['telefono'] ?? null,
            'email'    => $data['email'],
            'username' => $data['username'],
            'password' => Hash::make($data['password']),
            'id_rol'   => $data['id_rol'],
            'estado'   => $data['estado'] ?? 1,
            'imagen'   => $path,
        ]);

        return response()->json($usuario, 201);
    }

    // GET /api/usuarios/{id}
    public function show(int $id)
    {
        $usuario = Usuario::where('id_usuario', $id)->firstOrFail();
        return response()->json($usuario);
    }

    // PUT /api/usuarios/{id}
    public function update(Request $request, int $id)
    {
        $usuario = Usuario::where('id_usuario', $id)->firstOrFail();

        if ((int)$usuario->estado === 3) {
            return response()->json(['message' => 'Usuario eliminado. No se puede editar.'], 409);
        }

        $data = $request->validate([
            'nombre'   => ['sometimes','required','string','max:100'],
            'apellido' => ['sometimes','required','string','max:100'],
            'telefono' => ['sometimes','nullable','string','max:20'],
            'email'    => [
                'sometimes','required','email','max:255',
                Rule::unique('usuarios','email')->ignore($usuario->id_usuario, 'id_usuario'),
            ],
            'username' => [
                'sometimes','required','string','min:3','max:100',
                Rule::unique('usuarios','username')->ignore($usuario->id_usuario, 'id_usuario'),
            ],
            'password' => ['sometimes','nullable','string','min:6'],
            'id_rol'   => ['sometimes','required','integer','exists:roles,id_rol'],
            'estado'   => ['sometimes','required','integer', Rule::in([1,2])],
            'imagen'   => ['sometimes','nullable','image','max:5120'],
            'remove_imagen' => ['sometimes','boolean'], // true para eliminar imagen
        ]);

        // Password opcional
        if (array_key_exists('password', $data)) {
            if ($data['password']) {
                $data['password'] = Hash::make($data['password']);
            } else {
                unset($data['password']);
            }
        }

        // Quitar imagen si lo piden
        if (!empty($data['remove_imagen'])) {
            if ($usuario->imagen) {
                Storage::disk('public')->delete($usuario->imagen);
            }
            $usuario->imagen = null;
        }

        // Reemplazar imagen si llega nueva
        if ($request->hasFile('imagen')) {
            if ($usuario->imagen) {
                Storage::disk('public')->delete($usuario->imagen);
            }
            $usuario->imagen = $request->file('imagen')->store('usuarios', 'public');
        }

        // Actualizar campos (sin pisar imagen con null accidental)
        unset($data['imagen'], $data['remove_imagen']);
        $usuario->fill($data);
        $usuario->save();

        return response()->json($usuario);
    }

    // PATCH /api/usuarios/{id}/estado
    public function updateEstado(Request $request, int $id)
    {
        $usuario = Usuario::where('id_usuario', $id)->firstOrFail();

        if ((int)$usuario->estado === 3) {
            return response()->json(['message' => 'Usuario eliminado. No se puede cambiar estado.'], 409);
        }

        $data = $request->validate([
            'estado' => ['required','integer', Rule::in([1,2])],
        ]);

        $usuario->estado = (int)$data['estado'];
        $usuario->save();

        return response()->json($usuario);
    }

    // DELETE /api/usuarios/{id} => estado=3 (eliminado lógico)
    public function destroy(int $id)
    {
        $usuario = Usuario::where('id_usuario', $id)->firstOrFail();

        $usuario->estado = 3;
        $usuario->save();

        // Revoca tokens (opcional)
        if (method_exists($usuario, 'tokens')) {
            $usuario->tokens()->delete();
        }

        return response()->json(['message' => 'Usuario marcado como eliminado (estado=3).']);
    }
}
