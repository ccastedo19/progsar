(() => {
  const API_BASE = "/api";
  const TOKEN_KEY = "auth_token";
  const BASE_URL = window.APP_BASE_URL || "";

  let cotizaciones = [];

  let state = {
    q: "",
    page: 1,
    pageSize: 10,
  };

  function root() {
    return document.getElementById("cotizaciones-page");
  }

  function tbody() {
    return document.getElementById("cotizacionesTbody");
  }

  function info() {
    return document.getElementById("cotizacionesInfo");
  }

  function pagination() {
    return document.getElementById("cotizacionesPagination");
  }

  function searchInput() {
    return document.getElementById("cotizacionesSearch");
  }

  function pageSizeSel() {
    return document.getElementById("cotizacionesPageSize");
  }

  function getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  function logoutHard() {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    window.location.replace("/login");
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

  function money(n) {
    return `Bs ${Number(n || 0).toFixed(2)}`;
  }

  function showToast(message, variant = "success", delayMs = 2500) {
    const container = document.getElementById("cotizacionesToastContainer");
    if (!container) return;

    const id = "t_" + Math.random().toString(16).slice(2);

    const icon = variant === "success"
      ? "bi-check-circle"
      : variant === "warning"
      ? "bi-exclamation-triangle"
      : variant === "danger"
      ? "bi-x-circle"
      : "bi-info-circle";

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
    const toast = new bootstrap.Toast(el, { delay: delayMs, autohide: true });
    el.addEventListener("hidden.bs.toast", () => el.remove());
    toast.show();
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

  async function loadCotizaciones() {
    const data = await apiFetch("/cotizaciones", { method: "GET" });

    if (Array.isArray(data)) {
      cotizaciones = data;
    } else if (Array.isArray(data?.data)) {
      cotizaciones = data.data;
    } else {
      cotizaciones = [];
    }

    render();
  }

  function filtered() {
    const q = state.q.trim().toLowerCase();
    if (!q) return [...cotizaciones];

    return cotizaciones.filter(c => {
      const numero = String(c.numero ?? "");
      const cliente = String(c?.cliente?.nombre_completo ?? "");
      const telefono = String(c?.cliente?.telefono ?? "");

      return [numero, cliente, telefono].join(" ").toLowerCase().includes(q);
    });
  }

  function paged(list) {
    if (state.pageSize === "all") {
      return { slice: list, totalPages: 1, page: 1 };
    }

    const size = Number(state.pageSize);
    const totalPages = Math.max(1, Math.ceil(list.length / size));
    const page = Math.min(state.page, totalPages);
    const start = (page - 1) * size;

    return {
      slice: list.slice(start, start + size),
      totalPages,
      page
    };
  }

  function facturadoText(v) {
    const value = Number(v);

    if (value === 0) return "Sin factura";
    if (value === 1) return "Con factura";
    if (value === 2) return "Ambos";
    return "-";
  }

    function formatDateOnly(value) {
        if (!value) return "-";

        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return value;

        const day = String(date.getUTCDate()).padStart(2, "0");
        const month = String(date.getUTCMonth() + 1).padStart(2, "0");
        const year = date.getUTCFullYear();

        return `${day}/${month}/${year}`;
    }

  function getTotalCotizacion(cot) {
    const fact = Number(cot.facturado_estado);

    if (fact === 1) return Number(cot.total_con_factura || 0);
    return Number(cot.total_sin_factura || 0);
  }

  function actionButtons(cot) {
    return `
      <div class="d-flex justify-content-end gap-2">
        <button
          type="button"
          class="btn btn-sm btn-primary"
          data-action="view"
          data-id="${cot.id_cotizacion}"
          title="Ver cotización"
        >
          <i class="bi bi-eye"></i>
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
      info().textContent = `Mostrando ${total} de ${total} cotizaciones`;
    } else {
      const size = Number(state.pageSize);
      const from = total === 0 ? 0 : (page - 1) * size + 1;
      const to = Math.min(total, page * size);
      info().textContent = `Mostrando ${from}-${to} de ${total} cotizaciones`;
    }

    tbody().innerHTML = slice.map((cot, idx) => {

      const numero = cot.numero ?? "-";
      const fecha = formatDateOnly(cot.fecha);
      const vigencia = formatDateOnly(cot.fecha_vigencia);
      const cliente = cot?.cliente?.nombre_completo || "-";
      const telefono = cot?.cliente?.telefono || "-";
      const totalCot = money(getTotalCotizacion(cot));
      const fact = facturadoText(cot.facturado_estado);

      return `
        <tr>
  
          <td class="fw-semibold">N° ${escapeHtml(numero)}</td>
          <td>${escapeHtml(fecha)}</td>
          <td>${escapeHtml(vigencia)}</td>
          <td class="fw-semibold">${escapeHtml(cliente)}</td>
          <td>${escapeHtml(telefono)}</td>
          <td class="text-end fw-semibold">${escapeHtml(totalCot)}</td>
          <td class="text-center">${escapeHtml(fact)}</td>
          <td class="text-end">${actionButtons(cot)}</td>
        </tr>
      `;
    }).join("");

    if (totalPages <= 1 || state.pageSize === "all") {
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

    function buildPdfDataFromCotizacion(cot) {
    const clienteNombre =
        cot?.cliente?.nombre_completo ||
        `${cot?.cliente?.Nombre || ""} ${cot?.cliente?.Apellido || ""}`.trim();

    const clienteTelefono = cot?.cliente?.telefono || "";
    const clienteText = [clienteNombre, clienteTelefono].filter(Boolean).join(" - ");

    let factState = "no";
    if (Number(cot.facturado_estado) === 1) factState = "si";
    if (Number(cot.facturado_estado) === 2) factState = "ambos";

    return {
        numero: cot.numero || "S/N",
        fecha: cot.fecha,
        vigenciaDate: cot.fecha_vigencia,
        clienteText,
        factState,
        pct: Number(cot.porcentaje_factura || 0),
        delivery: Number(cot.delivery || 0),
        empresa: {
        nombre: "Progsar Maquinarias",
        direccion: "Av. Tomas de lezo, 3er anillo externo C/Viador Moreno Peña",
        telefono: "62051817 / 74468939"
        },
        items: Array.isArray(cot.detalles) ? cot.detalles.map(item => ({
        codigo: item.codigo,
        descripcion: item.nombre_producto || "",
        fichas_tecnicas: Array.isArray(item.fichas_tecnicas) ? item.fichas_tecnicas : [],
        cantidad: Number(item.cantidad || 0),
        precioU: Number(item.precio_unitario || 0),
        descuento: Number(item.descuento || 0),
        totalLinea: Number(item.total_producto || 0)
        })) : []
    };
    }

    async function verCotizacion(id) {
        const data = await apiFetch(`/cotizaciones/${id}`, { method: "GET" });
        if (!data) return;

        const pdfData = buildPdfDataFromCotizacion(data);

        if (window.CotizacionPDF && typeof window.CotizacionPDF.open === "function") {
            window.CotizacionPDF.open(pdfData);
        } else {
            throw new Error("CotizacionPDF no está cargado.");
        }
    }

  async function onTableClick(e) {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;

    const id = Number(btn.getAttribute("data-id"));
    const action = btn.getAttribute("data-action");

    if (action === "view") {
      await verCotizacion(id);
    }
  }

  window.initCotizacionesPage = function () {
    if (!root()) return;
    if (root().dataset.inited === "1") return;
    root().dataset.inited = "1";

  

    searchInput().addEventListener("input", () => {
      state.q = searchInput().value;
      state.page = 1;
      render();
    });

    pageSizeSel().addEventListener("change", () => {
      const v = pageSizeSel().value;
      state.pageSize = (v === "all") ? "all" : Number(v);
      state.page = 1;
      render();
    });

    tbody().addEventListener("click", (ev) => {
      onTableClick(ev).catch(err => {
        showToast(err.message || "No se pudo cargar la cotización.", "danger", 2800);
      });
    });

    loadCotizaciones().catch(err => {
      showToast(err.message || "No se pudieron cargar las cotizaciones.", "danger", 2800);
    });
  };
})();