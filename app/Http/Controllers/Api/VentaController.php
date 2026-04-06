<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Venta;
use App\Models\VentaDetalle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use App\Models\Producto;

class VentaController extends Controller
{
    public function index(Request $request)
    {
        $query = Venta::with(['cliente'])
            ->orderByDesc('id_venta');

        // filtro por estado
        if ($request->filled('estado')) {
            $query->where('estado', $request->estado);
        }

        // filtro fecha desde
        if ($request->filled('desde')) {
            $query->whereDate('fecha', '>=', $request->desde);
        }

        // filtro fecha hasta
        if ($request->filled('hasta')) {
            $query->whereDate('fecha', '<=', $request->hasta);
        }

        $ventas = $query->get()->map(function ($venta) {

            $clienteNombre = trim(
                ($venta->cliente->Nombre ?? '') . ' ' .
                ($venta->cliente->Apellido ?? '')
            );

            $clienteTelefono = $venta->cliente->telefono ?? null;

            return [
                'id_venta' => $venta->id_venta,
                'numero' => $venta->numero,
                'fecha' => $venta->fecha,

                'facturado_estado' => $venta->facturado_estado,
                'porcentaje_factura' => $venta->porcentaje_factura,
                'delivery' => $venta->delivery,

                'total_sin_factura' => $venta->total_sin_factura,
                'total_con_factura' => $venta->total_con_factura,

                'estado' => $venta->estado,

                'motivo_anulacion' => $venta->motivo_anulacion,
                'fecha_anulacion' => $venta->fecha_anulacion,

                'cliente' => [
                    'id_cliente' => $venta->cliente->id_cliente ?? null,
                    'nombre_completo' => $clienteNombre,
                    'telefono' => $clienteTelefono,
                ],
            ];
        });

        return response()->json($ventas, 200);
    }

    public function show($id)
    {
        $venta = Venta::with(['cliente', 'detalles.producto.fichasTecnicas'])
            ->find($id);

        if (!$venta) {
            return response()->json([
                'message' => 'Venta no encontrada'
            ], 404);
        }

        $clienteNombre = trim(($venta->cliente->Nombre ?? '') . ' ' . ($venta->cliente->Apellido ?? ''));
        $clienteTelefono = $venta->cliente->telefono ?? null;

        return response()->json([
            'id_venta' => $venta->id_venta,
            'numero' => $venta->numero,
            'fecha' => $venta->fecha,
            'facturado_estado' => $venta->facturado_estado,
            'porcentaje_factura' => $venta->porcentaje_factura,
            'delivery' => $venta->delivery,
            'id_cliente' => $venta->id_cliente,
            'total_sin_factura' => $venta->total_sin_factura,
            'total_con_factura' => $venta->total_con_factura,
            'estado' => $venta->estado,
            'cliente' => [
                'id_cliente' => $venta->cliente->id_cliente ?? null,
                'nombre_completo' => $clienteNombre,
                'telefono' => $clienteTelefono,
            ],
            'detalles' => $venta->detalles->map(function ($detalle) {
            return [
                'id_ventas_detalle' => $detalle->id_ventas_detalle,
                'id_producto' => $detalle->id_producto,
                'codigo' => $detalle->codigo,
                'nombre_producto' => $detalle->nombre_producto,
                'precio_unitario' => $detalle->precio_unitario,
                'precio_compra' => $detalle->precio_compra,
                'cantidad' => $detalle->cantidad,
                'descuento' => $detalle->descuento,
                'total_producto' => $detalle->total_producto,
                'fichas_tecnicas' => $detalle->producto && $detalle->producto->fichasTecnicas
                    ? $detalle->producto->fichasTecnicas->map(function ($ficha) {
                        return [
                            'caracteristica' => $ficha->caracteristica,
                            'especificacion' => $ficha->especificacion,
                        ];
                    })->values()
                    : [],
            ];
        })->values(),
        ], 200);
    }

    public function completarPreRegistro(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'detalles' => ['required', 'array', 'min:1'],
            'detalles.*.id_ventas_detalle' => ['required', 'exists:ventas_detalles,id_ventas_detalle'],
            'detalles.*.precio_compra' => ['required', 'numeric', 'min:0'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Datos inválidos',
                'errors' => $validator->errors()
            ], 422);
        }

        DB::beginTransaction();

        try {
            $venta = Venta::with('detalles')->lockForUpdate()->find($id);

            if (!$venta) {
                return response()->json([
                    'message' => 'Venta no encontrada'
                ], 404);
            }

            if ((int)$venta->estado !== 1) {
                return response()->json([
                    'message' => 'La venta no está en pre-registro.'
                ], 422);
            }

            $detalleIdsVenta = $venta->detalles->pluck('id_ventas_detalle')->toArray();

            foreach ($request->detalles as $item) {
                if (!in_array($item['id_ventas_detalle'], $detalleIdsVenta)) {
                    throw new \Exception("El detalle {$item['id_ventas_detalle']} no pertenece a esta venta.");
                }

                VentaDetalle::where('id_ventas_detalle', $item['id_ventas_detalle'])
                    ->where('id_venta', $venta->id_venta)
                    ->update([
                        'precio_compra' => $item['precio_compra']
                    ]);
            }

            $venta->estado = 2;
            $venta->save();

            DB::commit();

            return response()->json([
                'message' => 'Pre-registro completado correctamente.',
                'id_venta' => $venta->id_venta,
                'estado' => $venta->estado
            ], 200);

        } catch (\Throwable $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Error al completar el pre-registro',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function anular(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'motivo_anulacion' => ['nullable', 'string', 'max:500']
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Datos inválidos',
                'errors' => $validator->errors()
            ], 422);
        }

        DB::beginTransaction();

        try {
            $venta = Venta::with('detalles')->lockForUpdate()->find($id);

            if (!$venta) {
                return response()->json([
                    'message' => 'Venta no encontrada'
                ], 404);
            }

            if ((int) $venta->estado === 0) {
                return response()->json([
                    'message' => 'La venta ya está anulada.'
                ], 422);
            }

            foreach ($venta->detalles as $detalle) {
                $producto = Producto::lockForUpdate()->find($detalle->id_producto);

                if (!$producto) {
                    throw new \Exception("No se encontró el producto ID {$detalle->id_producto} para reponer stock.");
                }

                $producto->stock = (int) $producto->stock + (int) $detalle->cantidad;
                $producto->save();
            }

            $venta->estado = 0;
            $venta->motivo_anulacion = $request->motivo_anulacion;
            $venta->fecha_anulacion = now();
            $venta->save();

            DB::commit();

            return response()->json([
                'message' => 'Venta anulada correctamente.',
                'id_venta' => $venta->id_venta,
                'estado' => $venta->estado
            ], 200);

        } catch (\Throwable $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Error al anular la venta',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'fecha' => ['required', 'date'],

            'facturado_estado' => ['required', 'in:0,1'],
            'porcentaje_factura' => ['nullable', 'numeric', 'min:0'],

            'delivery' => ['nullable', 'numeric', 'min:0'],

            'id_cliente' => ['required', 'exists:clientes,id_cliente'],

            'total_sin_factura' => ['required', 'numeric', 'min:0'],
            'total_con_factura' => ['required', 'numeric', 'min:0'],

            'estado' => ['nullable', 'in:0,1,2'],

            'detalles' => ['required', 'array', 'min:1'],

            'detalles.*.id_producto' => ['required', 'exists:productos,id_producto'],
            'detalles.*.codigo' => ['required', 'string', 'max:100'],
            'detalles.*.nombre_producto' => ['required', 'string', 'max:255'],
            'detalles.*.precio_unitario' => ['required', 'numeric', 'min:0.01'],
            'detalles.*.precio_compra' => ['required', 'numeric', 'min:0'],
            'detalles.*.cantidad' => ['required', 'integer', 'min:1'],
            'detalles.*.descuento' => ['nullable', 'numeric', 'min:0'],
            'detalles.*.total_producto' => ['required', 'numeric', 'min:0'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Datos inválidos',
                'errors' => $validator->errors()
            ], 422);
        }

        DB::beginTransaction();

        try {
            $ultimoNumero = Venta::max('numero');
            $nuevoNumero = $ultimoNumero ? $ultimoNumero + 1 : 1;

            $venta = Venta::create([
                'numero' => $nuevoNumero,
                'fecha' => $request->fecha,
                'facturado_estado' => $request->facturado_estado,
                'porcentaje_factura' => $request->porcentaje_factura ?? 0,
                'delivery' => $request->delivery ?? 0,
                'id_cliente' => $request->id_cliente,
                'total_sin_factura' => $request->total_sin_factura,
                'total_con_factura' => $request->total_con_factura,
                'estado' => $request->estado ?? 2,
            ]);

            foreach ($request->detalles as $detalle) {
                $producto = Producto::lockForUpdate()->find($detalle['id_producto']);

                if (!$producto) {
                    throw new \Exception("Producto no encontrado.");
                }

                $cantidadVenta = (int) $detalle['cantidad'];

                if ((int) $producto->stock < $cantidadVenta) {
                    throw new \Exception("Stock insuficiente para el producto {$producto->nombre}. Disponible: {$producto->stock}.");
                }

                VentaDetalle::create([
                    'id_venta' => $venta->id_venta,
                    'id_producto' => $detalle['id_producto'],
                    'codigo' => $detalle['codigo'],
                    'nombre_producto' => $detalle['nombre_producto'],
                    'precio_unitario' => $detalle['precio_unitario'],
                    'precio_compra' => $detalle['precio_compra'],
                    'cantidad' => $cantidadVenta,
                    'descuento' => $detalle['descuento'] ?? 0,
                    'total_producto' => $detalle['total_producto'],
                ]);

                $producto->stock = (int) $producto->stock - $cantidadVenta;
                $producto->save();
            }

            DB::commit();

            return response()->json([
                'message' => 'Venta registrada correctamente',
                'venta_id' => $venta->id_venta,
                'numero' => $venta->numero,
            ], 201);

        } catch (\Throwable $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Error al registrar la venta',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    
}