<div class="container my-4" id="pre-registro-venta-page">
  <div class="d-flex align-items-center justify-content-between mb-3">
    <h3 class="mb-0">Pre-registro de Ventas</h3>
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
              id="preVentaSearch"
              placeholder="Buscar por número o cliente..."
            >
          </div>
        </div>

        <div class="col-12 col-md-3 ms-md-auto">
          <div class="input-group">
            <span class="input-group-text">Mostrar</span>
            <select class="form-select" id="preVentaPageSize">
              <option value="5">5</option>
              <option value="10" selected>10</option>
              <option value="20">20</option>
              <option value="all">Todos</option>
            </select>
          </div>
        </div>
      </div>

      <div class="table-responsive">
        <table class="table align-middle table-hover mb-0">
          <thead class="table-light">
            <tr>
              <th style="width:110px;">Número</th>
              <th style="width:130px;">Fecha</th>
              <th>Cliente</th>
              <th style="width:160px;" class="text-end">Total</th>
              <th style="width:140px;" class="text-center">Facturación</th>
              <th style="width:140px;" class="text-end">Acción</th>
            </tr>
          </thead>
          <tbody id="preVentaTbody"></tbody>
        </table>
      </div>

      <div class="d-flex align-items-center justify-content-between mt-3">
        <div class="text-muted small" id="preVentaInfo"></div>
        <nav>
          <ul class="pagination pagination-sm mb-0" id="preVentaPagination"></ul>
        </nav>
      </div>

    </div>
  </div>

  <div class="toast-container position-fixed top-0 end-0 p-3" id="preVentaToastContainer" style="z-index:1080;"></div>

  <div class="modal fade" id="modalConfirmRegistrarVenta" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Registrar venta</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
        </div>

        <div class="modal-body">
          <div class="d-flex gap-3 align-items-start">
            <div class="fs-3 text-primary"><i class="bi bi-check2-circle"></i></div>
            <div>
              <div class="fw-semibold" id="registrarVentaTitle">¿Registrar esta venta?</div>
              <div class="text-muted small">Esta acción cambiará el estado de pre-registro a registrada.</div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
          <button type="button" class="btn btn-primary" id="btnConfirmRegistrarVenta">
            <i class="bi bi-check2-circle me-1"></i> Registrar
          </button>
        </div>
      </div>
    </div>
  </div>


  <div class="modal fade" id="modalCompletarPreRegistro" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title">
            Completar pre-registro de venta <span id="modalPreRegistroNumero"></span>
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
        </div>

        <div class="modal-body">
            <div class="mb-3">
            <div><strong>Cliente:</strong> <span id="modalPreRegistroCliente">-</span></div>
            <div><strong>Fecha:</strong> <span id="modalPreRegistroFecha">-</span></div>
            </div>
            <div class="alert alert-info py-2 px-3 mb-3" role="alert">
                Ingrese el <strong>precio de compra unitario</strong> de cada producto. 
                No multiplique por la cantidad; el sistema hará el cálculo total automáticamente.
            </div>

            <div class="table-responsive">
            <table class="table table-bordered align-middle">
               <thead class="table-light">
                <tr>
                    <th style="width:120px;">Código</th>
                    <th>Producto</th>
                    <th style="width:120px;" class="text-end">Cantidad</th>
                    <th style="width:160px;" class="text-end">Precio Venta</th>
                    <th style="width:180px;" class="text-end">Precio Compra Unit.</th>
                </tr>
                </thead>
                <tbody id="preRegistroDetalleTbody"></tbody>
            </table>
            </div>
        </div>

        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-success" id="btnGuardarPreRegistro">
            <i class="bi bi-check2-circle me-1"></i> Guardar y completar
            </button>
        </div>
        </div>
    </div>
  </div>
 

    <div class="modal fade" id="modalAnularVenta" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title">Anular venta</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
        </div>

        <div class="modal-body">
            <p class="mb-2">
            ¿Está seguro de anular la venta <strong id="anularVentaNumero">-</strong>?
            </p>
            <p class="text-muted small mb-3">
            Esta acción repondrá el stock de los productos vendidos.
            </p>

            <div class="mb-0">
            <label for="anularVentaMotivo" class="form-label">Motivo de anulación (opcional)</label>
            <textarea
                id="anularVentaMotivo"
                class="form-control"
                rows="3"
                maxlength="500"
                placeholder="Ejemplo: venta cargada por error, cliente canceló, duplicado..."
            ></textarea>
            </div>
        </div>

        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-danger" id="btnConfirmAnularVenta">
            <i class="bi bi-x-circle me-1"></i> Anular venta
            </button>
        </div>
        </div>
    </div>
    </div>

</div>