<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cotizacion;
use App\Models\CotizacionDetalle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class CotizacionController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [

            'fecha' => ['required','date'],
            'fecha_vigencia' => ['nullable','date'],

            'facturado_estado' => ['required','in:0,1,2'],
            'porcentaje_factura' => ['nullable','numeric','min:0'],

            'delivery' => ['nullable','numeric','min:0'],

            'id_cliente' => ['required','exists:clientes,id_cliente'],

            'total_sin_factura' => ['required','numeric','min:0'],
            'total_con_factura' => ['required','numeric','min:0'],

            'detalles' => ['required','array','min:1'],

            'detalles.*.id_producto' => ['required','exists:productos,id_producto'],
            'detalles.*.codigo' => ['required','string','max:100'],
            'detalles.*.nombre_producto' => ['required','string','max:255'],
            'detalles.*.precio_unitario' => ['required','numeric','min:0'],
            'detalles.*.cantidad' => ['required','integer','min:1'],
            'detalles.*.descuento' => ['nullable','numeric','min:0'],
            'detalles.*.total_producto' => ['required','numeric','min:0'],

        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Datos inválidos',
                'errors' => $validator->errors()
            ],422);
        }

        DB::beginTransaction();

        try {

            $ultimoNumero = Cotizacion::max('numero');
            $nuevoNumero = $ultimoNumero ? $ultimoNumero + 1 : 1;

            $cotizacion = Cotizacion::create([
                'numero' => $nuevoNumero,
                'fecha' => $request->fecha,
                'fecha_vigencia' => $request->fecha_vigencia,
                'facturado_estado' => $request->facturado_estado,
                'porcentaje_factura' => $request->porcentaje_factura ?? 0,
                'delivery' => $request->delivery ?? 0,
                'id_cliente' => $request->id_cliente,
                'total_sin_factura' => $request->total_sin_factura,
                'total_con_factura' => $request->total_con_factura,
                'estado' => 1
            ]);

            foreach ($request->detalles as $detalle) {

                CotizacionDetalle::create([
                    'id_cotizacion' => $cotizacion->id_cotizacion,
                    'id_producto' => $detalle['id_producto'],
                    'codigo' => $detalle['codigo'],
                    'nombre_producto' => $detalle['nombre_producto'],
                    'precio_unitario' => $detalle['precio_unitario'],
                    'cantidad' => $detalle['cantidad'],
                    'descuento' => $detalle['descuento'] ?? 0,
                    'total_producto' => $detalle['total_producto']
                ]);

            }

            DB::commit();

            return response()->json([
                'message' => 'Cotización registrada correctamente',
                'cotizacion_id' => $cotizacion->id_cotizacion
            ],201);

        } catch (\Throwable $e) {

            DB::rollBack();

            return response()->json([
                'message' => 'Error al registrar la cotización',
                'error' => $e->getMessage()
            ],500);
        }
    }

    public function index()
    {
        $cotizaciones = Cotizacion::with(['cliente'])
            ->orderByDesc('id_cotizacion')
            ->get()
            ->map(function ($cotizacion) {
                $clienteNombre = trim(($cotizacion->cliente->Nombre ?? '') . ' ' . ($cotizacion->cliente->Apellido ?? ''));
                $clienteTelefono = $cotizacion->cliente->telefono ?? null;

                return [
                    'id_cotizacion' => $cotizacion->id_cotizacion,
                    'numero' => $cotizacion->numero,
                    'fecha' => $cotizacion->fecha,
                    'fecha_vigencia' => $cotizacion->fecha_vigencia,
                    'facturado_estado' => $cotizacion->facturado_estado,
                    'porcentaje_factura' => $cotizacion->porcentaje_factura,
                    'delivery' => $cotizacion->delivery,
                    'total_sin_factura' => $cotizacion->total_sin_factura,
                    'total_con_factura' => $cotizacion->total_con_factura,
                    'estado' => $cotizacion->estado,
                    'cliente' => [
                        'id_cliente' => $cotizacion->cliente->id_cliente ?? null,
                        'nombre_completo' => $clienteNombre,
                        'telefono' => $clienteTelefono,
                    ]
                ];
            });

        return response()->json($cotizaciones, 200);
    }

    public function show($id)
    {
        $cotizacion = Cotizacion::with(['cliente', 'detalles.producto.fichasTecnicas'])
            ->find($id);

        if (!$cotizacion) {
            return response()->json([
                'message' => 'Cotización no encontrada'
            ], 404);
        }

        $clienteNombre = trim(($cotizacion->cliente->Nombre ?? '') . ' ' . ($cotizacion->cliente->Apellido ?? ''));
        $clienteTelefono = $cotizacion->cliente->telefono ?? null;

        return response()->json([
            'id_cotizacion' => $cotizacion->id_cotizacion,
            'numero' => $cotizacion->numero,
            'fecha' => $cotizacion->fecha,
            'fecha_vigencia' => $cotizacion->fecha_vigencia,
            'facturado_estado' => $cotizacion->facturado_estado,
            'porcentaje_factura' => $cotizacion->porcentaje_factura,
            'delivery' => $cotizacion->delivery,
            'total_sin_factura' => $cotizacion->total_sin_factura,
            'total_con_factura' => $cotizacion->total_con_factura,
            'estado' => $cotizacion->estado,
            'cliente' => [
                'id_cliente' => $cotizacion->cliente->id_cliente ?? null,
                'nombre_completo' => $clienteNombre,
                'telefono' => $clienteTelefono,
            ],
            'detalles' => $cotizacion->detalles->map(function ($detalle) {
                return [
                    'id_cotizacion_detalle' => $detalle->id_cotizacion_detalle,
                    'id_producto' => $detalle->id_producto,
                    'codigo' => $detalle->codigo,
                    'nombre_producto' => $detalle->nombre_producto,
                    'precio_unitario' => $detalle->precio_unitario,
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
}