<div class="container my-4" id="categorias-page">
  <div class="d-flex align-items-center justify-content-between mb-3">
    <h3 class="mb-0">Categorías</h3>

    <button type="button" class="btn btn-danger" id="btnNuevoCategoria">
      <i class="bi bi-plus-circle me-1"></i> Nueva Categoría
    </button>
  </div>

  <div class="card shadow-sm">
    <div class="card-body">

      <div class="row g-2 align-items-center mb-3">
        <div class="col-12 col-md-6">
          <div class="input-group">
            <span class="input-group-text"><i class="bi bi-search"></i></span>
            <input type="text" class="form-control" id="categoriasSearch" placeholder="Buscar por nombre o descripción...">
          </div>
        </div>

        <div class="col-12 col-md-3 ms-md-auto">
          <div class="input-group">
            <span class="input-group-text">Mostrar</span>
            <select class="form-select" id="categoriasPageSize">
              <option value="5">5</option>
              <option value="10" selected>10</option>
              <option value="20">20</option>
              <option value="all">Todos</option>
            </select>
          </div>
        </div>
      </div>

      <div class="table-responsive">
        <table class="table align-middle table-hover mb-0" id="categoriasTable">
          <thead class="table-light">
                <tr>
                    <th style="width:60px;">N°</th>
                    <th style="width:80px;">Imagen</th>
                    <th style="width:150px;">Nombre</th>
                    <th style="width:380px;">Descripción</th>
                    <th style="width:30px;">Estado</th>
                    <th style="width:50px;" class="text-end">Acciones</th>
                </tr>
            </thead>
          <tbody id="categoriasTbody">
            {{-- renderizado por JS --}}
          </tbody>
        </table>
      </div>

      <div class="d-flex align-items-center justify-content-between mt-3">
        <div class="text-muted small" id="categoriasInfo"></div>
        <nav>
          <ul class="pagination pagination-sm mb-0" id="categoriasPagination"></ul>
        </nav>
      </div>

    </div>
  </div>

  {{-- Toast container --}}
  <div class="toast-container position-fixed top-0 end-0 p-3" id="toastContainer" style="z-index: 1080;"></div>

  {{-- Modal: Nueva/Editar Categoría --}}
  <div class="modal fade" id="modalCategoria" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="modalCategoriaTitle">Nueva Categoría</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
        </div>

        <form id="formCategoria" novalidate>
          <div class="modal-body">
            <div class="row g-3">

              <div class="col-12 col-lg-4">
                <label class="form-label">Imagen</label>

                <div id="catImgDropArea"
                     class="border rounded d-flex align-items-center justify-content-center bg-light"
                     style="width:100%; aspect-ratio:1/1; cursor:pointer; position:relative; overflow:hidden;">
                  <img id="catImgPreview"
                       alt="Vista previa"
                       style="max-width:100%; max-height:100%; display:none; object-fit:cover;">
                  <div id="catImgPlaceholder" class="text-muted text-center p-3">
                    <i class="bi bi-image fs-1"></i>
                    <div class="small">Click para seleccionar imagen</div>
                  </div>
                </div>

                <input type="file" id="catImg" accept="image/*" style="display:none;">

                <div class="d-flex justify-content-end mt-2">
                  <button type="button" class="btn btn-sm btn-danger" id="btnRemoveCatImg">
                    <i class="bi bi-trash me-1"></i> Quitar imagen
                  </button>
                </div>
              </div>

              <div class="col-12 col-lg-8">
                <div class="row g-3">

                  <div class="col-12">
                    <label class="form-label">Nombre</label>
                    <input type="text" class="form-control" id="catNombre" maxlength="100">
                    <div class="invalid-feedback">El nombre es obligatorio (máx. 100).</div>
                  </div>

                  <div class="col-12">
                    <label class="form-label">Descripción</label>
                    <textarea class="form-control" id="catDescripcion" rows="5" maxlength="500"></textarea>
                    <div class="form-text">Máx. 500 caracteres.</div>
                  </div>

                </div>
              </div>

            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="submit" class="btn btn-danger" id="btnGuardarCategoria">
              <i class="bi bi-check2-circle me-1"></i> Guardar
            </button>
          </div>
        </form>

      </div>
    </div>
  </div>

  {{-- Modal: Confirmar activar/inactivar --}}
    <div class="modal fade" id="modalConfirmToggleCategoria" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title" id="toggleCategoriaModalTitle">Cambiar estado</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
        </div>

        <div class="modal-body">
            <div class="d-flex gap-3 align-items-start">
            <div class="fs-3 text-warning"><i class="bi bi-exclamation-triangle"></i></div>
            <div>
                <div class="fw-semibold" id="toggleCategoriaTitle">¿Cambiar estado?</div>
                <div class="text-muted small" id="toggleCategoriaHint"></div>
            </div>
            </div>
        </div>

        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-warning" id="btnConfirmToggleCategoria">
            <i class="bi bi-check-circle me-1"></i> Confirmar
            </button>
        </div>
        </div>
    </div>
    </div>

    {{-- Modal: Confirmar eliminar --}}
    <div class="modal fade" id="modalConfirmDeleteCategoria" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title">Eliminar categoría</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
        </div>

        <div class="modal-body">
            <div class="d-flex gap-3 align-items-start">
            <div class="fs-3 text-danger"><i class="bi bi-exclamation-triangle"></i></div>
            <div>
                <div class="fw-semibold" id="deleteCategoriaTitle">¿Eliminar esta categoría?</div>
            </div>
            </div>
        </div>

        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-danger" id="btnConfirmDeleteCategoria">
            <i class="bi bi-trash me-1"></i> Eliminar
            </button>
        </div>
        </div>
    </div>
    </div>

</div>