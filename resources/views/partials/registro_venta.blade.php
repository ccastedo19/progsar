<div class="container my-4" id="registro-venta-page">

  <div class="d-flex justify-content-between align-items-center mb-3">
    <h3 class="mb-0">Registro de Ventas</h3>
  </div>

  <div class="card shadow-sm">
    <div class="card-body">

      <div class="row g-2 align-items-center mb-3">

        <div class="col-12 col-md-5">
          <label style="visibility: hidden;" class="form-label small">Buscar</label>
          <div class="input-group">
            
            <span class="input-group-text">
              <i class="bi bi-search"></i>
            </span>
            
            <input
              type="text"
              class="form-control"
              id="searchRegistroVentas"
              placeholder="Buscar por número o cliente..."
            >
          </div>
        </div>

        <div class="col-12 col-md-2">
          <label class="form-label small">Fecha desde</label>
          <input
            type="date"
            class="form-control"
            id="filtroDesde"
            title="Fecha desde"
          >
        </div>

        <div class="col-12 col-md-2">
          <label class="form-label small">Fecha hasta</label>
          <input
            type="date"
            class="form-control"
            id="filtroHasta"
            title="Fecha hasta"
          >
        </div>

        <div class="col-6 col-md-1">
           <label style="visibility: hidden;" class="form-label small">...</label>
          <button
            type="button"
            class="btn btn-primary w-100"
            id="btnFiltrar"
            title="Filtrar"
          >
            <i class="bi bi-funnel"></i>
          </button>
        </div>

        <div class="col-6 col-md-1">
          <label style="visibility: hidden;" class="form-label small">...</label>
          <button
            type="button"
            class="btn btn-outline-secondary w-100"
            id="btnLimpiarFiltros"
            title="Limpiar filtros"
          >
            <i class="bi bi-eraser"></i>
          </button>
        </div>

      </div>

      <div class="table-responsive">
        <table class="table table-hover align-middle">

          <thead class="table-light">
            <tr>
              <th style="width:120px;">Nro Venta</th>
              <th style="width:130px;">Fecha</th>
              <th>Cliente</th>
              <th class="text-end" style="width:160px;">Total Venta</th>
              <th class="text-end" style="width:160px;">Ganancia</th>
              <th class="text-center" style="width:120px;">Acción</th>
            </tr>
          </thead>

          <tbody id="tbodyRegistroVentas"></tbody>

        </table>
      </div>

    </div>
  </div>

  <!-- MODAL DETALLE PRODUCTOS -->
  <div class="modal fade" id="modalDetalleVenta" tabindex="-1">
    <div class="modal-dialog modal-xl modal-dialog-centered">
      <div class="modal-content">

        <div class="modal-header">
          <h5 class="modal-title">Detalle de Productos</h5>
          <button class="btn-close" data-bs-dismiss="modal"></button>
        </div>

        <div class="modal-body">
          <div class="table-responsive">
            <table class="table table-bordered table-sm align-middle">

              <thead class="table-light">
                <tr>
                  <th>Producto</th>
                  <th class="text-end">Precio Unit</th>
                  <th class="text-end">Precio Compra</th>
                  <th class="text-center">Cantidad</th>
                  <th class="text-end">Total</th>
                  <th class="text-end">Ganancia</th>
                </tr>
              </thead>

              <tbody id="tbodyDetalleVenta"></tbody>

              <tfoot>
                <tr class="fw-semibold">
                  <td colspan="4" class="text-end">Total Venta</td>
                  <td class="text-end" id="totalVentaDetalle"></td>
                  <td></td>
                </tr>

                <tr class="fw-semibold text-success">
                  <td colspan="5" class="text-end">Ganancia Total</td>
                  <td class="text-end" id="totalGananciaDetalle"></td>
                </tr>
              </tfoot>

            </table>
          </div>
        </div>

      </div>
    </div>
  </div>

  <!-- MODAL PDF -->
  <div class="modal fade" id="modalPdfVenta" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-fullscreen">
      <div class="modal-content">

        <div class="modal-header">
          <h5 class="modal-title">Vista previa de venta</h5>

          <div class="d-flex gap-2">
            <button type="button" class="btn btn-primary" id="btnPdfDescargar">
              Descargar
            </button>

            <button type="button" class="btn btn-secondary" id="btnPdfImprimir">
              Imprimir
            </button>

            <button type="button" class="btn btn-danger" data-bs-dismiss="modal">
              Cerrar
            </button>
          </div>
        </div>

        <div class="modal-body p-0">
          <iframe
            id="pdfPreviewFrame"
            style="width:100%; height:calc(100vh - 80px); border:0;">
          </iframe>
        </div>

      </div>
    </div>
  </div>

</div>