<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Categoria;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class CategoriaController extends Controller
{
    // GET /api/categorias?estado=0|1|2|all&q=texto
    public function index(Request $request)
    {
        $estado = $request->query('estado'); // 0,1,2,all
        $qtxt   = trim((string)$request->query('q', ''));

        $q = Categoria::query();

        // Por defecto: no mostrar eliminados
        if ($estado === null) {
            $q->where('estado', '!=', 2);
        } elseif ($estado !== 'all') {
            $q->where('estado', (int)$estado);
        }

        if ($qtxt !== '') {
            $q->where(function ($w) use ($qtxt) {
                $w->where('nombre', 'like', "%{$qtxt}%")
                  ->orWhere('descripcion', 'like', "%{$qtxt}%");
            });
        }

        return response()->json(
            $q->orderByDesc('id_categoria')->get()
        );
    }

    // POST /api/categorias
    public function store(Request $request)
    {
        $data = $request->validate([
            'nombre'      => ['required','string','max:100','unique:categorias,nombre'],
            'descripcion' => ['nullable','string','max:500'],
            'imagen'      => ['nullable','image','max:5120'], // 5MB
            'estado'      => ['nullable','integer', Rule::in([0,1])], // no permitir 2 al crear
        ]);

        $path = null;
        if ($request->hasFile('imagen')) {
            $path = $request->file('imagen')->store('categorias', 'public');
        }

        $categoria = Categoria::create([
            'nombre'      => $data['nombre'],
            'descripcion' => $data['descripcion'] ?? null,
            'imagen'      => $path,
            'estado'      => $data['estado'] ?? 1,
        ]);

        return response()->json($categoria, 201);
    }

    // GET /api/categorias/{id}
    public function show(int $id)
    {
        $categoria = Categoria::where('id_categoria', $id)->firstOrFail();

        // Si quieres que show no devuelva eliminados, descomenta:
        // if ((int)$categoria->estado === 2) abort(404);

        return response()->json($categoria);
    }

    // PUT /api/categorias/{id}
    public function update(Request $request, int $id)
    {
        $categoria = Categoria::where('id_categoria', $id)->firstOrFail();

        if ((int)$categoria->estado === 2) {
            return response()->json(['message' => 'Categoría eliminada. No se puede editar.'], 409);
        }

        $data = $request->validate([
            'nombre'      => [
                'sometimes','required','string','max:100',
                Rule::unique('categorias','nombre')->ignore($categoria->id_categoria, 'id_categoria'),
            ],
            'descripcion' => ['sometimes','nullable','string','max:500'],
            'estado'      => ['sometimes','required','integer', Rule::in([0,1])],
            'imagen'      => ['sometimes','nullable','image','max:5120'],
            'remove_imagen' => ['sometimes','boolean'],
        ]);

        // Quitar imagen si lo piden
        if (!empty($data['remove_imagen'])) {
            if ($categoria->imagen) {
                Storage::disk('public')->delete($categoria->imagen);
            }
            $categoria->imagen = null;
        }

        // Reemplazar imagen si llega nueva
        if ($request->hasFile('imagen')) {
            if ($categoria->imagen) {
                Storage::disk('public')->delete($categoria->imagen);
            }
            $categoria->imagen = $request->file('imagen')->store('categorias', 'public');
        }

        // Actualizar campos (sin pisar imagen con null accidental)
        unset($data['imagen'], $data['remove_imagen']);
        $categoria->fill($data);
        $categoria->save();

        return response()->json($categoria);
    }

    // PATCH /api/categorias/{id}/estado
    public function updateEstado(Request $request, int $id)
    {
        $categoria = Categoria::where('id_categoria', $id)->firstOrFail();

        if ((int)$categoria->estado === 2) {
            return response()->json(['message' => 'Categoría eliminada. No se puede cambiar estado.'], 409);
        }

        $data = $request->validate([
            'estado' => ['required','integer', Rule::in([0,1])],
        ]);

        $categoria->estado = (int)$data['estado'];
        $categoria->save();

        return response()->json($categoria);
    }

    // DELETE /api/categorias/{id} => estado=2 (eliminado lógico)
    public function destroy(int $id)
    {
        $categoria = Categoria::where('id_categoria', $id)->firstOrFail();

        $categoria->estado = 2;
        $categoria->save();

        return response()->json(['message' => 'Categoría marcada como eliminada (estado=2).']);
    }
}