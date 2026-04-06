(() => {
  const API_BASE = "/api";
  const TOKEN_KEY = "auth_token";

    let ventas = [];
    let modalCompletar = null;
    let ventaEditando = null;

    let modalAnular = null;
    let ventaAnulando = null;

    function anularVentaNumero() { return document.getElementById("anularVentaNumero"); }
    function anularVentaMotivo() { return document.getElementById("anularVentaMotivo"); }
    function btnConfirmAnularVenta() { return document.getElementById("btnConfirmAnularVenta"); }

  let state = {
    q: "",
    page: 1,
    pageSize: 10
  };

    function modalPreRegistroNumero() { return document.getElementById("modalPreRegistroNumero"); }
    function modalPreRegistroCliente() { return document.getElementById("modalPreRegistroCliente"); }
    function modalPreRegistroFecha() { return document.getElementById("modalPreRegistroFecha"); }
    function preRegistroDetalleTbody() { return document.getElementById("preRegistroDetalleTbody"); }
    function btnGuardarPreRegistro() { return document.getElementById("btnGuardarPreRegistro"); }

  function root() { return document.getElementById("pre-registro-venta-page"); }
  function tbody() { return document.getElementById("preVentaTbody"); }
  function info() { return document.getElementById("preVentaInfo"); }
  function pagination() { return document.getElementById("preVentaPagination"); }
  function searchInput() { return document.getElementById("preVentaSearch"); }
  function pageSizeSel() { return document.getElementById("preVentaPageSize"); }
  function btnConfirmRegistrar() { return document.getElementById("btnConfirmRegistrarVenta"); }
  function registrarVentaTitle() { return document.getElementById("registrarVentaTitle"); }

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

    function openAnularModal(v) {
        ventaAnulando = v;
        anularVentaNumero().textContent = `N° ${v.numero ?? "-"}`;
        anularVentaMotivo().value = "";
        modalAnular.show();
    }

    async function anularVenta(id, motivo = "") {
        await apiFetch(`/ventas/${id}/anular`, {
            method: "PATCH",
            body: {
            motivo_anulacion: motivo
            }
        });

        showToast("Venta anulada correctamente.", "success", 2200);
        await loadVentas();
    }

    function money(n) {
        return `Bs ${Number(n || 0).toFixed(2)}`;
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

    function facturadoText(v) {
        return Number(v) === 1 ? "Con factura" : "Sin factura";
    }

    function showToast(message, variant = "success", delayMs = 2500) {
        const container = document.getElementById("preVentaToastContainer");
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

    async function loadVentas() {
        const data = await apiFetch("/ventas?estado=1", { method: "GET" });

        if (Array.isArray(data)) {
        ventas = data;
        } else if (Array.isArray(data?.data)) {
        ventas = data.data;
        } else {
        ventas = [];
        }

        render();
    }

    function filtered() {
        const q = state.q.trim().toLowerCase();
        if (!q) return [...ventas];

        return ventas.filter(v => {
            const numero = String(v.numero ?? "");
            const cliente = String(v?.cliente?.nombre_completo ?? "");

            return [numero, cliente].join(" ").toLowerCase().includes(q);
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

    function getTotalVenta(v) {
        return Number(v.facturado_estado) === 1
        ? Number(v.total_con_factura || 0)
        : Number(v.total_sin_factura || 0);
    }



    function actionButtons(v) {
    return `
        <div class="d-flex justify-content-end gap-2">
        <button
            type="button"
            class="btn btn-sm btn-primary"
            data-action="completar"
            data-id="${v.id_venta}"
            title="Completar pre-registro"
        >
            <i class="bi bi-pencil-square"></i>
        </button>

        <button
            type="button"
            class="btn btn-sm btn-danger"
            data-action="anular"
            data-id="${v.id_venta}"
            title="Anular venta"
        >
            <i class="bi bi-x-circle"></i>
        </button>
        </div>
    `;
    }

    async function openCompletarModal(id) {
        const data = await apiFetch(`/ventas/${id}`, { method: "GET" });
        if (!data) return;

        ventaEditando = data;

        modalPreRegistroNumero().textContent = `N° ${data.numero ?? "-"}`;
        modalPreRegistroCliente().textContent = data?.cliente?.nombre_completo || "-";
        modalPreRegistroFecha().textContent = formatDateOnly(data.fecha);

        preRegistroDetalleTbody().innerHTML = (data.detalles || []).map(det => `
            <tr>
            <td>${escapeHtml(det.codigo || "-")}</td>
            <td>${escapeHtml(det.nombre_producto || "-")}</td>
            <td class="text-end">${escapeHtml(det.cantidad ?? 0)}</td>
            <td class="text-end">${escapeHtml(money(det.precio_unitario))}</td>
            <td>
                <input
                type="number"
                min="0"
                step="0.01"
                class="form-control form-control-sm text-end pre-registro-precio-compra"
                data-id="${det.id_ventas_detalle}"
                value="${Number(det.precio_compra || 0).toFixed(2)}"
                >
            </td>
            </tr>
        `).join("");

        modalCompletar.show();
    }

    async function guardarCompletarPreRegistro() {
        if (!ventaEditando) {
            throw new Error("No hay una venta seleccionada.");
        }

        const inputs = Array.from(document.querySelectorAll(".pre-registro-precio-compra"));

        if (!inputs.length) {
            throw new Error("No se encontraron detalles para actualizar.");
        }

        const detalles = inputs.map(input => {
            const precio = Number(input.value);

            if (!Number.isFinite(precio) || precio < 0) {
            throw new Error("Todos los precios de compra deben ser válidos.");
            }

            return {
            id_ventas_detalle: Number(input.getAttribute("data-id")),
            precio_compra: Number(precio.toFixed(2))
            };
        });

        await apiFetch(`/ventas/${ventaEditando.id_venta}/completar-pre-registro`, {
            method: "PATCH",
            body: { detalles }
        });

        showToast("Pre-registro completado correctamente.", "success", 2200);
        modalCompletar.hide();
        ventaEditando = null;
        await loadVentas();
        }

  function render() {
    const list = filtered();
    const { slice, totalPages, page } = paged(list);
    state.page = page;

    const total = list.length;

    if (state.pageSize === "all") {
      info().textContent = `Mostrando ${total} de ${total} pre-registros`;
    } else {
      const size = Number(state.pageSize);
      const from = total === 0 ? 0 : (page - 1) * size + 1;
      const to = Math.min(total, page * size);
      info().textContent = `Mostrando ${from}-${to} de ${total} pre-registros`;
    }

    tbody().innerHTML = slice.map((v, idx) => {
      const n = state.pageSize === "all"
        ? idx + 1
        : ((page - 1) * Number(state.pageSize) + idx + 1);

      return `
        <tr>
            <td class="fw-semibold">N° ${escapeHtml(v.numero ?? "-")}</td>
            <td>${escapeHtml(formatDateOnly(v.fecha))}</td>
            <td class="fw-semibold">${escapeHtml(v?.cliente?.nombre_completo || "-")}</td>
            <td class="text-end fw-semibold">${escapeHtml(money(getTotalVenta(v)))}</td>
            <td class="text-center">${escapeHtml(facturadoText(v.facturado_estado))}</td>
            <td class="text-end">${actionButtons(v)}</td>
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

  function buildPdfDataFromVenta(v) {
    const clienteNombre =
      v?.cliente?.nombre_completo ||
      `${v?.cliente?.Nombre || ""} ${v?.cliente?.Apellido || ""}`.trim();

    const clienteTelefono = v?.cliente?.telefono || "";
    const clienteText = [clienteNombre, clienteTelefono].filter(Boolean).join(" - ");

    return {
      numero: v.numero || "S/N",
      fecha: v.fecha,
      clienteText,
      factState: Number(v.facturado_estado) === 1 ? "si" : "no",
      pct: Number(v.porcentaje_factura || 0),
      delivery: Number(v.delivery || 0),
      empresa: {
        nombre: "Progsar Maquinarias",
        direccion: "Av. Tomas de lezo, 3er anillo externo C/Viador Moreno Peña",
        telefono: "62051817 / 74468939"
      },
      items: Array.isArray(v.detalles) ? v.detalles.map(item => ({
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

  async function verVenta(id) {
    const data = await apiFetch(`/ventas/${id}`, { method: "GET" });
    if (!data) return;

    const pdfData = buildPdfDataFromVenta(data);

    if (window.VentaPDF && typeof window.VentaPDF.open === "function") {
      window.VentaPDF.open(pdfData);
    } else {
      throw new Error("VentaPDF no está cargado.");
    }
  }

  function openConfirmRegistrar(v) {
    registrarId = Number(v.id_venta);
    registrarVentaTitle().textContent = `¿Registrar la venta N° ${v.numero}?`;
    modalConfirm.show();
  }

  async function registrarVenta(id) {
    await apiFetch(`/ventas/${id}/estado`, {
      method: "PATCH",
      body: { estado: 2 }
    });

    showToast("Venta registrada correctamente.", "success", 2200);
    await loadVentas();
  }

    async function onTableClick(e) {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;

    const id = Number(btn.getAttribute("data-id"));
    const action = btn.getAttribute("data-action");

    if (action === "completar") {
        await openCompletarModal(id);
        return;
    }

    if (action === "anular") {
        const v = ventas.find(x => Number(x.id_venta) === id);
        if (!v) return;
        openAnularModal(v);
    }
    }

  window.initPreRegistroVentaPage = function () {
    if (!root()) return;
    if (root().dataset.inited === "1") return;
    root().dataset.inited = "1";

    modalCompletar = new bootstrap.Modal(document.getElementById("modalCompletarPreRegistro"));

    modalAnular = new bootstrap.Modal(document.getElementById("modalAnularVenta"));

    searchInput().addEventListener("input", () => {
      state.q = searchInput().value;
      state.page = 1;
      render();
    });

    pageSizeSel().addEventListener("change", () => {
      const v = pageSizeSel().value;
      state.pageSize = v === "all" ? "all" : Number(v);
      state.page = 1;
      render();
    });

    tbody().addEventListener("click", (ev) => {
      onTableClick(ev).catch(err => {
        showToast(err.message || "No se pudo procesar la venta.", "danger", 2800);
      });
    });

    btnConfirmAnularVenta().addEventListener("click", async () => {
        if (!ventaAnulando) return;

        try {
            await anularVenta(ventaAnulando.id_venta, anularVentaMotivo().value.trim());
            modalAnular.hide();
            ventaAnulando = null;
        } catch (err) {
            showToast(err.message || "No se pudo anular la venta.", "danger", 2800);
        }
    });
    
    btnGuardarPreRegistro().addEventListener("click", async () => {
        try {
            await guardarCompletarPreRegistro();
        } catch (err) {
            showToast(err.message || "No se pudo completar el pre-registro.", "danger", 2800);
        }
    });

    loadVentas().catch(err => {
      showToast(err.message || "No se pudieron cargar los pre-registros.", "danger", 2800);
    });
  };
})();