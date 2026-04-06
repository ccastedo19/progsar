<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Marca;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class MarcaController extends Controller
{
    // GET /api/marcas?estado=0|1|2|all&q=texto
    public function index(Request $request)
    {
        $estado = $request->query('estado'); // 0,1,2,all
        $qtxt   = trim((string)$request->query('q', ''));

        $q = Marca::query();

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
            $q->orderByDesc('id_marca')->get()
        );
    }

    // POST /api/marcas
    public function store(Request $request)
    {
        $data = $request->validate([
            'nombre'      => ['required','string','max:100','unique:marcas,nombre'],
            'descripcion' => ['nullable','string','max:500'],
            'imagen'      => ['nullable','image','max:5120'], // 5MB
            'estado'      => ['nullable','integer', Rule::in([0,1])],
        ]);

        $path = null;
        if ($request->hasFile('imagen')) {
            $path = $request->file('imagen')->store('marcas', 'public');
        }

        $marca = Marca::create([
            'nombre'      => $data['nombre'],
            'descripcion' => $data['descripcion'] ?? null,
            'imagen'      => $path,
            'estado'      => $data['estado'] ?? 1,
        ]);

        return response()->json($marca, 201);
    }

    // GET /api/marcas/{id}
    public function show(int $id)
    {
        $marca = Marca::where('id_marca', $id)->firstOrFail();
        return response()->json($marca);
    }

    // PUT /api/marcas/{id}
    public function update(Request $request, int $id)
    {
        $marca = Marca::where('id_marca', $id)->firstOrFail();

        if ((int)$marca->estado === 2) {
            return response()->json(['message' => 'Marca eliminada. No se puede editar.'], 409);
        }

        $data = $request->validate([
            'nombre'      => [
                'sometimes','required','string','max:100',
                Rule::unique('marcas','nombre')->ignore($marca->id_marca, 'id_marca'),
            ],
            'descripcion' => ['sometimes','nullable','string','max:500'],
            'estado'      => ['sometimes','required','integer', Rule::in([0,1])],
            'imagen'      => ['sometimes','nullable','image','max:5120'],
            'remove_imagen' => ['sometimes','boolean'],
        ]);

        if (!empty($data['remove_imagen'])) {
            if ($marca->imagen) {
                Storage::disk('public')->delete($marca->imagen);
            }
            $marca->imagen = null;
        }

        if ($request->hasFile('imagen')) {
            if ($marca->imagen) {
                Storage::disk('public')->delete($marca->imagen);
            }
            $marca->imagen = $request->file('imagen')->store('marcas', 'public');
        }

        unset($data['imagen'], $data['remove_imagen']);
        $marca->fill($data);
        $marca->save();

        return response()->json($marca);
    }

    // PATCH /api/marcas/{id}/estado
    public function updateEstado(Request $request, int $id)
    {
        $marca = Marca::where('id_marca', $id)->firstOrFail();

        if ((int)$marca->estado === 2) {
            return response()->json(['message' => 'Marca eliminada. No se puede cambiar estado.'], 409);
        }

        $data = $request->validate([
            'estado' => ['required','integer', Rule::in([0,1])],
        ]);

        $marca->estado = (int)$data['estado'];
        $marca->save();

        return response()->json($marca);
    }

    // DELETE /api/marcas/{id} => estado=2
    public function destroy(int $id)
    {
        $marca = Marca::where('id_marca', $id)->firstOrFail();

        $marca->estado = 2;
        $marca->save();

        return response()->json(['message' => 'Marca marcada como eliminada (estado=2).']);
    }
}