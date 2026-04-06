<div class="container my-4" id="productos-page">
  <div class="d-flex align-items-center justify-content-between mb-3">
    <h3 class="mb-0">Productos</h3>

    <button type="button" class="btn btn-danger" id="btnNuevoProducto">
      <i class="bi bi-plus-circle me-1"></i> Nuevo Producto
    </button>
  </div>

  <div class="card shadow-sm">
    <div class="card-body">

      <div class="row g-2 align-items-center mb-3">
      <div class="col-12 col-md-5">
        <div class="input-group">
          <span class="input-group-text"><i class="bi bi-search"></i></span>
          <input type="text" class="form-control" id="productosSearch" placeholder="Buscar por código, nombre, descripción o URL amigable...">
        </div>
      </div>


  <div class="col-12 col-md-2">
    <div class="input-group">
      <span class="input-group-text">Mostrar</span>
      <select class="form-select" id="productosPageSize">
        <option value="5">5</option>
        <option value="10" selected>10</option>
        <option value="20">20</option>
        <option value="all">Todos</option>
      </select>
    </div>
  </div>

  <div class="col-12 col-md-3">
    <div class="input-group">
      <span class="input-group-text">Vista</span>
      <select class="form-select" id="productosViewMode">
        <option value="table" selected>Tabla</option>
        <option value="cards">Cards</option>
      </select>
    </div>
  </div>
</div>

    <div id="productosTableWrap" class="table-responsive">
      <table class="table align-middle table-hover mb-0" id="productosTable">
        <thead class="table-light">
          <tr>
            <th style="width:70px;">N°</th>
            <th style="width:90px;">Imagen</th>
            <th>Código</th>
            <th>Producto</th>
            <th>Categoría</th>
            <th>Marca</th>
            <th>Proveedor</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Estado</th>
            <th class="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody id="productosTbody"></tbody>
      </table>
    </div>

    <div id="productosCardsWrap" class="d-none">
      <div class="productos-cards-grid" id="productosCardsGrid"></div>
    </div>


      <div class="d-flex align-items-center justify-content-between mt-3">
        <div class="text-muted small" id="productosInfo"></div>
        <nav>
          <ul class="pagination pagination-sm mb-0" id="productosPagination"></ul>
        </nav>
      </div>

    </div>
  </div>

  <div class="toast-container position-fixed top-0 end-0 p-3" id="toastContainer" style="z-index: 1080;"></div>

  {{-- Modal Crear/Editar --}}
  <div class="modal fade" id="modalProducto" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-xl modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="modalProductoTitle">Nuevo Producto</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
        </div>

        <form id="formProducto" novalidate>
          <div class="modal-body">

            <div class="row g-4">
              {{-- Columna 1 --}}
              <div class="col-12 col-lg-4">
                <div class="mb-3">
                  <label class="form-label">Nombre</label>
                  <input type="text" class="form-control" id="prodNombre" maxlength="150">
                  <div class="invalid-feedback">El nombre es obligatorio.</div>
                </div>

                <div class="mb-3">
                  <label class="form-label">Código</label>
                  <input type="text" class="form-control" id="prodCodigo" maxlength="100">
                  <div class="invalid-feedback">El código es obligatorio.</div>
                </div>

                <div class="mb-3">
                  <label class="form-label">Stock</label>
                  <input type="number" class="form-control" id="prodStock" min="0" step="1">
                  <div class="invalid-feedback">El stock es obligatorio y no puede ser negativo.</div>
                </div>

                <div class="mb-3">
                  <label class="form-label">Precio compra</label>
                  <input type="number" class="form-control" id="prodPrecioCompra" min="0" step="0.01">
                  <div class="invalid-feedback">El precio de compra es obligatorio.</div>
                </div>

                <div class="mb-3">
                  <label class="form-label">Precio venta</label>
                  <input type="number" class="form-control" id="prodPrecioVenta" min="0" step="0.01">
                  <div class="invalid-feedback">El precio de venta es obligatorio.</div>
                </div>

                <div class="mb-3">
                  <label class="form-label">Estado</label>
                  <select class="form-select" id="prodEstado">
                    <option value="1" selected>Activo</option>
                    <option value="0">Inactivo</option>
                  </select>
                  <div class="invalid-feedback">Selecciona un estado.</div>
                </div>
              </div>

              {{-- Columna 2 --}}
              <div class="col-12 col-lg-4">
                <div class="mb-3">
                  <div class="form-label-action">
                    <label class="form-label">Categoría</label>
                    <button type="button" class="btn btn-sm btn-primary" id="btnNuevaCategoriaDesdeProducto">
                      <i class="bi bi-plus-circle me-1"></i> Agregar nuevo
                    </button>
                  </div>

                  <select class="form-select" id="prodCategoria" style="width:100%;"></select>
                  <div class="invalid-feedback" id="prodCategoriaError">Selecciona una categoría.</div>
                </div>

                <div class="mb-3">
                  <label class="form-label">Marca</label>
                  <select class="form-select" id="prodMarca" style="width:100%;"></select>
                  <div class="invalid-feedback" id="prodMarcaError">Selecciona una marca.</div>
                </div>

                <div class="mb-3">
                  <label class="form-label">Proveedor</label>
                  <select class="form-select" id="prodProveedor" style="width:100%;"></select>
                  <div class="invalid-feedback" id="prodProveedorError">Selecciona un proveedor.</div>
                </div>

                <div class="mb-3">
                  <label class="form-label">Descripción</label>

                  <div id="prodDescripcionToolbar" class="border border-bottom-0 rounded-top bg-light p-2">
                    <span class="ql-formats">
                      <select class="ql-header">
                        <option selected></option>
                        <option value="1"></option>
                        <option value="2"></option>
                      </select>
                    </span>

                    <span class="ql-formats">
                      <button type="button" class="ql-bold"></button>
                      <button type="button" class="ql-italic"></button>
                      <button type="button" class="ql-underline"></button>
                    </span>

                    <span class="ql-formats">
                      <button type="button" class="ql-list" value="ordered"></button>
                      <button type="button" class="ql-list" value="bullet"></button>
                    </span>

                    <span class="ql-formats">
                      <button type="button" class="ql-link"></button>
                      <button type="button" class="ql-clean"></button>
                    </span>
                  </div>

                  <div id="prodDescripcionEditor" style="height: 260px;" class="border rounded-bottom bg-white"></div>
                  <input type="hidden" id="prodDescripcion">

                  {{-- <div class="invalid-feedback d-block" id="prodDescripcionError" style="display:none;">
                    La descripción es obligatoria.
                  </div> --}}
                </div>
              </div>

              {{-- Columna 3 --}}
              <div class="col-12 col-lg-4">
                <label class="form-label fw-semibold">Imágenes (1 a 3 máximo)</label>

                <div class="border rounded p-2 bg-light" id="imagenesZone">
                  <div class="d-flex flex-wrap gap-2" id="imagenesPreviewList"></div>
                </div>

                <input type="file" id="prodImagenInput" accept="image/*" multiple style="display:none;">

                <div class="form-text mb-3">La primera imagen es obligatoria.</div>

                <div class="invalid-feedback" id="prodImagenesError">
                  Debes cargar al menos una imagen.
                </div>

                <hr>

                <div class="d-flex align-items-center gap-2 mb-2">
                  <label class="form-label fw-semibold mb-0">Detalles (1 a 15 máximo)</label>
                  <button type="button" class="btn btn-sm btn-outline-success rounded-circle p-0"
                          id="btnAgregarFicha"
                          style="width:28px;height:28px;">
                    <i class="bi bi-plus-lg"></i>
                  </button>
                  
                </div>

                <div class="row g-2 mb-2">
                  <div class="col-12 col-md-5">
                    <input type="text" class="form-control" id="fichaCaracteristica" placeholder="Característica">
                  </div>
                  <div class="col-12 col-md-5">
                    <input type="text" class="form-control" id="fichaEspecificacion" placeholder="Especificación">
                  </div>

                  <div class="col-12 col-md-2 d-grid">
                    <button type="button" class="btn btn-success" id="btnAddFichaRow">
                      <i class="bi bi-plus-lg"></i>
                    </button>
                  </div>
                </div>

                <div class="mt-3">
                  <label class="form-label fw-semibold">Carga masiva de detalles</label>
                  <textarea
                    class="form-control"
                    id="fichaBulkInput"
                    rows="6"
                    placeholder="Ejemplo:
                      Voltaje: 12V"
                  ></textarea>

                  <div class="d-flex gap-2 mt-2">
                    <button type="button" class="btn btn-outline-primary" id="btnProcesarFichasTexto">
                      <i class="bi bi-magic me-1"></i> Cargar texto
                    </button>

                    <button type="button" class="btn btn-outline-secondary" id="btnLimpiarFichasTexto">
                      <i class="bi bi-eraser me-1"></i> Limpiar texto
                    </button>
                  </div>

                  
                </div>

                <div class="invalid-feedback" id="prodFichaError">
                  La ficha técnica debe tener como máximo 15 registros.
                </div>

                <div class="border rounded p-2 bg-light" id="fichaList" style="min-height:70px;"></div>
              </div>
            </div>

            <hr class="my-4">

            <div class="d-flex align-items-center justify-content-between mb-3">
              <h6 class="mb-0">Datos del ecommerce</h6>
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" id="toggleEcommerceData">
                <label class="form-check-label" for="toggleEcommerceData">Habilitar</label>
              </div>
            </div>

            <div id="ecommerceBlock" style="display:none;">
              <div class="row g-3">
                <div class="col-12 col-md-4">
                  <label class="form-label">URL amigable</label>
                  <input type="text" class="form-control" id="prodUrlAmigable" maxlength="200" placeholder="ejemplo-mi-producto">
                </div>

                <div class="col-12 col-md-4">
                  <label class="form-label">Meta título</label>
                  <input type="text" class="form-control" id="prodMetaTitulo" maxlength="255">
                </div>

                <div class="col-12 col-md-4">
                  <label class="form-label">Meta descripción</label>
                  <input type="text" class="form-control" id="prodMetaDescripcion" maxlength="500">
                </div>
              </div>
            </div>

          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="submit" class="btn btn-danger" id="btnGuardarProducto">
              <i class="bi bi-check2-circle me-1"></i> Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  {{-- Modal Ver detalle --}}
  <div class="modal fade" id="modalProductoView" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-xl modal-dialog-scrollable modal-product-view">
      <div class="modal-content border-0 shadow-lg">
        <div class="modal-header border-0 pb-0">
          <h5 class="modal-title fw-semibold">Detalle del producto</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
        </div>
        <div class="modal-body pt-2" id="productoViewBody"></div>
      </div>
    </div>
  </div>

  {{-- Modal toggle --}}
  <div class="modal fade" id="modalConfirmToggleProducto" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Cambiar estado</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
        </div>

        <div class="modal-body">
          <div class="d-flex gap-3 align-items-start">
            <div class="fs-3 text-warning"><i class="bi bi-exclamation-triangle"></i></div>
            <div>
              <div class="fw-semibold" id="toggleProductoTitle">¿Cambiar estado?</div>
              <div class="text-muted small" id="toggleProductoHint"></div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
          <button type="button" class="btn btn-warning" id="btnConfirmToggleProducto">
            <i class="bi bi-check-circle me-1"></i> Confirmar
          </button>
        </div>
      </div>
    </div>
  </div>

  {{-- Modal delete --}}
  <div class="modal fade" id="modalConfirmDeleteProducto" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Eliminar producto</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
        </div>

        <div class="modal-body">
          <div class="d-flex gap-3 align-items-start">
            <div class="fs-3 text-danger"><i class="bi bi-exclamation-triangle"></i></div>
            <div>
              <div class="fw-semibold" id="deleteProductoTitle">¿Eliminar este producto?</div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
          <button type="button" class="btn btn-danger" id="btnConfirmDeleteProducto">
            <i class="bi bi-trash me-1"></i> Eliminar
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

{{-- Modal: Nueva Categoría desde Producto --}}
<div class="modal fade" id="modalCategoriaFromProducto" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-lg modal-dialog-scrollable">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="modalCategoriaFromProductoTitle">Nueva Categoría</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
      </div>

      <form id="formCategoriaFromProducto" novalidate>
        <div class="modal-body">
          <div class="row g-3">

            <div class="col-12 col-lg-4">
              <label class="form-label">Imagen</label>

              <div id="catProdImgDropArea"
                   class="border rounded d-flex align-items-center justify-content-center bg-light"
                   style="width:100%; aspect-ratio:1/1; cursor:pointer; position:relative; overflow:hidden;">
                <img id="catProdImgPreview"
                     alt="Vista previa"
                     style="max-width:100%; max-height:100%; display:none; object-fit:cover;">
                <div id="catProdImgPlaceholder" class="text-muted text-center p-3">
                  <i class="bi bi-image fs-1"></i>
                  <div class="small">Click para seleccionar imagen</div>
                </div>
              </div>

              <input type="file" id="catProdImg" accept="image/*" style="display:none;">

              <div class="d-flex justify-content-end mt-2">
                <button type="button" class="btn btn-sm btn-danger" id="btnRemoveCatProdImg">
                  <i class="bi bi-trash me-1"></i> Quitar imagen
                </button>
              </div>
            </div>

            <div class="col-12 col-lg-8">
              <div class="row g-3">

                <div class="col-12">
                  <label class="form-label">Nombre</label>
                  <input type="text" class="form-control" id="catProdNombre" maxlength="100">
                  <div class="invalid-feedback">El nombre es obligatorio (máx. 100).</div>
                </div>

                <div class="col-12">
                  <label class="form-label">Descripción</label>
                  <textarea class="form-control" id="catProdDescripcion" rows="5" maxlength="500"></textarea>
                  <div class="form-text">Máx. 500 caracteres.</div>
                </div>

              </div>
            </div>

          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
          <button type="submit" class="btn btn-danger" id="btnGuardarCategoriaFromProducto">
            <i class="bi bi-check2-circle me-1"></i> Guardar
          </button>
        </div>
      </form>

    </div>
  </div>
</div>


<style>
  #modalProducto .modal-body {
    max-height: calc(100vh - 180px);
    overflow-y: auto;
  }

  .producto-table-thumb {
    width: 56px;
    height: 56px;
    object-fit: cover;
    border-radius: 8px;
    border: 1px solid #dee2e6;
    background: #fff;
  }

  .producto-table-thumb-empty {
    width: 56px;
    height: 56px;
    border-radius: 8px;
    border: 1px dashed #ced4da;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    color: #6c757d;
    background: #f8f9fa;
    text-align: center;
    line-height: 1.1;
  }
  #prodDescripcionEditor .ql-editor {
    min-height: 220px;
    font-size: 14px;
  }

  #prodDescripcionEditor.is-invalid,
  #prodDescripcionToolbar.is-invalid {
    border-color: #dc3545 !important;
  }
  .form-label-action {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: .5rem;
  margin-bottom: .35rem;
}

.form-label-action .form-label {
  margin-bottom: 0;
}

.form-label-action .btn {
  white-space: nowrap;
}

.modal-backdrop.show {
  opacity: 0.75;
}


</style>