<div class="container my-4" id="marcas-page">
  <div class="d-flex align-items-center justify-content-between mb-3">
    <h3 class="mb-0">Marcas</h3>

    <button type="button" class="btn btn-danger" id="btnNuevaMarca">
      <i class="bi bi-plus-circle me-1"></i> Nueva Marca
    </button>
  </div>

  <div class="card shadow-sm">
    <div class="card-body">

      <div class="row g-2 align-items-center mb-3">
        <div class="col-12 col-md-6">
          <div class="input-group">
            <span class="input-group-text"><i class="bi bi-search"></i></span>
            <input type="text" class="form-control" id="marcasSearch" placeholder="Buscar por nombre o descripción...">
          </div>
        </div>

        <div class="col-12 col-md-3 ms-md-auto">
          <div class="input-group">
            <span class="input-group-text">Mostrar</span>
            <select class="form-select" id="marcasPageSize">
              <option value="5">5</option>
              <option value="10" selected>10</option>
              <option value="20">20</option>
              <option value="all">Todos</option>
            </select>
          </div>
        </div>
      </div>

      <div class="table-responsive">
        <table class="table align-middle table-hover mb-0" id="marcasTable">
          <thead class="table-light">
            <tr>
              <th style="width:40px;">N°</th>
              <th style="width:70px;">Imagen</th>
              <th style="width:120px;">Nombre</th>
              <th style="width:450px;">Descripción</th>
              <th style="width:80px;">Estado</th>
              <th style="width:90px;" class="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody id="marcasTbody">
            {{-- renderizado por JS --}}
          </tbody>
        </table>
      </div>

      <div class="d-flex align-items-center justify-content-between mt-3">
        <div class="text-muted small" id="marcasInfo"></div>
        <nav>
          <ul class="pagination pagination-sm mb-0" id="marcasPagination"></ul>
        </nav>
      </div>

    </div>
  </div>

  {{-- Toast container --}}
  <div class="toast-container position-fixed top-0 end-0 p-3" id="toastContainer" style="z-index: 1080;"></div>

  {{-- Modal: Nueva / Editar Marca --}}
  <div class="modal fade" id="modalMarca" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="modalMarcaTitle">Nueva Marca</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
        </div>

        <form id="formMarca" novalidate>
          <div class="modal-body">
            <div class="row g-3">

              <div class="col-12 col-lg-4">
                <label class="form-label">Imagen</label>

                <div id="marcaImgDropArea"
                     class="border rounded d-flex align-items-center justify-content-center bg-light"
                     style="width:100%; aspect-ratio:1/1; cursor:pointer; position:relative; overflow:hidden;">

                  <img id="marcaImgPreview"
                       alt="Vista previa"
                       style="max-width:100%; max-height:100%; display:none; object-fit:cover;">

                  <div id="marcaImgPlaceholder" class="text-muted text-center p-3">
                    <i class="bi bi-image fs-1"></i>
                    <div class="small">Click para seleccionar imagen</div>
                  </div>
                </div>

                <input type="file" id="marcaImg" accept="image/*" style="display:none;">

                <div class="d-flex justify-content-end mt-2">
                  <button type="button" class="btn btn-sm btn-danger" id="btnRemoveMarcaImg">
                    <i class="bi bi-trash me-1"></i> Quitar imagen
                  </button>
                </div>
              </div>

              <div class="col-12 col-lg-8">
                <div class="row g-3">

                  <div class="col-12">
                    <label class="form-label">Nombre</label>
                    <input type="text" class="form-control" id="marcaNombre" maxlength="100">
                    <div class="invalid-feedback">El nombre es obligatorio (máx. 100).</div>
                  </div>

                  <div class="col-12">
                    <label class="form-label">Descripción</label>
                    <textarea class="form-control" id="marcaDescripcion" rows="5" maxlength="500"></textarea>
                    <div class="form-text">Máx. 500 caracteres.</div>
                  </div>

                </div>
              </div>

            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="submit" class="btn btn-danger" id="btnGuardarMarca">
              <i class="bi bi-check2-circle me-1"></i> Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  {{-- Modal: Confirmar activar/inactivar --}}
  <div class="modal fade" id="modalConfirmToggleMarca" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="toggleMarcaModalTitle">Cambiar estado</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
        </div>

        <div class="modal-body">
          <div class="d-flex gap-3 align-items-start">
            <div class="fs-3 text-warning"><i class="bi bi-exclamation-triangle"></i></div>
            <div>
              <div class="fw-semibold" id="toggleMarcaTitle">¿Cambiar estado?</div>
              <div class="text-muted small" id="toggleMarcaHint"></div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
          <button type="button" class="btn btn-warning" id="btnConfirmToggleMarca">
            <i class="bi bi-check-circle me-1"></i> Confirmar
          </button>
        </div>
      </div>
    </div>
  </div>

  {{-- Modal: Confirmar eliminar --}}
  <div class="modal fade" id="modalConfirmDeleteMarca" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Eliminar marca</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
        </div>

        <div class="modal-body">
          <div class="d-flex gap-3 align-items-start">
            <div class="fs-3 text-danger"><i class="bi bi-exclamation-triangle"></i></div>
            <div>
              <div class="fw-semibold" id="deleteMarcaTitle">¿Eliminar esta marca?</div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
          <button type="button" class="btn btn-danger" id="btnConfirmDeleteMarca">
            <i class="bi bi-trash me-1"></i> Eliminar
          </button>
        </div>
      </div>
    </div>
  </div>
</div>