<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Proveedor;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ProveedorController extends Controller
{
    // GET /api/proveedores?estado=1|2|all&q=texto
    public function index(Request $request)
    {
        $estado = $request->query('estado'); // 1,2,all
        $qtxt   = trim((string)$request->query('q', ''));

        $q = Proveedor::query();

        // Por defecto: no mostrar eliminados
        if ($estado === null) {
            $q->where('estado', '!=', 2);
        } elseif ($estado !== 'all') {
            $q->where('estado', (int)$estado);
        }

        if ($qtxt !== '') {
            $q->where(function ($w) use ($qtxt) {
                $w->where('nit', 'like', "%{$qtxt}%")
                  ->orWhere('empresa', 'like', "%{$qtxt}%")
                  ->orWhere('telefono', 'like', "%{$qtxt}%")
                  ->orWhere('ciudad', 'like', "%{$qtxt}%")
                  ->orWhere('direccion', 'like', "%{$qtxt}%");
            });
        }

        return response()->json(
            $q->orderByDesc('id_proveedor')->get()
        );
    }

    // POST /api/proveedores
    public function store(Request $request)
    {
        $data = $request->validate([
            'nit'       => ['nullable','string','max:50'],
            'empresa'   => ['required','string','max:150','unique:proveedores,empresa'],
            'telefono'  => ['required','string','max:20'],
            'ciudad'    => ['nullable','string','max:100'],
            'direccion' => ['required','string','max:255'],
            'estado'    => ['nullable','integer', Rule::in([1])], // solo activo al crear
        ]);

        $proveedor = Proveedor::create([
            'nit'       => $data['nit'] ?? null,
            'empresa'   => $data['empresa'],
            'telefono'  => $data['telefono'],
            'ciudad'    => $data['ciudad'] ?? null,
            'direccion' => $data['direccion'],
            'estado'    => 1,
        ]);

        return response()->json($proveedor, 201);
    }

    // GET /api/proveedores/{id}
    public function show(int $id)
    {
        $proveedor = Proveedor::where('id_proveedor', $id)->firstOrFail();
        return response()->json($proveedor);
    }

    // PUT /api/proveedores/{id}
    public function update(Request $request, int $id)
    {
        $proveedor = Proveedor::where('id_proveedor', $id)->firstOrFail();

        if ((int)$proveedor->estado === 2) {
            return response()->json(['message' => 'Proveedor eliminado. No se puede editar.'], 409);
        }

        $data = $request->validate([
            'nit' => ['sometimes','nullable','string','max:50'],
            'empresa' => [
                'sometimes','required','string','max:150',
                Rule::unique('proveedores', 'empresa')->ignore($proveedor->id_proveedor, 'id_proveedor'),
            ],
            'telefono'  => ['sometimes','required','string','max:20'],
            'ciudad'    => ['sometimes','nullable','string','max:100'],
            'direccion' => ['sometimes','required','string','max:255'],
        ]);

        $proveedor->fill($data);
        $proveedor->save();

        return response()->json($proveedor);
    }

    // DELETE /api/proveedores/{id} => estado=2
    public function destroy(int $id)
    {
        $proveedor = Proveedor::where('id_proveedor', $id)->firstOrFail();

        $proveedor->estado = 2;
        $proveedor->save();

        return response()->json([
            'message' => 'Proveedor marcado como eliminado (estado=2).'
        ]);
    }
}