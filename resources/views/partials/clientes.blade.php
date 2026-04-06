<div class="container my-4" id="clientes-page">
  <div class="d-flex align-items-center justify-content-between mb-3">
    <h3 class="mb-0">Clientes</h3>

    <button type="button" class="btn btn-danger" id="btnNuevoCliente">
      <i class="bi bi-plus-circle me-1"></i> Nuevo Cliente
    </button>
  </div>

  <div class="card shadow-sm">
    <div class="card-body">

      <div class="row g-2 align-items-center mb-3">
        <div class="col-12 col-md-6">
          <div class="input-group">
            <span class="input-group-text"><i class="bi bi-search"></i></span>
            <input type="text" class="form-control" id="clientesSearch" placeholder="Buscar por nombre, teléfono o CI/NIT...">
          </div>
        </div>

        <div class="col-12 col-md-3 ms-md-auto">
          <div class="input-group">
            <span class="input-group-text">Mostrar</span>
            <select class="form-select" id="clientesPageSize">
              <option value="5">5</option>
              <option value="10" selected>10</option>
              <option value="20">20</option>
              <option value="all">Todos</option>
            </select>
          </div>
        </div>
      </div>

      <div class="table-responsive">
        <table class="table align-middle table-hover mb-0" id="clientesTable">
          <thead class="table-light">
            <tr>
              <th style="width:70px;">N°</th>
              <th>Nombre Completo</th>
              <th style="width:160px;">Teléfono</th>
              <th style="width:170px;">CI o NIT</th>
              <th style="width:160px;" class="text-end">Acción</th>
            </tr>
          </thead>
          <tbody id="clientesTbody">
            {{-- renderizado por JS --}}
          </tbody>
        </table>
      </div>

      <div class="d-flex align-items-center justify-content-between mt-3">
        <div class="text-muted small" id="clientesInfo"></div>
        <nav>
          <ul class="pagination pagination-sm mb-0" id="clientesPagination"></ul>
        </nav>
      </div>

    </div>
  </div>

  {{-- Toast container --}}
  <div class="toast-container position-fixed top-0 end-0 p-3" id="toastContainer" style="z-index: 1080;"></div>

  {{-- Modal: Cliente --}}
  <div class="modal fade" id="modalCliente" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="modalClienteTitle">Nuevo Cliente</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
        </div>

        <form id="formCliente" novalidate>
          <div class="modal-body">
            <div class="row g-3">
              <div class="col-12 col-md-6">
                <label class="form-label">Nombre / Razón social</label>
                <input type="text" class="form-control" id="cNombre">
                <div class="invalid-feedback">El nombre es obligatorio.</div>
              </div>

              <div class="col-12 col-md-6">
                <label class="form-label">Apellido</label>
                <input type="text" class="form-control" id="cApellido">
                <div class="invalid-feedback">Apellido inválido.</div>
              </div>

              <div class="col-12 col-md-6">
                <label class="form-label">Teléfono</label>
                <input type="text" class="form-control" id="cTelefono" placeholder="Ej: 70000000">
                <div class="invalid-feedback">Teléfono obligatorio (mín. 8 dígitos).</div>
              </div>

              <div class="col-12 col-md-6">
                <label class="form-label">CI / NIT</label>
                <input type="text" class="form-control" id="cCi" placeholder="Ej: 1234567 / 123456789">
                <div class="invalid-feedback">CI/NIT inválido.</div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="submit" class="btn btn-danger" id="btnGuardarCliente">
              <i class="bi bi-check2-circle me-1"></i> Guardar
            </button>
          </div>
        </form>

      </div>
    </div>
  </div>

  {{-- Modal: Confirmar eliminación --}}
    <div class="modal fade" id="modalConfirmDeleteCliente" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
          <div class="modal-header">
              <h5 class="modal-title">Eliminar cliente</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
          </div>

          <div class="modal-body">
              <div class="d-flex gap-3 align-items-start">
              <div class="fs-3 text-danger"><i class="bi bi-exclamation-triangle"></i></div>
              <div>
                  <div class="fw-semibold" id="deleteClienteTitle">¿Eliminar este cliente?</div>
              </div>
              </div>
          </div>

          <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button type="button" class="btn btn-danger" id="btnConfirmDeleteCliente">
              <i class="bi bi-trash me-1"></i> Eliminar
              </button>
          </div>
          </div>
      </div>
    </div>


</div>