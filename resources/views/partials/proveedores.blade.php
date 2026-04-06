<div class="container my-4" id="proveedores-page">
  <div class="d-flex align-items-center justify-content-between mb-3">
    <h3 class="mb-0">Proveedores</h3>

    <button type="button" class="btn btn-danger" id="btnNuevoProveedor">
      <i class="bi bi-plus-circle me-1"></i> Nuevo Proveedor
    </button>
  </div>

  <div class="card shadow-sm">
    <div class="card-body">

      <div class="row g-2 align-items-center mb-3">
        <div class="col-12 col-md-6">
          <div class="input-group">
            <span class="input-group-text"><i class="bi bi-search"></i></span>
            <input type="text" class="form-control" id="proveedoresSearch" placeholder="Buscar por NIT, empresa, teléfono, ciudad o dirección...">
          </div>
        </div>

        <div class="col-12 col-md-3 ms-md-auto">
          <div class="input-group">
            <span class="input-group-text">Mostrar</span>
            <select class="form-select" id="proveedoresPageSize">
              <option value="5">5</option>
              <option value="10" selected>10</option>
              <option value="20">20</option>
              <option value="all">Todos</option>
            </select>
          </div>
        </div>
      </div>

      <div class="table-responsive">
        <table class="table align-middle table-hover mb-0" id="proveedoresTable">
          <thead class="table-light">
            <tr>
              <th style="width:70px;">N°</th>
              <th style="width:120px;">NIT</th>
              <th style="width:150px;">Empresa</th>
              <th style="width:140px;">Teléfono</th>
              <th style="width:160px;">Ciudad</th>
              <th style="width:300px;">Dirección</th>
              <th style="width:100px;">Estado</th>
              <th style="width:80px;" class="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody id="proveedoresTbody">
            {{-- renderizado por JS --}}
          </tbody>
        </table>
      </div>

      <div class="d-flex align-items-center justify-content-between mt-3">
        <div class="text-muted small" id="proveedoresInfo"></div>
        <nav>
          <ul class="pagination pagination-sm mb-0" id="proveedoresPagination"></ul>
        </nav>
      </div>

    </div>
  </div>

  {{-- Toast container --}}
  <div class="toast-container position-fixed top-0 end-0 p-3" id="toastContainer" style="z-index: 1080;"></div>

  {{-- Modal: Nuevo / Editar Proveedor --}}
  <div class="modal fade" id="modalProveedor" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="modalProveedorTitle">Nuevo Proveedor</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
        </div>

        <form id="formProveedor" novalidate>
          <div class="modal-body">
            <div class="row g-3">

              <div class="col-12 col-md-6">
                <label class="form-label">NIT</label>
                <input type="text" class="form-control" id="provNit" maxlength="50">
                <div class="invalid-feedback">NIT inválido.</div>
              </div>

              <div class="col-12 col-md-6">
                <label class="form-label">Empresa</label>
                <input type="text" class="form-control" id="provEmpresa" maxlength="150">
                <div class="invalid-feedback">La empresa es obligatoria.</div>
              </div>

              <div class="col-12 col-md-6">
                <label class="form-label">Teléfono</label>
                <input type="text" class="form-control" id="provTelefono" maxlength="20">
                <div class="invalid-feedback">El teléfono es obligatorio.</div>
              </div>

              <div class="col-12 col-md-6">
                <label class="form-label">Ciudad</label>
                <input type="text" class="form-control" id="provCiudad" maxlength="100">
                <div class="invalid-feedback">Ciudad inválida.</div>
              </div>

              <div class="col-12">
                <label class="form-label">Dirección</label>
                <textarea class="form-control" id="provDireccion" rows="3" maxlength="255"></textarea>
                <div class="invalid-feedback">La dirección es obligatoria.</div>
              </div>

            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="submit" class="btn btn-danger" id="btnGuardarProveedor">
              <i class="bi bi-check2-circle me-1"></i> Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  {{-- Modal: Confirmar eliminar --}}
  <div class="modal fade" id="modalConfirmDeleteProveedor" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Eliminar proveedor</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
        </div>

        <div class="modal-body">
          <div class="d-flex gap-3 align-items-start">
            <div class="fs-3 text-danger"><i class="bi bi-exclamation-triangle"></i></div>
            <div>
              <div class="fw-semibold" id="deleteProveedorTitle">¿Eliminar este proveedor?</div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
          <button type="button" class="btn btn-danger" id="btnConfirmDeleteProveedor">
            <i class="bi bi-trash me-1"></i> Eliminar
          </button>
        </div>
      </div>
    </div>
  </div>
</div>