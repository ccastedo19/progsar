(() => {
  const API_BASE = "/api";
  const TOKEN_KEY = "auth_token";
  const MAX_IMGS = 3;
  const MAX_FICHAS = 15;

  const $jq = window.jQuery;

  const root = () => document.getElementById("productos-page");
  const tbody = () => document.getElementById("productosTbody");
  const info = () => document.getElementById("productosInfo");
  const pagination = () => document.getElementById("productosPagination");
  const searchInput = () => document.getElementById("productosSearch");
  const pageSizeSel = () => document.getElementById("productosPageSize");
  
  const viewModeSel = () => document.getElementById("productosViewMode");
  const tableWrap = () => document.getElementById("productosTableWrap");
  const cardsWrap = () => document.getElementById("productosCardsWrap");
  const cardsGrid = () => document.getElementById("productosCardsGrid");
  const btnNuevo = () => document.getElementById("btnNuevoProducto");



  const fichaBulkInput = () => document.getElementById("fichaBulkInput");
  const btnProcesarFichasTexto = () => document.getElementById("btnProcesarFichasTexto");
  const btnLimpiarFichasTexto = () => document.getElementById("btnLimpiarFichasTexto");

  let modalForm, modalView, modalToggle, modalDelete, modalCategoriaFromProducto;

  let quillDescripcion = null;

  const form = () => document.getElementById("formProducto");

  const fNombre = () => document.getElementById("prodNombre");
  const fCodigo = () => document.getElementById("prodCodigo");
  const fStock = () => document.getElementById("prodStock");
  const fPrecioCompra = () => document.getElementById("prodPrecioCompra");
  const fPrecioVenta = () => document.getElementById("prodPrecioVenta");
  const fEstado = () => document.getElementById("prodEstado");
  const fDescripcion = () => document.getElementById("prodDescripcion");
  
  const fDescripcionError = () => document.getElementById("prodDescripcionError");
  const descripcionEditor = () => document.getElementById("prodDescripcionEditor");
  const descripcionToolbar = () => document.getElementById("prodDescripcionToolbar");

  const fCategoria = () => document.getElementById("prodCategoria");
  const fMarca = () => document.getElementById("prodMarca");
  const fProveedor = () => document.getElementById("prodProveedor");

  const btnNuevaCategoriaDesdeProducto = () => document.getElementById("btnNuevaCategoriaDesdeProducto");

  const formCategoriaFromProducto = () => document.getElementById("formCategoriaFromProducto");
  const fCatProdNombre = () => document.getElementById("catProdNombre");
  const fCatProdDescripcion = () => document.getElementById("catProdDescripcion");

  const catProdImgDropArea = () => document.getElementById("catProdImgDropArea");
  const catProdImgInput = () => document.getElementById("catProdImg");
  const catProdImgPreview = () => document.getElementById("catProdImgPreview");
  const catProdImgPlaceholder = () => document.getElementById("catProdImgPlaceholder");
  const btnRemoveCatProdImg = () => document.getElementById("btnRemoveCatProdImg");


  const fCategoriaError = () => document.getElementById("prodCategoriaError");
  const fMarcaError = () => document.getElementById("prodMarcaError");
  const fProveedorError = () => document.getElementById("prodProveedorError");

  const ecommerceToggle = () => document.getElementById("toggleEcommerceData");
  const ecommerceBlock = () => document.getElementById("ecommerceBlock");
  const fUrl = () => document.getElementById("prodUrlAmigable");
  const fMetaTitulo = () => document.getElementById("prodMetaTitulo");
  const fMetaDescripcion = () => document.getElementById("prodMetaDescripcion");

  const imgInput = () => document.getElementById("prodImagenInput");
  const imgList = () => document.getElementById("imagenesPreviewList");
  const imgError = () => document.getElementById("prodImagenesError");

  const fichaCaracteristica = () => document.getElementById("fichaCaracteristica");
  const fichaEspecificacion = () => document.getElementById("fichaEspecificacion");
  const btnAddFichaRow = () => document.getElementById("btnAddFichaRow");
  const btnAgregarFicha = () => document.getElementById("btnAgregarFicha");
  const fichaList = () => document.getElementById("fichaList");
  const fichaError = () => document.getElementById("prodFichaError");

  const viewBody = () => document.getElementById("productoViewBody");

  const toggleTitle = () => document.getElementById("toggleProductoTitle");
  const toggleHint = () => document.getElementById("toggleProductoHint");
  const btnConfirmToggle = () => document.getElementById("btnConfirmToggleProducto");

  const deleteTitle = () => document.getElementById("deleteProductoTitle");
  const btnConfirmDelete = () => document.getElementById("btnConfirmDeleteProducto");

  let state = { q: "", page: 1, pageSize: 10, viewMode: "table" };
  let productos = [];
  let categorias = [];
  let marcas = [];
  let proveedores = [];
  let editingId = null;

  let pendingToggleId = null;
  let pendingToggleEstado = null;
  let pendingDeleteId = null;

  let currentImages = [];
  let currentFichas = [];
  let categoriaTempImageFile = null;

  let urlManuallyEdited = false;

  function getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  function logoutHard() {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    window.location.replace("/login");
  }

  function escapeHtml(str) {
    return String(str ?? "").replace(/[&<>"']/g, (m) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    }[m]));
  }

  function money(v) {
    const n = Number(v || 0);
    return n.toFixed(2);
  }

  function initDescripcionEditor() {
  if (quillDescripcion || !window.Quill || !descripcionEditor()) return;

  quillDescripcion = new Quill("#prodDescripcionEditor", {
    theme: "snow",
    modules: {
      toolbar: "#prodDescripcionToolbar"
    },
    placeholder: "Escribe la descripción del producto..."
  });

  quillDescripcion.on("text-change", () => {
    syncDescripcionHtml();
    hideDescripcionError();
  });
}

function syncDescripcionHtml() {
  if (!quillDescripcion) return;
  const html = quillDescripcion.root.innerHTML.trim();
  const plain = quillDescripcion.getText().trim();

  fDescripcion().value = plain ? html : "";
}

function setDescripcionHtml(html) {
  if (!quillDescripcion) return;

  if (html && html.trim()) {
    quillDescripcion.root.innerHTML = html;
  } else {
    quillDescripcion.setText("");
  }

  syncDescripcionHtml();
}

function clearCategoriaFromProductoImage() {
  categoriaTempImageFile = null;

  if (catProdImgInput()) catProdImgInput().value = "";
  if (catProdImgPreview()) {
    catProdImgPreview().src = "";
    catProdImgPreview().style.display = "none";
  }
  if (catProdImgPlaceholder()) {
    catProdImgPlaceholder().style.display = "block";
  }
}

function resetCategoriaFromProductoForm() {
  categoriaTempImageFile = null;

  if (formCategoriaFromProducto()) {
    formCategoriaFromProducto().reset();
    formCategoriaFromProducto().querySelectorAll(".is-invalid, .is-valid").forEach(el => {
      el.classList.remove("is-invalid", "is-valid");
    });
  }

  clearCategoriaFromProductoImage();
}

function openCategoriaFromProductoModal() {
  resetCategoriaFromProductoForm();
  modalCategoriaFromProducto.show();
}

function validateCategoriaFromProductoForm() {
  let ok = true;

  const inval = (el) => {
    el.classList.add("is-invalid");
    el.classList.remove("is-valid");
    ok = false;
  };

  const val = (el) => {
    el.classList.remove("is-invalid");
    el.classList.add("is-valid");
  };

  const nombre = fCatProdNombre().value.trim();
  const descripcion = fCatProdDescripcion().value.trim();

  if (!nombre || nombre.length > 100) inval(fCatProdNombre());
  else val(fCatProdNombre());

  if (descripcion.length > 500) {
    fCatProdDescripcion().classList.add("is-invalid");
    ok = false;
  } else {
    fCatProdDescripcion().classList.remove("is-invalid");
  }

  return ok;
}

async function createCategoriaFromProducto() {
  const fd = new FormData();
  fd.append("nombre", fCatProdNombre().value.trim());
  fd.append("descripcion", fCatProdDescripcion().value.trim());

  if (categoriaTempImageFile) {
    fd.append("imagen", categoriaTempImageFile);
  }

  const created = await apiFetch("/categorias", {
    method: "POST",
    body: fd,
    isFormData: true
  });

  await loadLookups();

  const newId = String(created?.id_categoria ?? "");

  renderSelectOptions();

  if ($jq && $jq.fn && $jq.fn.select2) {
    $jq(fCategoria()).val(newId).trigger("change");
  } else {
    fCategoria().value = newId;
  }

  hideFieldError(fCategoriaError());
  markSelect2Invalid(fCategoria(), false);

  showToast("Categoría creada correctamente.", "success", 2400);

  modalCategoriaFromProducto.hide();
}


function getDescripcionTextLength() {
  if (!quillDescripcion) return 0;
  return quillDescripcion.getText().trim().length;
}

function showDescripcionError() {
  descripcionEditor()?.classList.add("is-invalid");
  descripcionToolbar()?.classList.add("is-invalid");
  if (fDescripcionError()) fDescripcionError().style.display = "block";
}

function hideDescripcionError() {
  descripcionEditor()?.classList.remove("is-invalid");
  descripcionToolbar()?.classList.remove("is-invalid");
  if (fDescripcionError()) fDescripcionError().style.display = "none";
}

  function slugify(text) {
    return String(text ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function estadoBadge(e) {
    const n = Number(e);
    if (n === 1) return `<span class="badge text-bg-success">Activo</span>`;
    if (n === 0) return `<span class="badge text-bg-warning">Inactivo</span>`;
    return `<span class="badge text-bg-secondary">Eliminado</span>`;
  }

  function showToast(message, variant = "success", delayMs = 2500) {
    const container = document.getElementById("toastContainer");
    const id = "t_" + Math.random().toString(16).slice(2);

    const icon = variant === "success" ? "bi-check-circle" :
                 variant === "warning" ? "bi-exclamation-triangle" :
                 variant === "danger" ? "bi-x-circle" : "bi-info-circle";

    const html = `
      <div id="${id}" class="toast align-items-center text-bg-${variant} border-0" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
          <div class="toast-body">
            <i class="bi ${icon} me-2"></i>${escapeHtml(message)}
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Cerrar"></button>
        </div>
      </div>
    `;

    container.insertAdjacentHTML("beforeend", html);

    const el = document.getElementById(id);
    const t = new bootstrap.Toast(el, { delay: delayMs, autohide: true });
    el.addEventListener("hidden.bs.toast", () => el.remove());
    t.show();
  }

  async function apiFetch(path, { method = "GET", body = null, isFormData = false } = {}) {
    const token = getToken();
    if (!token) logoutHard();

    const headers = {
      "Accept": "application/json",
      "Authorization": "Bearer " + token,
    };

    if (body !== null && !isFormData) {
      headers["Content-Type"] = "application/json";
    }

    const res = await fetch(API_BASE + path, {
      method,
      headers,
      body: body === null ? null : (isFormData ? body : JSON.stringify(body)),
    });

    if (res.status === 401 || res.status === 419) {
      logoutHard();
      return null;
    }

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const msg =
        (data?.errors && Object.values(data.errors)[0] && Object.values(data.errors)[0][0]) ||
        data?.message ||
        "Error en la solicitud";
      throw new Error(msg);
    }

    return data;
  }

  async function loadLookups() {
    const [cats, mars, provs] = await Promise.all([
      apiFetch("/categorias?estado=1"),
      apiFetch("/marcas?estado=1"),
      apiFetch("/proveedores?estado=1"),
    ]);

    categorias = Array.isArray(cats) ? cats : [];
    marcas = Array.isArray(mars) ? mars : [];
    proveedores = Array.isArray(provs) ? provs : [];

    renderSelectOptions();
  }

  function renderSelectOptions() {
    fCategoria().innerHTML = `<option value="">Selecciona...</option>` +
      categorias.map(x => `<option value="${x.id_categoria}">${escapeHtml(x.nombre)}</option>`).join("");

    fMarca().innerHTML = `<option value="">Selecciona...</option>` +
      marcas.map(x => `<option value="${x.id_marca}">${escapeHtml(x.nombre)}</option>`).join("");

    fProveedor().innerHTML = `<option value="">Selecciona...</option>` +
      proveedores.map(x => `<option value="${x.id_proveedor}">${escapeHtml(x.empresa)}</option>`).join("");
  }

  function destroySelect2() {
    if (!$jq || !$jq.fn || !$jq.fn.select2) return;

    const cat = fCategoria();
    const mar = fMarca();
    const pro = fProveedor();

    if (cat && $jq(cat).hasClass("select2-hidden-accessible")) {
      $jq(cat).off(".select2fix");
      $jq(cat).select2("destroy");
    }

    if (mar && $jq(mar).hasClass("select2-hidden-accessible")) {
      $jq(mar).off(".select2fix");
      $jq(mar).select2("destroy");
    }

    if (pro && $jq(pro).hasClass("select2-hidden-accessible")) {
      $jq(pro).off(".select2fix");
      $jq(pro).select2("destroy");
    }
  }

  function initSelect2() {
    if (!$jq || !$jq.fn || !$jq.fn.select2) {
      console.error("jQuery o Select2 no están cargados.");
      return;
    }

    if (!fCategoria() || !fMarca() || !fProveedor()) return;

    destroySelect2();

    const config = {
      width: "100%",
      dropdownParent: $jq("#modalProducto"),
      placeholder: "Selecciona...",
      allowClear: true
    };

    $jq(fCategoria())
      .select2(config)
      .off("change.select2fix")
      .on("change.select2fix", () => {
        hideFieldError(fCategoriaError());
        markSelect2Invalid(fCategoria(), false);
      });

    $jq(fMarca())
      .select2(config)
      .off("change.select2fix")
      .on("change.select2fix", () => {
        hideFieldError(fMarcaError());
        markSelect2Invalid(fMarca(), false);
      });

    $jq(fProveedor())
      .select2(config)
      .off("change.select2fix")
      .on("change.select2fix", () => {
        hideFieldError(fProveedorError());
        markSelect2Invalid(fProveedor(), false);
      });
  }

  function showFieldError(el) {
    if (el) el.classList.add("show-error");
  }

  function hideFieldError(el) {
    if (el) el.classList.remove("show-error");
  }

  function markSelect2Invalid(selectEl, isInvalid) {
    if (!$jq || !$jq.fn || !$jq.fn.select2) return;

    const $select = $jq(selectEl);
    const $container = $select.next(".select2-container");

    if (isInvalid) {
      $container.addClass("select2-invalid");
    } else {
      $container.removeClass("select2-invalid");
    }
  }

  function productCardImage(p) {
    const img = p.imagen_1 || p.imagen_2 || p.imagen_3 || null;

    if (!img) {
      return `<div class="producto-card-image-empty">Sin imagen</div>`;
    }

    return `
      <div class="producto-card-image">
        <img src="/storage/${escapeHtml(img)}" alt="${escapeHtml(p.nombre ?? "Producto")}">
      </div>
    `;
  }

  function productTableImage(p) {
    const img = p.imagen_1 || p.imagen_2 || p.imagen_3 || null;

    if (!img) {
      return `<div class="producto-table-thumb-empty">Sin imagen</div>`;
    }

    return `<img src="/storage/${escapeHtml(img)}" alt="${escapeHtml(p.nombre ?? "Producto")}" class="producto-table-thumb">`;
  }

  function renderCards(slice) {
    if (!cardsGrid()) return;

    if (!slice.length) {
      cardsGrid().innerHTML = `
        <div class="col-12">
          <div class="text-muted py-4 text-center">No hay productos para mostrar.</div>
        </div>
      `;
      return;
    }

    cardsGrid().innerHTML = slice.map((p) => `
      <article class="producto-card" data-card-view="${p.id_producto}">
        ${productCardImage(p)}
        <div class="producto-card-body">
          <div class="producto-card-top">
            <div class="producto-card-codigo">${escapeHtml(p.codigo ?? "")}</div>
            <div class="producto-card-precio">BOB ${money(p.precio_venta)}</div>
          </div>
          <div class="producto-card-nombre">${escapeHtml(p.nombre ?? "")}</div>
        </div>
      </article>
    `).join("");

    cardsGrid().querySelectorAll("[data-card-view]").forEach(card => {
      card.addEventListener("click", () => {
        const id = Number(card.getAttribute("data-card-view"));
        const p = productos.find(x => Number(x.id_producto) === id);
        if (!p) return;
        openViewModal(p);
      });
    });
  }

  async function loadProductos() {
    const data = await apiFetch(`/productos`, { method: "GET" });
    productos = Array.isArray(data) ? data : [];
    render();
  }

  function filtered() {
    const q = state.q.trim().toLowerCase();
    let list = [...productos];

    if (q) {
      list = list.filter(p => {
        const hay = [
          p.codigo ?? "",
          p.nombre ?? "",
          p.descripcion ?? "",
          p.url_amigable ?? "",
          p.categoria?.nombre ?? "",
          p.marca?.nombre ?? "",
          p.proveedor?.empresa ?? ""
        ].join(" ").toLowerCase();

        return hay.includes(q);
      });
    }

    return list;
  }

  function paged(list) {
    if (state.pageSize === "all") return { slice: list, totalPages: 1, page: 1 };

    const size = Number(state.pageSize);
    const totalPages = Math.max(1, Math.ceil(list.length / size));
    const page = Math.min(state.page, totalPages);
    const start = (page - 1) * size;

    return { slice: list.slice(start, start + size), totalPages, page };
  }

  function actionButtons(p) {
    const e = Number(p.estado);
    const isActive = e === 1;
    const toggleIcon = isActive ? "bi-slash-circle" : "bi-check-circle";
    const toggleTitleTxt = isActive ? "Inactivar producto" : "Activar producto";
    const disabledAll = e === 2 ? "disabled" : "";

    return `
      <div class="d-flex justify-content-end gap-2">
        <button type="button" class="btn btn-sm btn-info" data-action="view" data-id="${p.id_producto}" title="Ver detalle">
          <i class="bi bi-eye"></i>
        </button>

        <button type="button" class="btn btn-sm btn-primary ${disabledAll}" data-action="edit" data-id="${p.id_producto}" title="Editar producto">
          <i class="bi bi-pencil-square"></i>
        </button>

        <button type="button" class="btn btn-sm btn-warning ${disabledAll}" data-action="toggle" data-id="${p.id_producto}" title="${toggleTitleTxt}">
          <i class="bi ${toggleIcon}"></i>
        </button>

        <button type="button" class="btn btn-sm btn-danger ${disabledAll}" data-action="delete" data-id="${p.id_producto}" title="Eliminar producto">
          <i class="bi bi-trash"></i>
        </button>
      </div>
    `;
  }

  function render() {
    const list = filtered();
    const { slice, totalPages, page } = paged(list);
    state.page = page;

    const total = list.length;
    if (state.pageSize === "all") {
      info().textContent = `Mostrando ${total} de ${total} productos`;
    } else {
      const size = Number(state.pageSize);
      const from = total === 0 ? 0 : (page - 1) * size + 1;
      const to = Math.min(total, page * size);
      info().textContent = `Mostrando ${from}-${to} de ${total} productos`;
    }

    if (state.viewMode === "cards") {
      tableWrap()?.classList.add("d-none");
      cardsWrap()?.classList.remove("d-none");
      renderCards(slice);
    } else {
      cardsWrap()?.classList.add("d-none");
      tableWrap()?.classList.remove("d-none");

      tbody().innerHTML = slice.map((p, idx) => {
        const n = state.pageSize === "all"
          ? idx + 1
          : ((page - 1) * Number(state.pageSize) + idx + 1);

        return `
          <tr>
            <td>${n}</td>
            <td>${productTableImage(p)}</td>
            <td>${escapeHtml(p.codigo)}</td>
            <td>
              <div class="fw-semibold">${escapeHtml(p.nombre)}</div>
            </td>
            <td>${escapeHtml(p.categoria?.nombre ?? "")}</td>
            <td>${escapeHtml(p.marca?.nombre ?? "")}</td>
            <td>${escapeHtml(p.proveedor?.empresa ?? "")}</td>
            <td>${money(p.precio_venta)}</td>
            <td>${escapeHtml(p.stock)}</td>
            <td>${estadoBadge(p.estado)}</td>
            <td class="text-end">${actionButtons(p)}</td>
          </tr>
        `;
      }).join("");
    }

    if (state.pageSize === "all" || totalPages <= 1) {
      pagination().innerHTML = "";
      return;
    }

    const items = [];
    items.push(`
      <li class="page-item ${page > 1 ? "" : "disabled"}">
        <a class="page-link" href="#" data-page="${page - 1}">«</a>
      </li>
    `);

    for (let p = 1; p <= totalPages; p++) {
      items.push(`
        <li class="page-item ${p === page ? "active" : ""}">
          <a class="page-link" href="#" data-page="${p}">${p}</a>
        </li>
      `);
    }

    items.push(`
      <li class="page-item ${page < totalPages ? "" : "disabled"}">
        <a class="page-link" href="#" data-page="${page + 1}">»</a>
      </li>
    `);

    pagination().innerHTML = items.join("");

    pagination().querySelectorAll("[data-page]").forEach(a => {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        const p = Number(a.getAttribute("data-page"));
        if (!Number.isFinite(p) || p < 1) return;
        state.page = p;
        render();
      });
    });
  }

  function resetForm() {
    editingId = null;
    currentImages = [];
    currentFichas = [];
    urlManuallyEdited = false;
    hideDescripcionError();

    if (quillDescripcion) {
      quillDescripcion.setText("");
      syncDescripcionHtml();
    }
    if (fichaBulkInput()) fichaBulkInput().value = "";
    form().reset();
    form().querySelectorAll(".is-invalid, .is-valid").forEach(el => {
      el.classList.remove("is-invalid", "is-valid");
    });

    hideFieldError(fCategoriaError());
    hideFieldError(fMarcaError());
    hideFieldError(fProveedorError());
    hideFieldError(imgError());
    hideFieldError(fichaError());

    if (fCategoria()) markSelect2Invalid(fCategoria(), false);
    if (fMarca()) markSelect2Invalid(fMarca(), false);
    if (fProveedor()) markSelect2Invalid(fProveedor(), false);

    ecommerceToggle().checked = false;
    ecommerceBlock().style.display = "none";

    renderImages();
    renderFichas();

    if ($jq && $jq.fn && $jq.fn.select2) {
      $jq(fCategoria()).val("").trigger("change");
      $jq(fMarca()).val("").trigger("change");
      $jq(fProveedor()).val("").trigger("change");
    } else {
      fCategoria().value = "";
      fMarca().value = "";
      fProveedor().value = "";
    }
  }

  function openModalCreate() {
    resetForm();
    document.getElementById("modalProductoTitle").textContent = "Nuevo Producto";
    modalForm.show();
  }

  function openModalEdit(p) {
    resetForm();
    editingId = Number(p.id_producto);

    document.getElementById("modalProductoTitle").textContent = "Editar Producto";

    fNombre().value = p.nombre ?? "";
    fCodigo().value = p.codigo ?? "";
    fStock().value = p.stock ?? 0;
    fPrecioCompra().value = p.precio_compra ?? "";
    fPrecioVenta().value = p.precio_venta ?? "";
    fEstado().value = String(p.estado ?? 1);
    setDescripcionHtml(p.descripcion ?? "");

    if ($jq && $jq.fn && $jq.fn.select2) {
      $jq(fCategoria()).val(String(p.id_categoria ?? "")).trigger("change");
      $jq(fMarca()).val(String(p.id_marca ?? "")).trigger("change");
      $jq(fProveedor()).val(String(p.id_proveedor ?? "")).trigger("change");
    } else {
      fCategoria().value = String(p.id_categoria ?? "");
      fMarca().value = String(p.id_marca ?? "");
      fProveedor().value = String(p.id_proveedor ?? "");
    }

    const hasEcommerceData = !!(p.url_amigable || p.meta_titulo || p.meta_descripcion);
    ecommerceToggle().checked = hasEcommerceData;
    ecommerceBlock().style.display = hasEcommerceData ? "block" : "none";

    fUrl().value = p.url_amigable ?? "";
    urlManuallyEdited = !!(p.url_amigable ?? "").trim();
    fMetaTitulo().value = p.meta_titulo ?? "";
    fMetaDescripcion().value = p.meta_descripcion ?? "";

    currentImages = [];
    if (p.imagen_1) currentImages.push({ url: "/storage/" + p.imagen_1, serverPath: p.imagen_1, slot: 1 });
    if (p.imagen_2) currentImages.push({ url: "/storage/" + p.imagen_2, serverPath: p.imagen_2, slot: 2 });
    if (p.imagen_3) currentImages.push({ url: "/storage/" + p.imagen_3, serverPath: p.imagen_3, slot: 3 });
    renderImages();

    currentFichas = Array.isArray(p.fichas_tecnicas)
      ? p.fichas_tecnicas.map(x => ({
          caracteristica: x.caracteristica,
          especificacion: x.especificacion
        }))
      : [];
    renderFichas();

    modalForm.show();
  }

  function renderImages() {
    const items = currentImages.map((img, idx) => `
      <div class="position-relative border rounded overflow-hidden bg-white" style="width:100px;height:100px;">
        <img src="${escapeHtml(img.url)}" style="width:100%;height:100%;object-fit:cover;" alt="preview">
        <button type="button"
                class="btn btn-sm btn-danger rounded-circle position-absolute top-0 end-0 m-1 p-0 d-flex align-items-center justify-content-center"
                data-remove-img="${idx}"
                style="width:24px;height:24px;">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
    `).join("");

    const addBox = currentImages.length < MAX_IMGS ? `
      <button type="button"
              class="border rounded bg-white text-muted d-flex align-items-center justify-content-center"
              id="btnOpenImagePicker"
              style="width:100px;height:100px;font-size:3rem;">
        <i class="bi bi-plus-lg"></i>
      </button>
    ` : "";

    imgList().innerHTML = items + addBox;

    const picker = document.getElementById("btnOpenImagePicker");
    if (picker) picker.addEventListener("click", () => imgInput().click());

    imgList().querySelectorAll("[data-remove-img]").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.getAttribute("data-remove-img"));
        if (!Number.isFinite(idx)) return;
        currentImages.splice(idx, 1);
        renderImages();
        hideFieldError(imgError());
      });
    });
  }

  function renderFichas() {
    if (!currentFichas.length) {
      fichaList().innerHTML = `<div class="text-muted small">Sin detalles agregados.</div>`;
      return;
    }

    fichaList().innerHTML = currentFichas.map((f, idx) => `
      <div class="d-flex align-items-center justify-content-between bg-white border rounded px-3 py-2 mb-2">
        <div>
          <span class="fw-semibold">${escapeHtml(f.caracteristica)}:</span>
          <span class="text-muted">${escapeHtml(f.especificacion)}</span>
        </div>
        <button type="button" class="btn btn-sm btn-dark" data-remove-ficha="${idx}">
          <i class="bi bi-trash"></i>
        </button>
      </div>
    `).join("");

    fichaList().querySelectorAll("[data-remove-ficha]").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.getAttribute("data-remove-ficha"));
        if (!Number.isFinite(idx)) return;
        currentFichas.splice(idx, 1);
        renderFichas();
        hideFieldError(fichaError());
      });
    });
  }

  function addFichaRow() {
    const caracteristica = fichaCaracteristica().value.trim();
    const especificacion = fichaEspecificacion().value.trim();

    if (!caracteristica || !especificacion) {
      showToast("Completa característica y especificación.", "warning", 2200);
      return false;
    }

    if (currentFichas.length >= MAX_FICHAS) {
      showFieldError(fichaError());
      showToast("Máximo 15 detalles.", "warning", 2200);
      return false;
    }

    currentFichas.push({ caracteristica, especificacion });
    fichaCaracteristica().value = "";
    fichaEspecificacion().value = "";
    hideFieldError(fichaError());
    renderFichas();
    fichaCaracteristica().focus();

    return true;
  }

  function addFichasFromBulkText() {
    const textarea = fichaBulkInput();
    if (!textarea) return false;

    const text = textarea.value.trim();

    if (!text) {
      showToast("No hay texto para procesar.", "warning", 2200);
      return false;
    }

    const lines = text
      .split(/\r?\n/)
      .map(x => x.trim())
      .filter(Boolean);

    if (!lines.length) {
      showToast("No se encontraron líneas válidas.", "warning", 2200);
      return false;
    }

    let agregadas = 0;
    let invalidas = 0;
    let duplicadas = 0;

    for (const line of lines) {
      if (currentFichas.length >= MAX_FICHAS) {
        showFieldError(fichaError());
        showToast(`Se alcanzó el máximo de ${MAX_FICHAS} detalles.`, "warning", 2500);
        break;
      }

      const parsed = parseFichaLine(line);

      if (!parsed) {
        invalidas++;
        continue;
      }

      const exists = currentFichas.some(f =>
        f.caracteristica.trim().toLowerCase() === parsed.caracteristica.trim().toLowerCase() &&
        f.especificacion.trim().toLowerCase() === parsed.especificacion.trim().toLowerCase()
      );

      if (exists) {
        duplicadas++;
        continue;
      }

      currentFichas.push(parsed);
      agregadas++;
    }

    renderFichas();
    hideFieldError(fichaError());

    if (agregadas > 0) {
      showToast(
        `Se agregaron ${agregadas} detalle(s)` +
        (invalidas ? `, ${invalidas} inválido(s)` : "") +
        (duplicadas ? `, ${duplicadas} duplicado(s)` : "") +
        ".",
        "success",
        2800
      );
    } else {
      showToast("No se agregaron detalles válidos.", "warning", 2500);
    }

    return agregadas > 0;
  }

  function parseFichaLine(line) {
    const raw = String(line ?? "").trim();
    if (!raw) return null;

    const idx = raw.indexOf(":");
    if (idx <= 0) return null;

    const caracteristica = raw.slice(0, idx).trim();
    const especificacion = raw.slice(idx + 1).trim();

    if (!caracteristica || !especificacion) return null;

    return { caracteristica, especificacion };
  }

  function validateForm() {
    let ok = true;

    const inval = (el) => {
      el.classList.add("is-invalid");
      el.classList.remove("is-valid");
      ok = false;
    };

    const val = (el) => {
      el.classList.remove("is-invalid");
      el.classList.add("is-valid");
    };

    if (!fNombre().value.trim()) inval(fNombre()); else val(fNombre());
    if (!fCodigo().value.trim()) inval(fCodigo()); else val(fCodigo());

    const stock = Number(fStock().value);
    if (!Number.isFinite(stock) || stock < 0) inval(fStock()); else val(fStock());

    const pc = Number(fPrecioCompra().value);
    if (!Number.isFinite(pc) || pc < 0) inval(fPrecioCompra()); else val(fPrecioCompra());

    const pv = Number(fPrecioVenta().value);
    if (!Number.isFinite(pv) || pv < 0) inval(fPrecioVenta()); else val(fPrecioVenta());

    syncDescripcionHtml();

    if (getDescripcionTextLength() === 0) {
      showDescripcionError();
      ok = false;
    } else {
      hideDescripcionError();
    }
    if (!fEstado().value) inval(fEstado()); else val(fEstado());

    const categoriaVal = $jq && $jq.fn && $jq.fn.select2 ? $jq(fCategoria()).val() : fCategoria().value;
    const marcaVal = $jq && $jq.fn && $jq.fn.select2 ? $jq(fMarca()).val() : fMarca().value;
    const proveedorVal = $jq && $jq.fn && $jq.fn.select2 ? $jq(fProveedor()).val() : fProveedor().value;

    if (!categoriaVal) {
      showFieldError(fCategoriaError());
      markSelect2Invalid(fCategoria(), true);
      ok = false;
    } else {
      hideFieldError(fCategoriaError());
      markSelect2Invalid(fCategoria(), false);
    }

    if (!marcaVal) {
      showFieldError(fMarcaError());
      markSelect2Invalid(fMarca(), true);
      ok = false;
    } else {
      hideFieldError(fMarcaError());
      markSelect2Invalid(fMarca(), false);
    }

    if (!proveedorVal) {
      showFieldError(fProveedorError());
      markSelect2Invalid(fProveedor(), true);
      ok = false;
    } else {
      hideFieldError(fProveedorError());
      markSelect2Invalid(fProveedor(), false);
    }

    if (currentImages.length < 1) {
      showFieldError(imgError());
      ok = false;
    } else {
      hideFieldError(imgError());
    }

    if (currentFichas.length > MAX_FICHAS) {
      showFieldError(fichaError());
      ok = false;
    } else {
      hideFieldError(fichaError());
    }

    return ok;
  }

  function buildFormDataForProduct() {
    const fd = new FormData();

    const categoriaVal = $jq && $jq.fn && $jq.fn.select2 ? $jq(fCategoria()).val() : fCategoria().value;
    const marcaVal = $jq && $jq.fn && $jq.fn.select2 ? $jq(fMarca()).val() : fMarca().value;
    const proveedorVal = $jq && $jq.fn && $jq.fn.select2 ? $jq(fProveedor()).val() : fProveedor().value;

    fd.append("nombre", fNombre().value.trim());
    fd.append("descripcion", fDescripcion().value.trim());
    fd.append("codigo", fCodigo().value.trim());
    fd.append("stock", String(Number(fStock().value)));
    fd.append("id_categoria", String(categoriaVal));
    fd.append("id_marca", String(marcaVal));
    fd.append("id_proveedor", String(proveedorVal));
    fd.append("precio_venta", String(Number(fPrecioVenta().value)));
    fd.append("precio_compra", String(Number(fPrecioCompra().value)));
    fd.append("estado", String(Number(fEstado().value)));

    if (ecommerceToggle().checked) {
      fd.append("url_amigable", fUrl().value.trim());
      fd.append("meta_titulo", fMetaTitulo().value.trim());
      fd.append("meta_descripcion", fMetaDescripcion().value.trim());
    } else {
      fd.append("url_amigable", "");
      fd.append("meta_titulo", "");
      fd.append("meta_descripcion", "");
    }

    currentFichas.forEach((f, i) => {
      fd.append(`fichas[${i}][caracteristica]`, f.caracteristica);
      fd.append(`fichas[${i}][especificacion]`, f.especificacion);
    });

    const serverImages = currentImages.filter(x => x.serverPath);
    const sorted = [...currentImages];

    for (let i = 0; i < sorted.length; i++) {
      const img = sorted[i];
      if (img.file) {
        fd.append(`imagen_${i + 1}`, img.file);
      } else if (editingId !== null) {
        fd.append(`keep_imagen_${i + 1}`, img.serverPath);
      }
    }

    if (editingId !== null) {
      const original = [1, 2, 3];
      original.forEach(slot => {
        const exists = serverImages.some(x => x.slot === slot && currentImages.includes(x));
        if (!exists) fd.append(`remove_imagen_${slot}`, "1");
      });
    }

    return fd;
  }

  async function createFromForm() {
    const fd = buildFormDataForProduct();
    await apiFetch("/productos", { method: "POST", body: fd, isFormData: true });
    showToast("Producto creado correctamente.", "success", 2500);
    await loadProductos();
  }

  async function updateFromForm() {
    const fd = buildFormDataForProduct();
    fd.append("_method", "PUT");
    await apiFetch(`/productos/${editingId}`, { method: "POST", body: fd, isFormData: true });
    showToast("Producto actualizado.", "success", 2200);
    await loadProductos();
  }

  async function toggleEstado(id, newEstado) {
    await apiFetch(`/productos/${id}/estado`, {
      method: "PATCH",
      body: { estado: Number(newEstado) }
    });
    showToast(`Estado actualizado: ${Number(newEstado) === 1 ? "Activo" : "Inactivo"}.`, "info", 2000);
    await loadProductos();
  }

  async function deleteProducto(id) {
    await apiFetch(`/productos/${id}`, { method: "DELETE" });
    showToast("Producto eliminado.", "danger", 2200);
    await loadProductos();
  }

  function openToggleConfirm(p) {
    const isActive = Number(p.estado) === 1;
    pendingToggleId = Number(p.id_producto);
    pendingToggleEstado = isActive ? 0 : 1;

    toggleTitle().textContent = isActive
      ? `¿Inactivar el producto "${p.nombre}"?`
      : `¿Activar el producto "${p.nombre}"?`;

    toggleHint().textContent = isActive
      ? "El producto quedará como inactivo."
      : "El producto quedará como activo.";

    modalToggle.show();
  }

  function openDeleteConfirm(p) {
    pendingDeleteId = Number(p.id_producto);
    deleteTitle().textContent = `¿Eliminar el producto "${p.nombre}"?`;
    modalDelete.show();
  }

  function openViewModal(p) {
    const imgs = [p.imagen_1, p.imagen_2, p.imagen_3].filter(Boolean);
    const fichas = Array.isArray(p.fichas_tecnicas) ? p.fichas_tecnicas : [];

    const carouselId = `productoViewCarousel_${p.id_producto}`;

    let imageHtml = `
      <div class="product-view-image-empty">
        Sin imágenes
      </div>
    `;

    if (imgs.length === 1) {
      imageHtml = `
        <div class="product-view-carousel">
          <img src="/storage/${escapeHtml(imgs[0])}" alt="${escapeHtml(p.nombre)}">
        </div>
      `;
    }

    if (imgs.length > 1) {
      imageHtml = `
        <div id="${carouselId}" class="carousel slide product-view-carousel" data-bs-ride="false">
          <div class="carousel-inner">
            ${imgs.map((x, idx) => `
              <div class="carousel-item ${idx === 0 ? "active" : ""}">
                <img src="/storage/${escapeHtml(x)}" alt="${escapeHtml(p.nombre)} ${idx + 1}">
              </div>
            `).join("")}
          </div>

          <button class="carousel-control-prev" type="button" data-bs-target="#${carouselId}" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Anterior</span>
          </button>

          <button class="carousel-control-next" type="button" data-bs-target="#${carouselId}" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Siguiente</span>
          </button>
        </div>
      `;
    }

    const fichasHtml = fichas.length
      ? fichas.map(f => `
          <div class="product-view-ficha-item">
            <strong>${escapeHtml(f.caracteristica)}:</strong> ${escapeHtml(f.especificacion)}
          </div>
        `).join("")
      : `<div class="text-muted">Sin ficha técnica</div>`;

    viewBody().innerHTML = `
      <div class="product-view-wrap">
        <div class="product-view-media">
          ${imageHtml}
        </div>

        <div class="product-view-info">
          <div class="product-view-title">${escapeHtml(p.nombre ?? "")}</div>

          <div class="product-view-meta">
            <div class="product-view-meta-item">
              Código: <strong>${escapeHtml(p.codigo ?? "")}</strong>
            </div>

            <div class="product-view-meta-item">
              Marca: <strong>${escapeHtml(p.marca?.nombre ?? "")}</strong>
            </div>

            <div class="product-view-meta-item">
              Categoría: <strong>${escapeHtml(p.categoria?.nombre ?? "")}</strong>
            </div>

            <div class="product-view-meta-item">
              Proveedor: <strong>${escapeHtml(p.proveedor?.empresa ?? "")}</strong>
            </div>

            <div class="product-view-meta-item">
              Stock:
              <span class="product-view-stock-badge">${escapeHtml(p.stock ?? 0)}</span>
            </div>

            <div class="product-view-meta-item">
              Estado: ${estadoBadge(p.estado)}
            </div>
          </div>

          <hr class="product-view-divider">

          <div class="product-view-section-title">Ficha técnica</div>

          <div class="product-view-fichas">
            ${fichasHtml}
          </div>

          <div class="product-view-prices">
            <div class="product-price-pill price-venta">
              <span class="label">Precio de venta</span>
              <span class="value">Bs ${money(p.precio_venta)}</span>
            </div>

            <div class="product-price-pill price-compra">
              <span class="label">Precio de compra</span>
              <span class="value">Bs ${money(p.precio_compra)}</span>
            </div>
          </div>
        </div>
      </div>
    `;

    modalView.show();
  }

  async function onTableClick(e) {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;
    if (btn.classList.contains("disabled") || btn.disabled) return;

    const id = Number(btn.getAttribute("data-id"));
    const action = btn.getAttribute("data-action");

    const p = productos.find(x => Number(x.id_producto) === id);
    if (!p) return;

    if (action === "view") return openViewModal(p);
    if (action === "edit") return openModalEdit(p);
    if (action === "toggle") return openToggleConfirm(p);
    if (action === "delete") return openDeleteConfirm(p);
  }

  function handleImageFiles(files) {
    const arr = Array.from(files || []);
    if (!arr.length) return;

    for (const file of arr) {
      if (currentImages.length >= MAX_IMGS) {
        showToast("Máximo 3 imágenes.", "warning", 2200);
        break;
      }

      if (!file.type.startsWith("image/")) {
        showToast("Solo se permiten imágenes.", "warning", 2200);
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        showToast("Cada imagen debe pesar máximo 5MB.", "warning", 2200);
        continue;
      }

      currentImages.push({
        file,
        url: URL.createObjectURL(file)
      });
    }

    renderImages();
    hideFieldError(imgError());
    imgInput().value = "";
  }

  window.initProductosPage = async function () {
    
    if (!root()) return;
    if (root().dataset.inited === "1") return;
    root().dataset.inited = "1";

    modalForm = new bootstrap.Modal(document.getElementById("modalProducto"));
    modalView = new bootstrap.Modal(document.getElementById("modalProductoView"));
    modalToggle = new bootstrap.Modal(document.getElementById("modalConfirmToggleProducto"));
    modalDelete = new bootstrap.Modal(document.getElementById("modalConfirmDeleteProducto"));
    modalCategoriaFromProducto = new bootstrap.Modal(document.getElementById("modalCategoriaFromProducto"));


    initDescripcionEditor();

    await loadLookups();
    await loadProductos();

    const modalProductoEl = document.getElementById("modalProducto");

    btnProcesarFichasTexto().addEventListener("click", addFichasFromBulkText);

    btnLimpiarFichasTexto().addEventListener("click", () => {
      fichaBulkInput().value = "";
      fichaBulkInput().focus();
    });

    fichaBulkInput().addEventListener("keydown", (ev) => {
      if ((ev.ctrlKey || ev.metaKey) && ev.key === "Enter") {
        ev.preventDefault();
        addFichasFromBulkText();
      }
    });

    fichaCaracteristica().addEventListener("keydown", (ev) => {
      if (ev.key === "Enter") {
        ev.preventDefault();
        fichaEspecificacion().focus();
      }
    });

    fichaEspecificacion().addEventListener("keydown", (ev) => {
      if (ev.key === "Enter") {
        ev.preventDefault();
        addFichaRow();
      }
    });

    fNombre().addEventListener("input", () => {
      if (!urlManuallyEdited) {
        fUrl().value = slugify(fNombre().value);
      }
    });

    fUrl().addEventListener("input", () => {
      const currentSlug = slugify(fNombre().value);
      const typedValue = fUrl().value.trim();

      if (!typedValue) {
        urlManuallyEdited = false;
        return;
      }

      urlManuallyEdited = typedValue !== currentSlug;
    });

    modalProductoEl.addEventListener("shown.bs.modal", () => {
      initSelect2();
    });

    modalProductoEl.addEventListener("hidden.bs.modal", () => {
      destroySelect2();
    });

    btnNuevo().addEventListener("click", openModalCreate);

    btnNuevaCategoriaDesdeProducto().addEventListener("click", openCategoriaFromProductoModal);

    catProdImgDropArea().addEventListener("click", () => {
      catProdImgInput().click();
    });

    catProdImgInput().addEventListener("change", () => {
      const file = catProdImgInput().files?.[0];

      if (!file) {
        clearCategoriaFromProductoImage();
        return;
      }

      if (!file.type.startsWith("image/")) {
        clearCategoriaFromProductoImage();
        showToast("Solo se permiten imágenes.", "warning", 2200);
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        clearCategoriaFromProductoImage();
        showToast("La imagen debe pesar máximo 5MB.", "warning", 2200);
        return;
      }

      categoriaTempImageFile = file;

      const url = URL.createObjectURL(file);
      catProdImgPreview().src = url;
      catProdImgPreview().style.display = "block";
      catProdImgPlaceholder().style.display = "none";
    });

    btnRemoveCatProdImg().addEventListener("click", () => {
      clearCategoriaFromProductoImage();
    });

    formCategoriaFromProducto().addEventListener("submit", async (ev) => {
      ev.preventDefault();
      ev.stopPropagation();

      if (!validateCategoriaFromProductoForm()) {
        showToast("Revisa los campos de la categoría.", "warning", 2300);
        return;
      }

      try {
        await createCategoriaFromProducto();
      } catch (err) {
        showToast(err.message || "No se pudo crear la categoría.", "danger", 2800);
      }
    });


    searchInput().addEventListener("input", () => {
      state.q = searchInput().value;
      state.page = 1;
      render();
    });

    pageSizeSel().addEventListener("change", () => {
      state.pageSize = pageSizeSel().value === "all" ? "all" : Number(pageSizeSel().value);
      state.page = 1;
      render();
    });

    viewModeSel().addEventListener("change", () => {
      state.viewMode = viewModeSel().value === "cards" ? "cards" : "table";
      state.page = 1;
      render();
    });

    tbody().addEventListener("click", (ev) => {
      onTableClick(ev).catch(() => {});
    });

    imgInput().addEventListener("change", () => {
      handleImageFiles(imgInput().files);
    });

    btnAddFichaRow().addEventListener("click", addFichaRow);
    btnAgregarFicha().addEventListener("click", addFichaRow);

    ecommerceToggle().addEventListener("change", () => {
      ecommerceBlock().style.display = ecommerceToggle().checked ? "block" : "none";
    });

    form().addEventListener("submit", async (ev) => {
      ev.preventDefault();
      ev.stopPropagation();

      if (!validateForm()) {
        showToast("Revisa los campos marcados en rojo.", "warning", 2500);
        return;
      }

      try {
        if (editingId === null) await createFromForm();
        else await updateFromForm();

        modalForm.hide();
      } catch (err) {
        showToast(err.message, "danger", 2800);
      }
    });

    btnConfirmToggle().addEventListener("click", async () => {
      if (pendingToggleId === null) return;
      try {
        await toggleEstado(pendingToggleId, pendingToggleEstado);
        modalToggle.hide();
      } catch (err) {
        showToast(err.message, "danger", 2600);
      } finally {
        pendingToggleId = null;
        pendingToggleEstado = null;
      }
    });

    btnConfirmDelete().addEventListener("click", async () => {
      if (pendingDeleteId === null) return;
      try {
        await deleteProducto(pendingDeleteId);
        modalDelete.hide();
      } catch (err) {
        showToast(err.message, "danger", 2600);
      } finally {
        pendingDeleteId = null;
      }
    });
  };
})();