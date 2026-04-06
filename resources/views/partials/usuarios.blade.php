<div class="container my-4" id="usuarios-page">
  <div class="d-flex align-items-center justify-content-between mb-3">
    <h3 class="mb-0">Usuarios</h3>

    <button type="button" class="btn btn-danger" id="btnNuevoUsuario">
      <i class="bi bi-plus-circle me-1"></i> Nuevo Usuario
    </button>
  </div>

  <div class="card shadow-sm">
    <div class="card-body">

      <div class="row g-2 align-items-center mb-3">
        <div class="col-12 col-md-6">
          <div class="input-group">
            <span class="input-group-text"><i class="bi bi-search"></i></span>
            <input type="text" class="form-control" id="usuariosSearch" placeholder="Buscar por nombre, email, usuario, teléfono, rol...">
          </div>
        </div>

        <div class="col-12 col-md-3 ms-md-auto">
          <div class="input-group">
            <span class="input-group-text">Mostrar</span>
            <select class="form-select" id="usuariosPageSize">
              <option value="5">5</option>
              <option value="10" selected>10</option>
              <option value="20">20</option>
              <option value="all">Todos</option>
            </select>
          </div>
        </div>
      </div>

      <div class="table-responsive">
        <table class="table align-middle table-hover mb-0" id="usuariosTable">
          <thead class="table-light">
            <tr>
              <th style="width:70px;">N°</th>
              <th>Usuario</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th style="width:160px;">Rol</th>
              <th style="width:140px;">Estado</th>
              <th style="width:220px;" class="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody id="usuariosTbody">
            {{-- renderizado por JS --}}
          </tbody>
        </table>
      </div>

      <div class="d-flex align-items-center justify-content-between mt-3">
        <div class="text-muted small" id="usuariosInfo"></div>
        <nav>
          <ul class="pagination pagination-sm mb-0" id="usuariosPagination"></ul>
        </nav>
      </div>

    </div>
  </div>

  {{-- Toast container (toastr bootstrap) --}}
  <div class="toast-container position-fixed top-0 end-0 p-3" id="toastContainer" style="z-index: 1080;"></div>

  {{-- Modal: Nuevo Usuario --}}
  <div class="modal fade" id="modalUsuario" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="modalUsuarioTitle">Nuevo Usuario</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
        </div>

        <form id="formUsuario" novalidate>
          <div class="modal-body">

            <div class="row g-3">
                <div class="col-12 col-lg-4">
                <label class="form-label">Imagen</label>

                <!-- Cuadro clickeable -->
                <div id="imgDropArea"
                    class="border rounded d-flex align-items-center justify-content-center bg-light"
                    style="width:100%; aspect-ratio:1/1; cursor:pointer; position:relative; overflow:hidden;">
                    
                    <img id="usuarioImgPreview"
                        alt="Vista previa"
                        style="max-width:100%; max-height:100%; display:none; object-fit:cover;">

                    <div id="usuarioImgPlaceholder" class="text-muted text-center p-3">
                    <i class="bi bi-image fs-1"></i>
                    <div class="small">Click para seleccionar imagen</div>
                    </div>
                </div>

                <!-- input oculto -->
                <input type="file"
                        id="usuarioImg"
                        accept="image/*"
                        style="display:none;">

                <div class="d-flex justify-content-end mt-2">
                    <button type="button"
                            class="btn btn-sm btn-danger"
                            id="btnRemoveImg">
                    <i class="bi bi-trash me-1"></i> Quitar imagen
                    </button>
                </div>
                </div>
              <div class="col-12 col-lg-8">
                <div class="row g-3">
                  <div class="col-12 col-md-6">
                    <label class="form-label">Nombre</label>
                    <input type="text" class="form-control" id="nombre">
                    <div class="invalid-feedback">El nombre es obligatorio.</div>
                  </div>

                  <div class="col-12 col-md-6">
                    <label class="form-label">Apellido</label>
                    <input type="text" class="form-control" id="apellido">
                    <div class="invalid-feedback">El apellido es obligatorio.</div>
                  </div>

                  <div class="col-12 col-md-6">
                    <label class="form-label">Email</label>
                    <input type="text" class="form-control" id="email" placeholder="usuario@correo.com">
                    <div class="invalid-feedback">Email inválido u obligatorio.</div>
                  </div>

                  <div class="col-12 col-md-6">
                    <label class="form-label">Usuario</label>
                    <input type="text" class="form-control" id="username" placeholder="nombre.usuario">
                    <div class="invalid-feedback">El usuario es obligatorio (mín. 3 caracteres).</div>
                  </div>

                  <div class="col-12 col-md-6">
                    <label class="form-label">Teléfono</label>
                    <input type="text" class="form-control" id="telefono" placeholder="Ej: 70000000">
                    <div class="invalid-feedback">Teléfono obligatorio (mín. 7 dígitos).</div>
                  </div>

                  <div class="col-12 col-md-6">
                    <label class="form-label">Rol</label>
                    <select class="form-select" id="rol">
                      <option value="">Selecciona...</option>
                      <option value="2">Administrador</option>
                      <option value="3">Vendedor</option>
                    </select>
                    <div class="invalid-feedback">Selecciona un rol.</div>
                  </div>

                  <div class="col-12 col-md-6">
                    <label class="form-label">Contraseña</label>
                    <input type="password" class="form-control" id="password">
                    <div class="invalid-feedback">La contraseña es obligatoria (mín. 6 caracteres).</div>
                  </div>

                  <div class="col-12 col-md-6">
                    <label class="form-label">Confirmar Contraseña</label>
                    <input type="password" class="form-control" id="password2">
                    <div class="invalid-feedback">Las contraseñas no coinciden.</div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="submit" class="btn btn-danger" id="btnGuardarUsuario">
              <i class="bi bi-check2-circle me-1"></i> Guardar
            </button>
          </div>
        </form>

      </div>
    </div>
  </div>
</div>
