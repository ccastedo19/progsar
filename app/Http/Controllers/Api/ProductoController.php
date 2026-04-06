<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Producto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Mews\Purifier\Facades\Purifier;

class ProductoController extends Controller
{
    private function cleanHtml(?string $html): string
    {
        if ($html === null) {
            return '';
        }

        $clean = Purifier::clean($html);

        // quitar espacios extremos
        $clean = trim($clean);

        // si queda vacío o solo etiquetas vacías, devolver vacío
        $plainText = trim(strip_tags($clean));

        return $plainText === '' ? '' : $clean;
    }

    private function plainTextLength(?string $html): int
    {
        $text = trim(preg_replace('/\s+/', ' ', strip_tags((string)$html)));
        return mb_strlen($text);
    }

    private function generateUniqueSlug(string $baseSlug, ?int $ignoreId = null): string
    {
        $slug = Str::slug($baseSlug);

        if ($slug === '') {
            $slug = 'producto';
        }

        $original = $slug;
        $counter = 2;

        while (
            Producto::when($ignoreId, function ($q) use ($ignoreId) {
                $q->where('id_producto', '!=', $ignoreId);
            })->where('url_amigable', $slug)->exists()
        ) {
            $slug = $original . '-' . $counter;
            $counter++;
        }

        return $slug;
    }
    public function index(Request $request)
    {
        $estado = $request->query('estado'); // 0,1,2,all
        $qtxt   = trim((string)$request->query('q', ''));

        $q = Producto::with(['categoria', 'marca', 'proveedor', 'fichasTecnicas']);

        if ($estado === null) {
            $q->where('estado', '!=', 2);
        } elseif ($estado !== 'all') {
            $q->where('estado', (int)$estado);
        }

        if ($qtxt !== '') {
            $q->where(function ($w) use ($qtxt) {
                $w->where('nombre', 'like', "%{$qtxt}%")
                  ->orWhere('descripcion', 'like', "%{$qtxt}%")
                  ->orWhere('codigo', 'like', "%{$qtxt}%")
                  ->orWhere('url_amigable', 'like', "%{$qtxt}%");
            });
        }

        return response()->json(
            $q->orderByDesc('id_producto')->get()
        );
    }

    // POST /api/productos
    public function store(Request $request)
    {
        $data = $request->validate([
            'nombre'            => ['required', 'string', 'max:150'],
            'descripcion'       => ['required', 'string'],
            'codigo'            => ['required', 'string', 'max:100', 'unique:productos,codigo'],
            'stock'             => ['required', 'integer', 'min:0'],

            'imagen_1'          => ['required', 'image', 'max:5120'],
            'imagen_2'          => ['nullable', 'image', 'max:5120'],
            'imagen_3'          => ['nullable', 'image', 'max:5120'],

            'id_categoria'      => ['required', 'integer', 'exists:categorias,id_categoria'],
            'id_marca'          => ['required', 'integer', 'exists:marcas,id_marca'],
            'id_proveedor'      => ['required', 'integer', 'exists:proveedores,id_proveedor'],

            'precio_venta'      => ['required', 'numeric', 'min:0'],
            'precio_compra'     => ['required', 'numeric', 'min:0'],

            'url_amigable'      => ['nullable', 'string', 'max:200', 'unique:productos,url_amigable'],
            'meta_titulo'       => ['nullable', 'string', 'max:255'],
            'meta_descripcion'  => ['nullable', 'string', 'max:500'],

            'estado'            => ['nullable', 'integer', Rule::in([0,1])],

            'fichas'                        => ['nullable', 'array'],
            'fichas.*.caracteristica'       => ['required_with:fichas', 'string', 'max:150'],
            'fichas.*.especificacion'       => ['required_with:fichas', 'string', 'max:500'],
        ]);

        $data['descripcion'] = $this->cleanHtml($data['descripcion'] ?? '');

        if ($data['descripcion'] === '') {
            return response()->json([
                'message' => 'La descripción es obligatoria.',
                'errors' => [
                    'descripcion' => ['La descripción es obligatoria.']
                ]
            ], 422);
        }

        if ($this->plainTextLength($data['descripcion']) > 1000) {
            return response()->json([
                'message' => 'La descripción no debe superar 1000 caracteres de texto.',
                'errors' => [
                    'descripcion' => ['La descripción no debe superar 1000 caracteres de texto.']
                ]
            ], 422);
        }

        return DB::transaction(function () use ($request, $data) {
            $path1 = $request->file('imagen_1')->store('productos', 'public');
            $path2 = $request->hasFile('imagen_2')
                ? $request->file('imagen_2')->store('productos', 'public')
                : null;
            $path3 = $request->hasFile('imagen_3')
                ? $request->file('imagen_3')->store('productos', 'public')
                : null;

            $slugBase = !empty($data['url_amigable'])
                ? $data['url_amigable']
                : $data['nombre'];

            $slug = $this->generateUniqueSlug($slugBase);

            $producto = Producto::create([
                'nombre'            => $data['nombre'],
                'descripcion'       => $data['descripcion'],
                'codigo'            => $data['codigo'],
                'stock'             => $data['stock'],

                'imagen_1'          => $path1,
                'imagen_2'          => $path2,
                'imagen_3'          => $path3,

                'id_categoria'      => $data['id_categoria'],
                'id_marca'          => $data['id_marca'],
                'id_proveedor'      => $data['id_proveedor'],

                'precio_venta'      => $data['precio_venta'],
                'precio_compra'     => $data['precio_compra'],

                'url_amigable'      => $slug,
                'meta_titulo'       => $data['meta_titulo'] ?? null,
                'meta_descripcion'  => $data['meta_descripcion'] ?? null,
                'estado'            => $data['estado'] ?? 1,
            ]);

            foreach ($data['fichas'] ?? [] as $fila) {
                $producto->fichasTecnicas()->create([
                    'caracteristica' => $fila['caracteristica'],
                    'especificacion' => $fila['especificacion'],
                ]);
            }

            return response()->json(
                $producto->load(['categoria', 'marca', 'proveedor', 'fichasTecnicas']),
                201
            );
        });
    }

    // GET /api/productos/{id}
    public function show(int $id)
    {
        $producto = Producto::with(['categoria', 'marca', 'proveedor', 'fichasTecnicas'])
            ->where('id_producto', $id)
            ->firstOrFail();

        return response()->json($producto);
    }

    // PUT /api/productos/{id}
    public function update(Request $request, int $id)
    {
        $producto = Producto::with('fichasTecnicas')
            ->where('id_producto', $id)
            ->firstOrFail();

        if ((int)$producto->estado === 2) {
            return response()->json(['message' => 'Producto eliminado. No se puede editar.'], 409);
        }

        $data = $request->validate([
            'nombre'            => ['sometimes', 'required', 'string', 'max:150'],
            'descripcion'       => ['sometimes', 'required', 'string'],
            'codigo'            => [
                'sometimes', 'required', 'string', 'max:100',
                Rule::unique('productos', 'codigo')->ignore($producto->id_producto, 'id_producto')
            ],
            'stock'             => ['sometimes', 'required', 'integer', 'min:0'],

            'imagen_1'          => ['sometimes', 'nullable', 'image', 'max:5120'],
            'imagen_2'          => ['sometimes', 'nullable', 'image', 'max:5120'],
            'imagen_3'          => ['sometimes', 'nullable', 'image', 'max:5120'],

            'remove_imagen_1'   => ['sometimes', 'boolean'],
            'remove_imagen_2'   => ['sometimes', 'boolean'],
            'remove_imagen_3'   => ['sometimes', 'boolean'],

            'id_categoria'      => ['sometimes', 'required', 'integer', 'exists:categorias,id_categoria'],
            'id_marca'          => ['sometimes', 'required', 'integer', 'exists:marcas,id_marca'],
            'id_proveedor'      => ['sometimes', 'required', 'integer', 'exists:proveedores,id_proveedor'],

            'precio_venta'      => ['sometimes', 'required', 'numeric', 'min:0'],
            'precio_compra'     => ['sometimes', 'required', 'numeric', 'min:0'],

            'url_amigable'      => [
                'sometimes', 'nullable', 'string', 'max:200',
                Rule::unique('productos', 'url_amigable')->ignore($producto->id_producto, 'id_producto')
            ],
            'meta_titulo'       => ['sometimes', 'nullable', 'string', 'max:255'],
            'meta_descripcion'  => ['sometimes', 'nullable', 'string', 'max:500'],

            'estado'            => ['sometimes', 'required', 'integer', Rule::in([0,1])],

            'fichas'                        => ['sometimes', 'array'],
            'fichas.*.caracteristica'       => ['required_with:fichas', 'string', 'max:150'],
            'fichas.*.especificacion'       => ['required_with:fichas', 'string', 'max:500'],
        ]);

        if (array_key_exists('descripcion', $data)) {
            $data['descripcion'] = $this->cleanHtml($data['descripcion']);

            if ($data['descripcion'] === '') {
                return response()->json([
                    'message' => 'La descripción es obligatoria.',
                    'errors' => [
                        'descripcion' => ['La descripción es obligatoria.']
                    ]
                ], 422);
            }

            if ($this->plainTextLength($data['descripcion']) > 1000) {
                return response()->json([
                    'message' => 'La descripción no debe superar 1000 caracteres de texto.',
                    'errors' => [
                        'descripcion' => ['La descripción no debe superar 1000 caracteres de texto.']
                    ]
                ], 422);
            }
        }

        return DB::transaction(function () use ($request, $data, $producto) {
            if (!empty($data['remove_imagen_1']) && $producto->imagen_1) {
                Storage::disk('public')->delete($producto->imagen_1);
                $producto->imagen_1 = null;
            }

            if (!empty($data['remove_imagen_2']) && $producto->imagen_2) {
                Storage::disk('public')->delete($producto->imagen_2);
                $producto->imagen_2 = null;
            }

            if (!empty($data['remove_imagen_3']) && $producto->imagen_3) {
                Storage::disk('public')->delete($producto->imagen_3);
                $producto->imagen_3 = null;
            }

            if ($request->hasFile('imagen_1')) {
                if ($producto->imagen_1) {
                    Storage::disk('public')->delete($producto->imagen_1);
                }
                $producto->imagen_1 = $request->file('imagen_1')->store('productos', 'public');
            }

            if ($request->hasFile('imagen_2')) {
                if ($producto->imagen_2) {
                    Storage::disk('public')->delete($producto->imagen_2);
                }
                $producto->imagen_2 = $request->file('imagen_2')->store('productos', 'public');
            }

            if ($request->hasFile('imagen_3')) {
                if ($producto->imagen_3) {
                    Storage::disk('public')->delete($producto->imagen_3);
                }
                $producto->imagen_3 = $request->file('imagen_3')->store('productos', 'public');
            }

            unset(
                $data['imagen_1'],
                $data['imagen_2'],
                $data['imagen_3'],
                $data['remove_imagen_1'],
                $data['remove_imagen_2'],
                $data['remove_imagen_3']
            );

            if (array_key_exists('url_amigable', $data)) {
                $slugBase = !empty($data['url_amigable'])
                    ? $data['url_amigable']
                    : ($data['nombre'] ?? $producto->nombre);

                $data['url_amigable'] = $this->generateUniqueSlug($slugBase, $producto->id_producto);
            }

            $producto->fill($data);
            $producto->save();

            if (array_key_exists('fichas', $data)) {
                $producto->fichasTecnicas()->delete();

                foreach ($data['fichas'] ?? [] as $fila) {
                    $producto->fichasTecnicas()->create([
                        'caracteristica' => $fila['caracteristica'],
                        'especificacion' => $fila['especificacion'],
                    ]);
                }
            }

            return response()->json(
                $producto->load(['categoria', 'marca', 'proveedor', 'fichasTecnicas'])
            );
        });
    }

    // PATCH /api/productos/{id}/estado
    public function updateEstado(Request $request, int $id)
    {
        $producto = Producto::where('id_producto', $id)->firstOrFail();

        if ((int)$producto->estado === 2) {
            return response()->json(['message' => 'Producto eliminado. No se puede cambiar estado.'], 409);
        }

        $data = $request->validate([
            'estado' => ['required', 'integer', Rule::in([0,1])],
        ]);

        $producto->estado = (int)$data['estado'];
        $producto->save();

        return response()->json($producto);
    }

    // DELETE /api/productos/{id} => estado=2
    public function destroy(int $id)
    {
        $producto = Producto::where('id_producto', $id)->firstOrFail();

        $producto->estado = 2;
        $producto->save();

        return response()->json([
            'message' => 'Producto marcado como eliminado (estado=2).'
        ]);
    }
}