(() => {
  const API_BASE = "/api";
  const TOKEN_KEY = "auth_token";
  const USER_KEY  = "auth_user";

  // DOM
  const root = () => document.getElementById("clientes-page");
  const tbody = () => document.getElementById("clientesTbody");
  const info = () => document.getElementById("clientesInfo");
  const pagination = () => document.getElementById("clientesPagination");
  const searchInput = () => document.getElementById("clientesSearch");
  const pageSizeSel = () => document.getElementById("clientesPageSize");
  const btnNuevo = () => document.getElementById("btnNuevoCliente");

  // Modal / form
  let modal;
  const form = () => document.getElementById("formCliente");
  const modalTitle = () => document.getElementById("modalClienteTitle");

    let modalDelete;
    let deleteId = null;
    const delTitle = () => document.getElementById("deleteClienteTitle");
    const btnConfirmDelete = () => document.getElementById("btnConfirmDeleteCliente");

  // Campos
  const fNombre = () => document.getElementById("cNombre");
  const fApellido = () => document.getElementById("cApellido");
  const fTelefono = () => document.getElementById("cTelefono");
  const fCi = () => document.getElementById("cCi");

  // State
  let state = {
    q: "",
    page: 1,
    pageSize: 10, // number or "all"
  };

  let clientes = [];
  let editingId = null;

  // -----------------------
  // Session helpers
  // -----------------------
  function getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  function getSessionUser() {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY) || "{}");
    } catch {
      return {};
    }
  }

  function sessionUserId() {
    const u = getSessionUser();
    // ajusta si tu auth_user guarda otro nombre
    return Number(u?.id_usuario || u?.id || 0);
  }

  function logoutHard() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    window.location.replace("/login");
  }

  // -----------------------
  // Utils
  // -----------------------
  function escapeHtml(str) {
    return String(str ?? "").replace(/[&<>"']/g, (m) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    }[m]));
  }

  function onlyDigits(v) {
    return String(v ?? "").replace(/\D/g, "");
  }

  function normalizeSpaces(v) {
    return String(v ?? "").trim().replace(/\s+/g, " ");
  }

  // -----------------------
  // Toast (Bootstrap)
  // -----------------------
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

  // -----------------------
  // API helper
  // -----------------------
  async function apiFetch(path, { method = "GET", body = null } = {}) {
    const token = getToken();
    if (!token) logoutHard();

    const headers = {
      "Accept": "application/json",
      "Authorization": "Bearer " + token,
    };

    if (body !== null) headers["Content-Type"] = "application/json";

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

  // -----------------------
  // Load
  // -----------------------
  async function loadClientes() {
    // Por defecto: solo estado=1 (si tu API ya filtra por defecto, igual sirve)
    const data = await apiFetch("/clientes?estado=1", { method: "GET" });

    // Si tu API devuelve paginate() -> {data:[...], ...}
    if (Array.isArray(data)) {
      clientes = data;
    } else if (Array.isArray(data?.data)) {
      // si te retorna paginator
      clientes = data.data;
    } else {
      clientes = [];
    }

    render();
  }

  // -----------------------
  // Filter + paging (front)
  // -----------------------
  function filtered() {
    const q = state.q.trim().toLowerCase();
    if (!q) return [...clientes];

    return clientes.filter(c => {
      const nombre = `${c.Nombre ?? ""} ${c.Apellido ?? ""}`.trim();
      const hay = [
        nombre,
        c.telefono ?? "",
        c.ci ?? "",
      ].join(" ").toLowerCase();

      return hay.includes(q);
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
    return { slice: list.slice(start, start + size), totalPages, page };
  }

  // -----------------------
  // Render
  // -----------------------
  function actionButtons(c) {
    return `
      <div class="d-flex justify-content-end gap-2">
        <button type="button"
                class="btn btn-sm btn-primary"
                data-action="edit"
                data-id="${c.id_cliente}"
                title="Editar cliente">
          <i class="bi bi-pencil-square"></i>
        </button>

        <button type="button"
                class="btn btn-sm btn-danger"
                data-action="delete"
                data-id="${c.id_cliente}"
                title="Eliminar cliente (estado=0)">
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
      info().textContent = `Mostrando ${total} de ${total} clientes`;
    } else {
      const size = Number(state.pageSize);
      const from = total === 0 ? 0 : (page - 1) * size + 1;
      const to = Math.min(total, page * size);
      info().textContent = `Mostrando ${from}-${to} de ${total} clientes`;
    }

    tbody().innerHTML = slice.map((c, idx) => {
      const n = state.pageSize === "all"
        ? (idx + 1)
        : ((page - 1) * Number(state.pageSize) + idx + 1);

      const fullName = `${c.Nombre ?? ""} ${c.Apellido ?? ""}`.trim() || "(Sin nombre)";
      const tel = c.telefono ?? "";
      const ci = c.ci ?? "";

      return `
        <tr>
          <td>${n}</td>
          <td class="fw-semibold">${escapeHtml(fullName)}</td>
          <td>${escapeHtml(tel)}</td>
          <td>${escapeHtml(ci)}</td>
          <td class="text-end">${actionButtons(c)}</td>
        </tr>
      `;
    }).join("");

    // Pagination
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

  // -----------------------
  // Modal / Form
  // -----------------------
  function resetForm() {
    editingId = null;
    form().querySelectorAll(".is-invalid, .is-valid").forEach(el => {
      el.classList.remove("is-invalid", "is-valid");
    });
    form().reset();
  }

  function openModalCreate() {
    resetForm();
    modalTitle().textContent = "Nuevo Cliente";
    modal.show();
  }

  function openModalEdit(c) {
    resetForm();
    editingId = Number(c.id_cliente);
    modalTitle().textContent = "Editar Cliente";

    fNombre().value = c.Nombre ?? "";
    fApellido().value = c.Apellido ?? "";
    fTelefono().value = c.telefono ?? "";
    fCi().value = c.ci ?? "";

    modal.show();
  }

  function openModalDelete(c) {
    deleteId = Number(c.id_cliente);

    const name = `${c.Nombre ?? ""} ${c.Apellido ?? ""}`.trim() || "Cliente";
    delTitle().textContent = `¿Eliminar a ${name}?`;

    modalDelete.show();
    }

  function validateForm() {
    let ok = true;

    const nombre = normalizeSpaces(fNombre().value);
    const telefono = onlyDigits(fTelefono().value);
    const apellido = normalizeSpaces(fApellido().value);
    const ci = normalizeSpaces(fCi().value);

    const inval = (el) => { el.classList.add("is-invalid"); el.classList.remove("is-valid"); ok = false; };
    const val = (el) => { el.classList.remove("is-invalid"); el.classList.add("is-valid"); };

    if (!nombre) inval(fNombre()); else val(fNombre());

    // teléfono obligatorio y mínimo 8 dígitos
    if (!telefono || telefono.length < 8) {
      inval(fTelefono());
    } else {
      fTelefono().value = telefono; // normaliza a dígitos
      val(fTelefono());
    }

    // opcionales (solo limpieza visual)
    if (apellido.length > 0) fApellido().classList.remove("is-invalid");
    if (ci.length > 0) fCi().classList.remove("is-invalid");

    return ok;
  }

  // -----------------------
  // API operations
  // -----------------------
  async function createClienteFromForm() {
    const payload = {
      Nombre: normalizeSpaces(fNombre().value),
      Apellido: normalizeSpaces(fApellido().value) || null,
      telefono: onlyDigits(fTelefono().value),
      ci: normalizeSpaces(fCi().value) || null,
      b2b: 0,
      estado: 1,
      id_usuario: sessionUserId(), // asigna al usuario logueado
    };

    await apiFetch("/clientes", { method: "POST", body: payload });
    showToast("Cliente creado correctamente.", "success", 2200);
    await loadClientes();
  }

  async function updateClienteFromForm() {
    const id = editingId;

    const payload = {
      Nombre: normalizeSpaces(fNombre().value),
      Apellido: normalizeSpaces(fApellido().value) || null,
      telefono: onlyDigits(fTelefono().value),
      ci: normalizeSpaces(fCi().value) || null,
      id_usuario: sessionUserId(),
      // estado se cambia solo con endpoint dedicado
    };

    await apiFetch(`/clientes/${id}`, { method: "PUT", body: payload });
    showToast("Cliente actualizado.", "success", 2000);
    await loadClientes();
  }

  async function deleteLogico(id) {
    // eliminar = estado 0
    await apiFetch(`/clientes/${id}/estado`, { method: "PATCH", body: { estado: 0 } });
    showToast("Cliente eliminado (estado=0).", "danger", 2200);
    await loadClientes();
  }

  // -----------------------
  // Table actions
  // -----------------------
  async function onTableClick(e) {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;

    const id = Number(btn.getAttribute("data-id"));
    const action = btn.getAttribute("data-action");

    if (action === "edit") {
      const c = clientes.find(x => Number(x.id_cliente) === id);
      if (!c) return;
      openModalEdit(c);
      return;
    }

    if (action === "delete") {
    const c = clientes.find(x => Number(x.id_cliente) === id);
    if (!c) return;
    openModalDelete(c);
    return;
    }

  }

  // -----------------------
  // Init (SPA-safe)
  // -----------------------
  window.initClientesPage = function () {
    if (!root()) return;
    if (root().dataset.inited === "1") return;
    root().dataset.inited = "1";

    modal = new bootstrap.Modal(document.getElementById("modalCliente"));

    modalDelete = new bootstrap.Modal(document.getElementById("modalConfirmDeleteCliente"));

    btnConfirmDelete().addEventListener("click", async () => {
    if (!deleteId) return;

    try {
        await deleteLogico(deleteId);
        modalDelete.hide();
    } catch (err) {
        showToast(err.message, "danger", 2600);
    } finally {
        deleteId = null;
    }
    });

    btnNuevo().addEventListener("click", () => openModalCreate());

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
      onTableClick(ev).catch(() => {});
    });

    form().addEventListener("submit", async (ev) => {
      ev.preventDefault();
      ev.stopPropagation();

      if (!validateForm()) {
        showToast("Revisa los campos marcados en rojo.", "warning", 2500);
        return;
      }

      try {
        if (editingId === null) {
          await createClienteFromForm();
        } else {
          await updateClienteFromForm();
        }
        modal.hide();
      } catch (err) {
        showToast(err.message, "danger", 2800);
      }
    });

    loadClientes().catch((err) => {
      showToast(err.message || "No se pudo cargar clientes.", "danger", 2800);
    });
  };
})();