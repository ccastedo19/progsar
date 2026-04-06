<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cliente;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ClienteController extends Controller
{
    // GET /api/clientes?estado=1|0|all&b2b=0|1&q=texto
    public function index(Request $request)
    {
        $query = Cliente::query();

        // filtro estado (por defecto solo habilitados)
        $estado = $request->query('estado', '1');
        if ($estado !== 'all') {
            $query->where('estado', (int)$estado);
        }

        // filtro b2b
        if ($request->has('b2b')) {
            $query->where('b2b', (int)$request->query('b2b'));
        }

        // búsqueda simple por Nombre/Apellido/telefono/ci
        if ($request->filled('q')) {
            $q = trim($request->query('q'));
            $query->where(function ($sub) use ($q) {
                $sub->where('Nombre', 'like', "%{$q}%")
                    ->orWhere('Apellido', 'like', "%{$q}%")
                    ->orWhere('telefono', 'like', "%{$q}%")
                    ->orWhere('ci', 'like', "%{$q}%");
            });
        }

        return response()->json(
            $query->orderByDesc('id_cliente')->paginate(15)
        );
    }

    // POST /api/clientes
    public function store(Request $request)
    {
        $data = $request->validate([
            'Nombre' => ['required', 'string', 'max:255'],
            'Apellido' => ['nullable', 'string', 'max:255'],
            'telefono' => ['required', 'string', 'max:30'],
            'ci' => ['nullable', 'string', 'max:50'],
            'estado' => ['nullable', 'integer', Rule::in([0, 1])],
            'b2b' => ['nullable', 'integer', Rule::in([0, 1])],
            'id_usuario' => ['required', 'integer', 'exists:usuarios,id_usuario'],
        ]);

        $data['estado'] = $data['estado'] ?? 1;
        $data['b2b'] = $data['b2b'] ?? 0;

        $cliente = Cliente::create($data);

        return response()->json([
            'message' => 'Cliente creado',
            'data' => $cliente,
        ], 201);
    }

    // GET /api/clientes/{id_cliente}
    public function show($id_cliente)
    {
        $cliente = Cliente::findOrFail($id_cliente);
        return response()->json($cliente);
    }

    // PUT /api/clientes/{id_cliente}
    public function update(Request $request, $id_cliente)
    {
        $cliente = Cliente::findOrFail($id_cliente);

        $data = $request->validate([
            'Nombre' => ['required', 'string', 'max:255'],
            'Apellido' => ['nullable', 'string', 'max:255'],
            'telefono' => ['required', 'string', 'max:30'],
            'ci' => ['nullable', 'string', 'max:50'],
            'b2b' => ['nullable', 'integer', Rule::in([0, 1])],
            'id_usuario' => ['required', 'integer', 'exists:usuarios,id_usuario'],
            // estado NO aquí, porque lo controlas con endpoint dedicado
        ]);

        $cliente->update($data);

        return response()->json([
            'message' => 'Cliente actualizado',
            'data' => $cliente,
        ]);
    }

    // PATCH /api/clientes/{id_cliente}/estado
    // body: { "estado": 0 } o { "estado": 1 }
    public function updateEstado(Request $request, $id_cliente)
    {
        $cliente = Cliente::findOrFail($id_cliente);

        $data = $request->validate([
            'estado' => ['required', 'integer', Rule::in([0, 1])],
        ]);

        $cliente->estado = (int)$data['estado'];
        $cliente->save();

        return response()->json([
            'message' => 'Estado actualizado',
            'data' => $cliente,
        ]);
    }

    // (Opcional) PATCH /api/clientes/{id_cliente}/b2b
    // body: { "b2b": 0 } o { "b2b": 1 }
    public function updateB2B(Request $request, $id_cliente)
    {
        $cliente = Cliente::findOrFail($id_cliente);

        $data = $request->validate([
            'b2b' => ['required', 'integer', Rule::in([0, 1])],
        ]);

        $cliente->b2b = (int)$data['b2b'];
        $cliente->save();

        return response()->json([
            'message' => 'B2B actualizado',
            'data' => $cliente,
        ]);
    }

    // DELETE /api/clientes/{id_cliente}
    // (eliminación lógica)
    public function destroy($id_cliente)
    {
        $cliente = Cliente::findOrFail($id_cliente);
        $cliente->estado = 0;
        $cliente->save();

        return response()->json([
            'message' => 'Cliente eliminado (estado=0)',
            'data' => $cliente,
        ]);
    }
}