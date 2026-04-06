(() => {
  const $jq = window.jQuery;
  const BASE_URL = window.APP_BASE_URL || "";
  const API_BASE = "/api";
  const TOKEN_KEY = "auth_token";

  let productsData = [];

  let state = {
    facturado: "no",
    porcentaje: 0,
    delivery: 0,
    items: [],
    qNombre: "",
    qCodigo: "",
    saving: false,
    loading: false
  };

  function root() {
    return document.getElementById("generar-cotizacion-page");
  }

  function clienteSel() {
    return document.getElementById("cotCliente");
  }

  function porcentajeInput() {
    return document.getElementById("cotPorcentajeFacturado");
  }

  function deliveryInput() {
    return document.getElementById("cotDelivery");
  }

  function fechaVigenciaInput() {
    return document.getElementById("cotFechaVigencia");
  }

  function itemsList() {
    return document.getElementById("cotItemsList");
  }

  function productsGrid() {
    return document.getElementById("cotProductsGrid");
  }

  function subtotalBaseView() {
    return document.getElementById("cotSubtotalBase");
  }

  function deliveryView() {
    return document.getElementById("cotDeliveryView");
  }

  function pctView() {
    return document.getElementById("cotPctView");
  }

  function totalesWrap() {
    return document.getElementById("cotTotalesWrap");
  }

  function facturadoSwitch() {
    return document.getElementById("cotFacturadoSwitch");
  }

  function searchNombre() {
    return document.getElementById("cotSearchNombre");
  }

  function searchCodigo() {
    return document.getElementById("cotSearchCodigo");
  }

  function btnGuardar() {
    return document.getElementById("btnCotGuardar");
  }

  function getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  function logoutHard() {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    window.location.replace("/login");
  }

  async function apiFetch(path, { method = "GET", body = null } = {}) {
    const token = getToken();
    if (!token) {
      logoutHard();
      return null;
    }

    const headers = {
      "Accept": "application/json",
      "Authorization": "Bearer " + token,
    };

    if (body !== null) {
      headers["Content-Type"] = "application/json";
    }

    const res = await fetch(API_BASE + path, {
      method,
      headers,
      body: body === null ? null : JSON.stringify(body),
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

  function money(n) {
    return `Bs ${Number(n || 0).toFixed(2)}`;
  }

  function formatInputNumber(n) {
    const num = Number(n || 0);
    return Number.isInteger(num) ? String(num) : String(num);
  }

  function escapeHtml(str) {
    return String(str ?? "").replace(/[&<>"']/g, m => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[m]));
  }

  function todayYmd() {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }

  function tomorrowYmd() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function normalizeNumber(value, fallback = 0) {
  if (value === null || value === undefined || value === "") return fallback;
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function showValidationErrors(errors) {
  const list = document.getElementById("cotErroresList");
  if (!list) return;

  list.innerHTML = errors.map(err => `<li>${escapeHtml(err)}</li>`).join("");

  const modalEl = document.getElementById("modalCotErrores");
  if (!modalEl || !window.bootstrap) return;

  const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
  modal.show();
}



  function getFacturadoEstadoInt() {
    if (state.facturado === "no") return 0;
    if (state.facturado === "si") return 1;
    return 2;
  }

  function getSelectedClientText() {
    const select = clienteSel();
    if (!select) return "";
    const opt = select.options[select.selectedIndex];
    return opt ? opt.text : "";
  }

  function initSelect2Cliente() {
    if (!$jq || !$jq.fn || !$jq.fn.select2) return;

    const $cliente = $jq(clienteSel());

    if ($cliente.hasClass("select2-hidden-accessible")) {
      $cliente.select2("destroy");
    }

    $cliente.select2({
      width: "100%",
      placeholder: "Selecciona un cliente..."
    });
  }

  function setFacturadoMode(mode) {
    state.facturado = ["no", "si", "ambos"].includes(mode) ? mode : "no";

    facturadoSwitch().querySelectorAll("[data-value]").forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-value") === state.facturado);
    });

    if (state.facturado === "no") {
      state.porcentaje = 0;
      porcentajeInput().value = "0";
      porcentajeInput().disabled = true;
    } else {
      porcentajeInput().disabled = false;
    }

    renderItems();
    renderTotales();
  }

  function getProductoImagen(producto) {
    if (!producto?.imagen_1) {
      return `${BASE_URL}/images/no-image.png`;
    }

    if (String(producto.imagen_1).startsWith("http")) {
      return producto.imagen_1;
    }

    if (String(producto.imagen_1).startsWith("/")) {
      return `${BASE_URL}${producto.imagen_1}`;
    }

    return `${BASE_URL}/storage/${producto.imagen_1}`;
  }

  async function loadClientes() {
    try {
      const data = await apiFetch("/clientes?estado=1", { method: "GET" });
      if (!data) return;

      const clientes = Array.isArray(data)
        ? data
        : (Array.isArray(data.data) ? data.data : []);

      const activos = clientes.filter(c => Number(c.estado) === 1);

      clienteSel().innerHTML = `
        <option value="">Selecciona un cliente...</option>
        ${activos.map(c => {
          const nombreCompleto = `${c.Nombre || ""} ${c.Apellido || ""}`.trim();
          const telefono = (c.telefono || "").trim();
          const texto = telefono ? `${nombreCompleto} - ${telefono}` : nombreCompleto;

          return `
            <option value="${c.id_cliente}">
              ${escapeHtml(texto)}
            </option>
          `;
        }).join("")}
      `;

      if ($jq && $jq.fn && $jq.fn.select2) {
        $jq(clienteSel()).trigger("change");
      }
    } catch (error) {
      console.error("Error cargando clientes", error);
      clienteSel().innerHTML = `<option value="">No se pudo cargar clientes</option>`;
    }
  }

  function renderProductsLoading() {
    productsGrid().innerHTML = `
      <div class="col-12">
        <div class="alert alert-light border mb-0">
          Cargando productos...
        </div>
      </div>
    `;
  }

  async function loadProductos() {
    try {
      state.loading = true;
      renderProductsLoading();

      const data = await apiFetch("/productos", { method: "GET" });
      if (!data) return;

      const productos = Array.isArray(data)
        ? data
        : (Array.isArray(data.data) ? data.data : []);

      productsData = productos
      .filter(p => Number(p.estado) === 1)
      .map(p => ({
        id: Number(p.id_producto),
        codigo: p.codigo || `PROD-${p.id_producto}`,
        nombre: p.nombre || "Sin nombre",
        stock: Number(p.stock || 0),
        precio_sin_factura: Number(p.precio_venta || 0),
        imagen: getProductoImagen(p),
        fichas_tecnicas: Array.isArray(p.fichas_tecnicas) ? p.fichas_tecnicas : []
      }));

      state.loading = false;
      renderProducts();
    } catch (error) {
      state.loading = false;
      console.error("Error cargando productos", error);
      productsGrid().innerHTML = `
        <div class="col-12">
          <div class="alert alert-danger mb-0">
            No se pudieron cargar los productos.
          </div>
        </div>
      `;
    }
  }

  function filteredProducts() {
    const qn = state.qNombre.trim().toLowerCase();
    const qc = state.qCodigo.trim().toLowerCase();

    return productsData.filter(p => {
      const byName = !qn || String(p.nombre).toLowerCase().includes(qn);
      const byCode = !qc || String(p.codigo).toLowerCase().includes(qc);
      return byName && byCode;
    });
  }

  function addProduct(productId) {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;

    const found = state.items.find(x => x.id === productId);

    if (found) {
      found.qty += 1;
    } else {
      state.items.push({
        id: product.id,
        codigo: product.codigo,
        nombre: product.nombre,
        stock: product.stock,
        imagen: product.imagen,
        fichas_tecnicas: Array.isArray(product.fichas_tecnicas) ? product.fichas_tecnicas : [],
        precio_base: Number(product.precio_sin_factura || 0),
        precio_unitario: Number(product.precio_sin_factura || 0),
        descuento: 0,
        qty: 1
      });
    }

    renderItems();
    renderTotales();
  }

  function increaseQty(productId) {
    const item = state.items.find(x => x.id === productId);
    if (!item) return;
    item.qty += 1;
    renderItems();
    renderTotales();
  }

  function decreaseQty(productId) {
    const item = state.items.find(x => x.id === productId);
    if (!item) return;

    item.qty -= 1;

    if (item.qty <= 0) {
      state.items = state.items.filter(x => x.id !== productId);
    }

    renderItems();
    renderTotales();
  }

  function removeItem(productId) {
    state.items = state.items.filter(x => x.id !== productId);
    renderItems();
    renderTotales();
  }

  function updateItemField(productId, field, value) {
    const item = state.items.find(x => x.id === productId);
    if (!item) return;

    const numericValue = Math.max(0, normalizeNumber(value, 0));

    if (field === "precio_unitario") {
      item.precio_unitario = numericValue;
    }

    if (field === "descuento") {
      item.descuento = numericValue;
    }

    renderTotales();
  }


  function getItemUnitNet(item) {
    return Math.max(0, Number(item.precio_unitario || 0) - Number(item.descuento || 0));
  }

  function getItemTotal(item) {
    return +(getItemUnitNet(item) * Number(item.qty || 0)).toFixed(2);
  }

  function renderProducts() {
    if (state.loading) {
      renderProductsLoading();
      return;
    }

    const list = filteredProducts();

    if (!list.length) {
      productsGrid().innerHTML = `
        <div class="col-12">
          <div class="alert alert-light border mb-0">
            No se encontraron productos.
          </div>
        </div>
      `;
      return;
    }

    productsGrid().innerHTML = list.map(p => `
      <div class="cot-product-card" data-add-product="${p.id}">

        <div class="cot-product-image">
          <img src="${escapeHtml(p.imagen)}" alt="${escapeHtml(p.nombre)}"
               onerror="this.onerror=null;this.src='${BASE_URL}/images/no-image.png';">
        </div>

        <div class="cot-product-body">
          <div class="cot-product-head">
            <div class="cot-product-code" title="${escapeHtml(p.codigo)}">${escapeHtml(p.codigo)}</div>
            <div class="cot-product-price">${money(p.precio_sin_factura)}</div>
          </div>

          <div class="cot-product-name" title="${escapeHtml(p.nombre)}">
            ${escapeHtml(p.nombre)}
          </div>
        </div>
      </div>
    `).join("");

    productsGrid().querySelectorAll("[data-add-product]").forEach(card => {
      card.addEventListener("click", () => {
        const id = Number(card.getAttribute("data-add-product"));
        addProduct(id);
      });
    });
  }

  function renderItems() {
    if (!state.items.length) {
      itemsList().innerHTML = `<div class="cot-item-empty">No hay productos agregados.</div>`;
      return;
    }

    itemsList().innerHTML = state.items.map(item => `
      <div class="cot-item-row">
        <div class="cot-item-content">
          <div class="cot-item-top">
            <div class="cot-item-info">
              <div class="cot-item-name">${escapeHtml(item.nombre)}</div>
            </div>

            <div class="cot-item-actions">
              <button type="button" class="btn btn-sm btn-primary cot-btn-qty" data-dec="${item.id}" title="Disminuir">
                <i class="bi bi-dash-lg"></i>
              </button>

              <div class="cot-qty-box">${item.qty}</div>

              <button type="button" class="btn btn-sm btn-primary cot-btn-qty" data-inc="${item.id}" title="Aumentar">
                <i class="bi bi-plus-lg"></i>
              </button>

              <button type="button" class="btn btn-sm btn-danger cot-item-remove" data-remove="${item.id}" title="Eliminar">
                <i class="bi bi-x-lg"></i>
              </button>
            </div>
          </div>

          <div class="cot-item-edit-grid cot-item-edit-grid-compact">

            <div class="cot-field d-flex flex-row gap-2 align-items-center">
              <div>
                <label class="form-label form-label-sm mb-0">Precio</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  style="width:150px"
                  class="form-control form-control-sm"
                  data-precio="${item.id}"
                  value="${formatInputNumber(item.precio_unitario)}"
                >
              </div>
              <div>
                <label class="form-label form-label-sm mb-0">Desc.</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  style="width:150px"
                  class="form-control form-control-sm"
                  data-descuento="${item.id}"
                  value="${formatInputNumber(item.descuento)}"
                >
              </div>
            </div>

          </div>
        </div>
      </div>
    `).join("");

    itemsList().querySelectorAll("[data-inc]").forEach(btn => {
      btn.addEventListener("click", () => increaseQty(Number(btn.getAttribute("data-inc"))));
    });

    itemsList().querySelectorAll("[data-dec]").forEach(btn => {
      btn.addEventListener("click", () => decreaseQty(Number(btn.getAttribute("data-dec"))));
    });

    itemsList().querySelectorAll("[data-remove]").forEach(btn => {
      btn.addEventListener("click", () => removeItem(Number(btn.getAttribute("data-remove"))));
    });

    itemsList().querySelectorAll("[data-precio]").forEach(input => {
      input.addEventListener("input", () => {
        updateItemField(Number(input.getAttribute("data-precio")), "precio_unitario", input.value);
        renderTotales();
      });
    });

    itemsList().querySelectorAll("[data-descuento]").forEach(input => {
      input.addEventListener("input", () => {
        updateItemField(Number(input.getAttribute("data-descuento")), "descuento", input.value);
        renderTotales();
      });
    });
  }

  function calcBaseSinFactura() {
    return state.items.reduce((acc, item) => acc + getItemTotal(item), 0);
  }

  function calcBaseConFactura() {
    const base = calcBaseSinFactura();
    return +(base + (base * Number(state.porcentaje || 0) / 100)).toFixed(2);
  }

  function renderTotales() {
    const subtotalSin = calcBaseSinFactura();
    const subtotalCon = calcBaseConFactura();
    const delivery = Math.max(0, normalizeNumber(state.delivery, 0));

    subtotalBaseView().textContent = money(subtotalSin);
    deliveryView().textContent = money(delivery);
    pctView().textContent = `${Number(state.porcentaje || 0).toFixed(2).replace(/\.00$/, "")}%`;

    const totalSin = +(subtotalSin + delivery).toFixed(2);
    const totalCon = +(subtotalCon + delivery).toFixed(2);

    let html = "";

    if (state.facturado === "no") {
      html = `
        <div class="cot-total-line total-sinfactura">
          <span class="label">Total sin factura</span>
          <span class="value">${money(totalSin)}</span>
        </div>
      `;
    }

    if (state.facturado === "si") {
      html = `
        <div class="cot-total-line total-factura">
          <span class="label">Total con factura</span>
          <span class="value">${money(totalCon)}</span>
        </div>
      `;
    }

    if (state.facturado === "ambos") {
      html = `
        <div class="cot-total-line total-sinfactura">
          <span class="label">Total sin factura</span>
          <span class="value">${money(totalSin)}</span>
        </div>
        <div class="cot-total-line total-factura">
          <span class="label">Total con factura</span>
          <span class="value">${money(totalCon)}</span>
        </div>
      `;
    }

    totalesWrap().innerHTML = html;
  }

  function buildPayload() {
    const subtotalSin = calcBaseSinFactura();
    const subtotalCon = calcBaseConFactura();
    const delivery = Math.max(0, normalizeNumber(state.delivery, 0));

    return {
      fecha: todayYmd(),
      fecha_vigencia: fechaVigenciaInput().value || null,
      facturado_estado: getFacturadoEstadoInt(),
      porcentaje_factura: Number(state.porcentaje || 0),
      delivery: delivery,
      id_cliente: Number(clienteSel().value),
      total_sin_factura: +(subtotalSin + delivery).toFixed(2),
      total_con_factura: +(subtotalCon + delivery).toFixed(2),
      detalles: state.items.map(item => ({
        id_producto: item.id,
        codigo: item.codigo,
        nombre_producto: item.nombre,
        precio_unitario: Number(item.precio_unitario || 0),
        cantidad: Number(item.qty || 0),
        descuento: Number(item.descuento || 0),
        total_producto: getItemTotal(item)
      }))
    };
  }

  function validateCotizacion() {
    const errors = [];

    if (!clienteSel().value) {
      errors.push("Debes seleccionar un cliente.");
    }

    if (!state.items.length) {
      errors.push("Debes agregar al menos un producto.");
    }

    const vigencia = fechaVigenciaInput()?.value || "";
    const minimoVigencia = tomorrowYmd();

    if (!vigencia) {
      errors.push("Debes ingresar la fecha de vigencia.");
    } else if (vigencia < minimoVigencia) {
      errors.push("La fecha de vigencia debe ser mínimo un día después de la fecha actual.");
    }

    if (Number(state.delivery) < 0) {
      errors.push("El delivery no puede ser negativo.");
    }

    state.items.forEach((item, index) => {
      const nro = index + 1;
      const nombre = item.nombre || `Producto ${nro}`;
      const precio = normalizeNumber(item.precio_unitario, 0);
      const descuento = normalizeNumber(item.descuento, 0);

      if (precio <= 0) {
        errors.push(`El precio a vender del producto "${nombre}" debe ser mayor a cero.`);
      }

      if (descuento < 0) {
        errors.push(`El descuento del producto "${nombre}" no puede ser negativo.`);
      }

      if (descuento >= precio) {
        errors.push(`El descuento del producto "${nombre}" no puede ser mayor al precio a vender.`);
      }

      if (Number(item.qty || 0) <= 0) {
        errors.push(`La cantidad del producto "${nombre}" debe ser mayor a cero.`);
      }
    });

    return errors;
  }

  function buildPdfData(payload, responseData) {
    return {
      numero: responseData?.data?.numero || responseData?.numero || responseData?.cotizacion_id || "S/N",
      fecha: payload.fecha,
      vigenciaDate: payload.fecha_vigencia,
      clienteText: getSelectedClientText(),
      factState: state.facturado,
      pct: Number(state.porcentaje || 0),
      delivery: Number(state.delivery || 0),
      empresa: {
        nombre: "Progsar Maquinarias",
        direccion: "Av. Tomas de lezo, 3er anillo externo C/Viador Moreno Peña",
        telefono: "62051817 / 74468939"
      },
      items: state.items.map(item => ({
        codigo: item.codigo,
        descripcion: item.nombre,
        fichas_tecnicas: Array.isArray(item.fichas_tecnicas) ? item.fichas_tecnicas : [],
        cantidad: item.qty,
        precioU: Number(item.precio_unitario || 0),
        descuento: Number(item.descuento || 0),
        totalLinea: getItemTotal(item)
      }))
    };
  }

  async function guardarCotizacion() {
    if (state.saving) return;

    const errors = validateCotizacion();

    if (errors.length) {
      showValidationErrors(errors);
      return;
    }

    const payload = buildPayload();

    state.saving = true;

    if (btnGuardar()) {
      btnGuardar().disabled = true;
      btnGuardar().innerHTML = `<span class="spinner-border spinner-border-sm me-1"></span> Guardando...`;
    }

    try {
      const data = await apiFetch("/cotizaciones", {
        method: "POST",
        body: payload
      });

      if (!data) return;

      const pdfData = buildPdfData(payload, data);

      if (window.CotizacionPDF && typeof window.CotizacionPDF.open === "function") {
        window.CotizacionPDF.open(pdfData);
      } else {
        console.warn("CotizacionPDF no está cargado.");
      }
    } catch (error) {
      console.error(error);
      showValidationErrors([error.message || "Ocurrió un error al guardar la cotización."]);
    } finally {
      state.saving = false;

      if (btnGuardar()) {
        btnGuardar().disabled = false;
        btnGuardar().innerHTML = `<i class="bi bi-file-earmark-text me-1"></i> Cotizar`;
      }
    }
  }


  function resetAll() {
    state = {
      facturado: "no",
      porcentaje: 0,
      delivery: 0,
      items: [],
      qNombre: "",
      qCodigo: "",
      saving: false,
      loading: false
    };

    if (clienteSel()) {
      clienteSel().value = "";
      if ($jq && $jq.fn && $jq.fn.select2) {
        $jq(clienteSel()).val("").trigger("change");
      }
    }

    if (porcentajeInput()) porcentajeInput().value = "0";
    if (deliveryInput()) deliveryInput().value = "0";
    if (fechaVigenciaInput()) {
      fechaVigenciaInput().min = tomorrowYmd();
      fechaVigenciaInput().value = tomorrowYmd();
    }
    if (searchNombre()) searchNombre().value = "";
    if (searchCodigo()) searchCodigo().value = "";

    setFacturadoMode("no");
    renderProducts();
    renderItems();
    renderTotales();
    if (fechaVigenciaInput()) {
      fechaVigenciaInput().min = tomorrowYmd();
      fechaVigenciaInput().value = tomorrowYmd();
    }
  }

  window.initGenerarCotizacionPage = async function () {
    if (!root()) return;
    if (root().dataset.inited === "1") return;
    root().dataset.inited = "1";

    initSelect2Cliente();

    facturadoSwitch().querySelectorAll("[data-value]").forEach(btn => {
      btn.addEventListener("click", () => {
        setFacturadoMode(btn.getAttribute("data-value"));
      });
    });

    porcentajeInput().addEventListener("input", () => {
      state.porcentaje = Math.max(0, Number(porcentajeInput().value || 0));
      renderTotales();
    });

    deliveryInput().addEventListener("input", () => {
      state.delivery = Math.max(0, normalizeNumber(deliveryInput().value, 0));
      renderTotales();
    });

    deliveryInput().addEventListener("blur", () => {
      const value = deliveryInput().value.trim();

      if (value === "" || !Number.isFinite(Number(value)) || Number(value) < 0) {
        deliveryInput().value = "0";
        state.delivery = 0;
        renderTotales();
      }
    });

    searchNombre().addEventListener("input", () => {
      state.qNombre = searchNombre().value;
      renderProducts();
    });

    searchCodigo().addEventListener("input", () => {
      state.qCodigo = searchCodigo().value;
      renderProducts();
    });

    document.getElementById("btnCotLimpiar").addEventListener("click", resetAll);
    document.getElementById("btnCotGuardar").addEventListener("click", guardarCotizacion);

    setFacturadoMode("no");
    renderItems();
    renderTotales();

    if (fechaVigenciaInput()) {
      const manana = tomorrowYmd();
      fechaVigenciaInput().min = manana;
      fechaVigenciaInput().value = manana;
    }

    await loadClientes();
    await loadProductos();
  };
})();