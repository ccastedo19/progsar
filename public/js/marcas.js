(() => {
  const API_BASE = "/api";
  const TOKEN_KEY = "auth_token";

  // -----------------------
  // DOM
  // -----------------------
  const root = () => document.getElementById("marcas-page");
  const tbody = () => document.getElementById("marcasTbody");
  const info = () => document.getElementById("marcasInfo");
  const pagination = () => document.getElementById("marcasPagination");
  const searchInput = () => document.getElementById("marcasSearch");
  const pageSizeSel = () => document.getElementById("marcasPageSize");
  const btnNuevo = () => document.getElementById("btnNuevaMarca");

  // Modal form
  let modalForm;
  const form = () => document.getElementById("formMarca");

  // Confirm modals
  let modalToggle;
  let modalDelete;

  const toggleTitle = () => document.getElementById("toggleMarcaTitle");
  const toggleHint = () => document.getElementById("toggleMarcaHint");
  const btnConfirmToggle = () => document.getElementById("btnConfirmToggleMarca");

  const deleteTitle = () => document.getElementById("deleteMarcaTitle");
  const btnConfirmDelete = () => document.getElementById("btnConfirmDeleteMarca");

  // Imagen
  const imgDropArea = () => document.getElementById("marcaImgDropArea");
  const imgInput = () => document.getElementById("marcaImg");
  const imgPreview = () => document.getElementById("marcaImgPreview");
  const imgPlaceholder = () => document.getElementById("marcaImgPlaceholder");
  const btnRemoveImg = () => document.getElementById("btnRemoveMarcaImg");

  // Campos
  const fNombre = () => document.getElementById("marcaNombre");
  const fDescripcion = () => document.getElementById("marcaDescripcion");

  // -----------------------
  // State
  // -----------------------
  let state = { q: "", page: 1, pageSize: 10 };
  let marcas = [];
  let editingId = null;

  let pendingToggleId = null;
  let pendingToggleNewEstado = null;
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

  function estadoLabel(e) {
    const n = Number(e);
    if (n === 1) return "Activo";
    if (n === 0) return "Inactivo";
    return "Eliminado";
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
  async function loadMarcas() {
    const data = await apiFetch("/marcas", { method: "GET" });
    marcas = Array.isArray(data) ? data : [];
    render();
  }

  // -----------------------
  // Filter + paging
  // -----------------------
  function filtered() {
    const q = state.q.trim().toLowerCase();
    if (!q) return [...marcas];

    return marcas.filter(m => {
      const hay = [
        m.nombre ?? "",
        m.descripcion ?? "",
        estadoLabel(m.estado),
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
  function actionButtons(m) {
    const e = Number(m.estado);
    const isActive = e === 1;

    const toggleIcon = isActive ? "bi-slash-circle" : "bi-check-circle";
    const toggleTitleTxt = isActive ? "Inactivar marca" : "Activar marca";

    const disabledAll = e === 2 ? "disabled" : "";

    return `
      <div class="d-flex justify-content-end gap-2">
        <button type="button"
                class="btn btn-sm btn-primary ${disabledAll}"
                data-action="edit"
                data-id="${m.id_marca}"
                title="Editar marca">
          <i class="bi bi-pencil-square"></i>
        </button>

        <button type="button"
                class="btn btn-sm btn-warning ${disabledAll}"
                data-action="toggle"
                data-id="${m.id_marca}"
                title="${toggleTitleTxt}">
          <i class="bi ${toggleIcon}"></i>
        </button>

        <button type="button"
                class="btn btn-sm btn-danger ${disabledAll}"
                data-action="delete"
                data-id="${m.id_marca}"
                title="Eliminar marca (estado=2)">
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
      info().textContent = `Mostrando ${total} de ${total} marcas`;
    } else {
      const size = Number(state.pageSize);
      const from = total === 0 ? 0 : (page - 1) * size + 1;
      const to = Math.min(total, page * size);
      info().textContent = `Mostrando ${from}-${to} de ${total} marcas`;
    }

    tbody().innerHTML = slice.map((m, idx) => {
      const n = state.pageSize === "all"
        ? (idx + 1)
        : ((page - 1) * Number(state.pageSize) + idx + 1);

      const img = m.imagen ? ("/storage/" + m.imagen) : "https://via.placeholder.com/60?text=IMG";
      const nombre = m.nombre ?? "(Sin nombre)";
      const desc = (m.descripcion ?? "").trim();

      return `
        <tr>
          <td>${n}</td>
          <td>
            <img src="${escapeHtml(img)}" class="rounded border"
                 style="width:56px;height:56px;object-fit:cover;" alt="img">
          </td>
          <td class="fw-semibold">${escapeHtml(nombre)}</td>
          <td class="text-muted">${escapeHtml(desc)}</td>
          <td>${estadoBadge(m.estado)}</td>
          <td class="text-end">${actionButtons(m)}</td>
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
  // Modal form
  // -----------------------
  function clearImgPreview() {
    imgPreview().src = "";
    imgPreview().style.display = "none";
    imgPlaceholder().style.display = "block";
    imgInput().value = "";
  }

  function resetForm() {
    editingId = null;
    form().dataset.removeImagen = "0";

    form().querySelectorAll(".is-invalid, .is-valid").forEach(el => {
      el.classList.remove("is-invalid", "is-valid");
    });

    form().reset();
    clearImgPreview();
  }

  function openModalCreate() {
    resetForm();
    document.getElementById("modalMarcaTitle").textContent = "Nueva Marca";
    modalForm.show();
  }

  function openModalEdit(m) {
    resetForm();
    editingId = Number(m.id_marca);
    document.getElementById("modalMarcaTitle").textContent = "Editar Marca";

    fNombre().value = m.nombre ?? "";
    fDescripcion().value = m.descripcion ?? "";

    if (m.imagen) {
      imgPreview().src = "/storage/" + m.imagen;
      imgPreview().style.display = "block";
      imgPlaceholder().style.display = "none";
    }

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

    const nombre = fNombre().value.trim();
    if (!nombre || nombre.length > 100) inval(fNombre());
    else val(fNombre());

    const desc = fDescripcion().value.trim();
    if (desc.length > 500) {
      fDescripcion().classList.add("is-invalid");
      ok = false;
    } else {
      fDescripcion().classList.remove("is-invalid");
    }

    return ok;
  }

  // -----------------------
  // API ops
  // -----------------------
  async function createFromForm() {
    const fd = new FormData();
    fd.append("nombre", fNombre().value.trim());
    fd.append("descripcion", fDescripcion().value.trim());

    const file = imgInput().files?.[0];
    if (file) fd.append("imagen", file);

    await apiFetch("/marcas", { method: "POST", body: fd, isFormData: true });
    showToast("Marca creada correctamente.", "success", 2500);
    await loadMarcas();
  }

  async function updateFromForm() {
    const id = editingId;

    const fd = new FormData();
    fd.append("_method", "PUT");
    fd.append("nombre", fNombre().value.trim());
    fd.append("descripcion", fDescripcion().value.trim());

    const file = imgInput().files?.[0];
    if (file) fd.append("imagen", file);

    if (form().dataset.removeImagen === "1") {
      fd.append("remove_imagen", "1");
    }

    await apiFetch(`/marcas/${id}`, { method: "POST", body: fd, isFormData: true });
    showToast("Marca actualizada.", "success", 2200);
    await loadMarcas();
  }

  async function toggleEstado(id, newEstado) {
    await apiFetch(`/marcas/${id}/estado`, {
      method: "PATCH",
      body: { estado: Number(newEstado) },
      isFormData: false
    });

    showToast(`Estado actualizado: ${Number(newEstado) === 1 ? "Activo" : "Inactivo"}.`, "info", 2000);
    await loadMarcas();
  }

  async function deleteMarca(id) {
    await apiFetch(`/marcas/${id}`, { method: "DELETE" });
    showToast("Marca eliminada (estado=2).", "danger", 2200);
    await loadMarcas();
  }

  // -----------------------
  // Confirm modals
  // -----------------------
  function openToggleConfirm(m) {
    const isActive = Number(m.estado) === 1;
    const newEstado = isActive ? 0 : 1;

    pendingToggleId = Number(m.id_marca);
    pendingToggleNewEstado = newEstado;

    const name = m.nombre ?? "esta marca";

    toggleTitle().textContent = isActive
      ? `¿Inactivar la marca "${name}"?`
      : `¿Activar la marca "${name}"?`;

   
    modalToggle.show();
  }

  function openDeleteConfirm(m) {
    pendingDeleteId = Number(m.id_marca);
    const name = m.nombre ?? "esta marca";
    deleteTitle().textContent = `¿Eliminar la marca "${name}"?`;
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

    const m = marcas.find(x => Number(x.id_marca) === id);
    if (!m) return;

    if (action === "edit") {
      openModalEdit(m);
      return;
    }

    if (action === "toggle") {
      openToggleConfirm(m);
      return;
    }

    if (action === "delete") {
      openDeleteConfirm(m);
      return;
    }
  }

  // -----------------------
  // Init
  // -----------------------
  window.initMarcasPage = function () {
    if (!root()) return;
    if (root().dataset.inited === "1") return;
    root().dataset.inited = "1";

    modalForm = new bootstrap.Modal(document.getElementById("modalMarca"));
    modalToggle = new bootstrap.Modal(document.getElementById("modalConfirmToggleMarca"));
    modalDelete = new bootstrap.Modal(document.getElementById("modalConfirmDeleteMarca"));

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

    imgDropArea().addEventListener("click", () => imgInput().click());

    imgInput().addEventListener("change", () => {
      const file = imgInput().files?.[0];
      if (!file) return clearImgPreview();

      const isImage = file.type.startsWith("image/");
      const maxMB = 5;

      if (!isImage || file.size > maxMB * 1024 * 1024) {
        clearImgPreview();
        showToast(`Imagen inválida. Máx ${maxMB}MB.`, "warning", 2500);
        return;
      }

      form().dataset.removeImagen = "0";

      const url = URL.createObjectURL(file);
      imgPreview().src = url;
      imgPreview().style.display = "block";
      imgPlaceholder().style.display = "none";
    });

    btnRemoveImg().addEventListener("click", () => {
      clearImgPreview();
      if (editingId !== null) {
        form().dataset.removeImagen = "1";
      }
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

    btnConfirmToggle().addEventListener("click", async () => {
      if (pendingToggleId === null) return;

      const id = pendingToggleId;
      const newEstado = pendingToggleNewEstado;

      try {
        await toggleEstado(id, newEstado);
        modalToggle.hide();
      } catch (err) {
        showToast(err.message, "danger", 2800);
      } finally {
        pendingToggleId = null;
        pendingToggleNewEstado = null;
      }
    });

    btnConfirmDelete().addEventListener("click", async () => {
      if (pendingDeleteId === null) return;

      const id = pendingDeleteId;

      try {
        await deleteMarca(id);
        modalDelete.hide();
      } catch (err) {
        showToast(err.message, "danger", 2800);
      } finally {
        pendingDeleteId = null;
      }
    });

    loadMarcas().catch((err) => {
      showToast(err.message || "No se pudo cargar marcas.", "danger", 2800);
    });
  };
})();