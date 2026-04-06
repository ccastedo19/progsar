<div class="container my-4" id="ventas-anuladas-page">

  <div class="d-flex justify-content-between align-items-center mb-3">
    <h3 class="mb-0">Ventas Anuladas</h3>
  </div>

  <div class="card shadow-sm">
    <div class="card-body">

      <div class="row g-2 mb-3 align-items-end">

        <div class="col-12 col-md-4">
          <label class="form-label small">Buscar</label>
          <div class="input-group">
            <span class="input-group-text">
              <i class="bi bi-search"></i>
            </span>
            <input
              type="text"
              class="form-control"
              id="searchVentasAnuladas"
              placeholder="Buscar por número, cliente o motivo..."
            >
          </div>
        </div>

        <div class="col-12 col-md-3">
          <label class="form-label small">Fecha desde</label>
          <input type="date" class="form-control" id="filtroDesde">
        </div>

        <div class="col-12 col-md-3">
          <label class="form-label small">Fecha hasta</label>
          <input type="date" class="form-control" id="filtroHasta">
        </div>

        <div class="col-6 col-md-1">
          <button type="button" class="btn btn-primary w-100" id="btnFiltrar">
            <i class="bi bi-funnel"></i>
          </button>
        </div>

        <div class="col-6 col-md-1">
          <button type="button" class="btn btn-outline-secondary w-100" id="btnLimpiarFiltros">
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
              <th style="width:160px;">Facturación</th>
              <th>Motivo</th>
              <th style="width:150px;">Fecha anulación</th>
              <th class="text-end" style="width:160px;">Total</th>
              <th class="text-center" style="width:100px;">Acción</th>
            </tr>
          </thead>

          <tbody id="tbodyVentasAnuladas"></tbody>

        </table>
      </div>

    </div>
  </div>

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
            style="width:100%; height:calc(100vh - 80px); border:0;"
          ></iframe>
        </div>

      </div>
    </div>
  </div>

</div>