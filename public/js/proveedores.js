(() => {
  const API_BASE = "/api";
  const TOKEN_KEY = "auth_token";

  // -----------------------
  // DOM
  // -----------------------
  const root = () => document.getElementById("proveedores-page");
  const tbody = () => document.getElementById("proveedoresTbody");
  const info = () => document.getElementById("proveedoresInfo");
  const pagination = () => document.getElementById("proveedoresPagination");
  const searchInput = () => document.getElementById("proveedoresSearch");
  const pageSizeSel = () => document.getElementById("proveedoresPageSize");
  const btnNuevo = () => document.getElementById("btnNuevoProveedor");

  let modalForm;
  let modalDelete;

  const form = () => document.getElementById("formProveedor");

  const fNit = () => document.getElementById("provNit");
  const fEmpresa = () => document.getElementById("provEmpresa");
  const fTelefono = () => document.getElementById("provTelefono");
  const fCiudad = () => document.getElementById("provCiudad");
  const fDireccion = () => document.getElementById("provDireccion");

  const deleteTitle = () => document.getElementById("deleteProveedorTitle");
  const btnConfirmDelete = () => document.getElementById("btnConfirmDeleteProveedor");

  // -----------------------
  // State
  // -----------------------
  let state = {
    q: "",
    page: 1,
    pageSize: 10,
  };

  let proveedores = [];
  let editingId = null;
  let pendingDeleteId = null;

  // -----------------------
  // Auth
  // -----------------------
  function getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  function logoutHard() {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    window.location.replace("/login");
  }

  // -----------------------
  // Utils
  // -----------------------
  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (m) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[m]));
  }

  function onlyDigits(v) {
    return String(v || "").replace(/\D/g, "");
  }

  function estadoLabel(e) {
    return Number(e) === 1 ? "Activo" : "Eliminado";
  }

  function estadoBadge(e) {
    return Number(e) === 1
      ? `<span class="badge text-bg-success">Activo</span>`
      : `<span class="badge text-bg-secondary">Eliminado</span>`;
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

  // -----------------------
  // API
  // -----------------------
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

  // -----------------------
  // Load
  // -----------------------
  async function loadProveedores() {
    const data = await apiFetch("/proveedores", { method: "GET" });
    proveedores = Array.isArray(data) ? data : [];
    render();
  }

  // -----------------------
  // Filter + paging
  // -----------------------
  function filtered() {
    const q = state.q.trim().toLowerCase();
    if (!q) return [...proveedores];

    return proveedores.filter(p => {
      const hay = [
        p.nit ?? "",
        p.empresa ?? "",
        p.telefono ?? "",
        p.ciudad ?? "",
        p.direccion ?? "",
        estadoLabel(p.estado),
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
  function actionButtons(p) {
    const disabledAll = Number(p.estado) === 2 ? "disabled" : "";

    return `
      <div class="d-flex justify-content-end gap-2">
        <button type="button"
                class="btn btn-sm btn-primary ${disabledAll}"
                data-action="edit"
                data-id="${p.id_proveedor}"
                title="Editar proveedor">
          <i class="bi bi-pencil-square"></i>
        </button>

        <button type="button"
                class="btn btn-sm btn-danger ${disabledAll}"
                data-action="delete"
                data-id="${p.id_proveedor}"
                title="Eliminar proveedor">
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
      info().textContent = `Mostrando ${total} de ${total} proveedores`;
    } else {
      const size = Number(state.pageSize);
      const from = total === 0 ? 0 : (page - 1) * size + 1;
      const to = Math.min(total, page * size);
      info().textContent = `Mostrando ${from}-${to} de ${total} proveedores`;
    }

    tbody().innerHTML = slice.map((p, idx) => {
      const n = state.pageSize === "all"
        ? (idx + 1)
        : ((page - 1) * Number(state.pageSize) + idx + 1);

      return `
        <tr>
          <td>${n}</td>
          <td>${escapeHtml(p.nit ?? "")}</td>
          <td class="fw-semibold">${escapeHtml(p.empresa ?? "")}</td>
          <td>${escapeHtml(p.telefono ?? "")}</td>
          <td>${escapeHtml(p.ciudad ?? "")}</td>
          <td>${escapeHtml(p.direccion ?? "")}</td>
          <td>${estadoBadge(p.estado)}</td>
          <td class="text-end">${actionButtons(p)}</td>
        </tr>
      `;
    }).join("");

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
    document.getElementById("modalProveedorTitle").textContent = "Nuevo Proveedor";
    modalForm.show();
  }

  function openModalEdit(p) {
    resetForm();
    editingId = Number(p.id_proveedor);
    document.getElementById("modalProveedorTitle").textContent = "Editar Proveedor";

    fNit().value = p.nit ?? "";
    fEmpresa().value = p.empresa ?? "";
    fTelefono().value = p.telefono ?? "";
    fCiudad().value = p.ciudad ?? "";
    fDireccion().value = p.direccion ?? "";

    modalForm.show();
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

    const nit = fNit().value.trim();
    const empresa = fEmpresa().value.trim();
    const telefono = onlyDigits(fTelefono().value.trim());
    const ciudad = fCiudad().value.trim();
    const direccion = fDireccion().value.trim();

    if (nit.length > 50) inval(fNit()); else {
      fNit().value = nit;
      fNit().classList.remove("is-invalid");
    }

    if (!empresa || empresa.length > 150) inval(fEmpresa()); else val(fEmpresa());

    if (!telefono || telefono.length > 20) {
      inval(fTelefono());
    } else {
      fTelefono().value = telefono;
      val(fTelefono());
    }

    if (ciudad.length > 100) inval(fCiudad()); else {
      fCiudad().value = ciudad;
      fCiudad().classList.remove("is-invalid");
    }

    if (!direccion || direccion.length > 255) inval(fDireccion()); else val(fDireccion());

    return ok;
  }

  // -----------------------
  // API ops
  // -----------------------
  async function createFromForm() {
    await apiFetch("/proveedores", {
      method: "POST",
      body: {
        nit: fNit().value.trim() || null,
        empresa: fEmpresa().value.trim(),
        telefono: fTelefono().value.trim(),
        ciudad: fCiudad().value.trim() || null,
        direccion: fDireccion().value.trim(),
      }
    });

    showToast("Proveedor creado correctamente.", "success", 2500);
    await loadProveedores();
  }

  async function updateFromForm() {
    const id = editingId;

    await apiFetch(`/proveedores/${id}`, {
      method: "PUT",
      body: {
        nit: fNit().value.trim() || null,
        empresa: fEmpresa().value.trim(),
        telefono: fTelefono().value.trim(),
        ciudad: fCiudad().value.trim() || null,
        direccion: fDireccion().value.trim(),
      }
    });

    showToast("Proveedor actualizado.", "success", 2200);
    await loadProveedores();
  }

  async function deleteProveedor(id) {
    await apiFetch(`/proveedores/${id}`, { method: "DELETE" });
    showToast("Proveedor eliminado.", "danger", 2200);
    await loadProveedores();
  }

  // -----------------------
  // Confirm delete
  // -----------------------
  function openDeleteConfirm(p) {
    pendingDeleteId = Number(p.id_proveedor);
    const name = p.empresa ?? "este proveedor";
    deleteTitle().textContent = `¿Eliminar el proveedor "${name}"?`;
    modalDelete.show();
  }

  // -----------------------
  // Table actions
  // -----------------------
  async function onTableClick(e) {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;

    if (btn.classList.contains("disabled") || btn.disabled) return;

    const id = Number(btn.getAttribute("data-id"));
    const action = btn.getAttribute("data-action");

    const p = proveedores.find(x => Number(x.id_proveedor) === id);
    if (!p) return;

    if (action === "edit") {
      openModalEdit(p);
      return;
    }

    if (action === "delete") {
      openDeleteConfirm(p);
      return;
    }
  }

  // -----------------------
  // Init
  // -----------------------
  window.initProveedoresPage = function () {
    if (!root()) return;
    if (root().dataset.inited === "1") return;
    root().dataset.inited = "1";

    modalForm = new bootstrap.Modal(document.getElementById("modalProveedor"));
    modalDelete = new bootstrap.Modal(document.getElementById("modalConfirmDeleteProveedor"));

    btnNuevo().addEventListener("click", openModalCreate);

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
          await createFromForm();
        } else {
          await updateFromForm();
        }
        modalForm.hide();
      } catch (err) {
        showToast(err.message, "danger", 2800);
      }
    });

    btnConfirmDelete().addEventListener("click", async () => {
      if (pendingDeleteId === null) return;

      const id = pendingDeleteId;

      try {
        await deleteProveedor(id);
        modalDelete.hide();
      } catch (err) {
        showToast(err.message, "danger", 2800);
      } finally {
        pendingDeleteId = null;
      }
    });

    loadProveedores().catch((err) => {
      showToast(err.message || "No se pudo cargar proveedores.", "danger", 2800);
    });
  };
})();