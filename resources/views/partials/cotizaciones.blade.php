<div class="container my-4" id="cotizaciones-page">
  <div class="d-flex align-items-center justify-content-between mb-3">
    <h3 class="mb-0">Cotizaciones</h3>
  </div>

  <div class="card shadow-sm">
    <div class="card-body">

      <div class="row g-2 align-items-center mb-3">
        <div class="col-12 col-md-6">
          <div class="input-group">
            <span class="input-group-text"><i class="bi bi-search"></i></span>
            <input
              type="text"
              class="form-control"
              id="cotizacionesSearch"
              placeholder="Buscar por número, cliente o teléfono..."
            >
          </div>
        </div>

        <div class="col-12 col-md-3 ms-md-auto">
          <div class="input-group">
            <span class="input-group-text">Mostrar</span>
            <select class="form-select" id="cotizacionesPageSize">
              <option value="5">5</option>
              <option value="10" selected>10</option>
              <option value="20">20</option>
              <option value="all">Todos</option>
            </select>
          </div>
        </div>
      </div>

      <div class="table-responsive">
        <table class="table align-middle table-hover mb-0" id="cotizacionesTable">
          <thead class="table-light">
            <tr>
              
              <th style="width:50px;">Número</th>
              <th style="width:90px;">Fecha</th>
              <th style="width:90px;">Vigencia</th>
              <th style="width:230px;">Cliente</th>
              <th style="width:120px;">Teléfono</th>
              <th style="width:110px;" class="text-end">Total</th>
              <th style="width:80px;" class="text-center">Facturación</th>
              <th style="width:30px;" class="text-end">Acción</th>
            </tr>
          </thead>
          <tbody id="cotizacionesTbody">
            {{-- renderizado por JS --}}
          </tbody>
        </table>
      </div>

      <div class="d-flex align-items-center justify-content-between mt-3">
        <div class="text-muted small" id="cotizacionesInfo"></div>
        <nav>
          <ul class="pagination pagination-sm mb-0" id="cotizacionesPagination"></ul>
        </nav>
      </div>

    </div>
  </div>

  {{-- Toast container --}}
  <div class="toast-container position-fixed top-0 end-0 p-3" id="cotizacionesToastContainer" style="z-index: 1080;"></div>

  {{-- Modal vista de cotización --}}
  <div class="modal fade" id="modalPdfCotizacion" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-fullscreen">
        <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title">Vista previa de cotización</h5>

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
            <iframe id="pdfPreviewFrame" style="width:100%; height:100%; border:0;"></iframe>
        </div>
        </div>
    </div>
    </div>

</div>