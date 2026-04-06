(() => {
  // -----------------------
  // Config
  // -----------------------
  const API_BASE = "/api";
  const TOKEN_KEY = "auth_token";
  const USER_KEY  = "auth_user";

  // Roles reales
  const ROLE_LABEL_BY_ID = {
    1: "SuperAdmin",
    2: "Administrador",
    3: "Vendedor",
  };

  // -----------------------
  // DOM helpers
  // -----------------------
  const root = () => document.getElementById("usuarios-page");
  const tbody = () => document.getElementById("usuariosTbody");
  const info = () => document.getElementById("usuariosInfo");
  const pagination = () => document.getElementById("usuariosPagination");
  const searchInput = () => document.getElementById("usuariosSearch");
  const pageSizeSel = () => document.getElementById("usuariosPageSize");

  // Modal/form
  let modal;
  const form = () => document.getElementById("formUsuario");
  const btnNuevo = () => document.getElementById("btnNuevoUsuario");

  // Imagen
  const imgDropArea = () => document.getElementById("imgDropArea");
  const imgInput = () => document.getElementById("usuarioImg");
  const imgPreview = () => document.getElementById("usuarioImgPreview");
  const imgPlaceholder = () => document.getElementById("usuarioImgPlaceholder");
  const btnRemoveImg = () => document.getElementById("btnRemoveImg");

  // Campos
  const fNombre = () => document.getElementById("nombre");
  const fApellido = () => document.getElementById("apellido");
  const fEmail = () => document.getElementById("email");
  const fUsername = () => document.getElementById("username");
  const fTelefono = () => document.getElementById("telefono");
  const fRol = () => document.getElementById("rol"); // id_rol
  const fPass = () => document.getElementById("password");
  const fPass2 = () => document.getElementById("password2");

  // -----------------------
  // State
  // -----------------------
  let state = {
    q: "",
    page: 1,
    pageSize: 10, // number or "all"
  };

  let users = [];
  let editingId = null;

  // -----------------------
  // Auth session helpers
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
    return Number(u?.id_usuario || 0);
  }

  function sessionUserRole() {
    const u = getSessionUser();
    return Number(u?.id_rol || 0);
  }

  function isSessionSuperAdmin() {
    return sessionUserRole() === 1;
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
    return String(str).replace(/[&<>"']/g, (m) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    }[m]));
  }

  function onlyDigits(v) {
    return v.replace(/\D/g, "");
  }

  function isEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  function estadoLabel(estado) {
    if (Number(estado) === 1) return "Activo";
    if (Number(estado) === 2) return "Inactivo";
    return "Eliminado";
  }

  function estadoBadge(estado) {
    const e = Number(estado);
    if (e === 1) return `<span class="badge text-bg-success">Activo</span>`;
    if (e === 2) return `<span class="badge text-bg-warning">Inactivo</span>`;
    return `<span class="badge text-bg-secondary">Eliminado</span>`;
  }

  function roleBadgeById(idRol) {
    const label = ROLE_LABEL_BY_ID[Number(idRol)] || `Rol ${idRol}`;
    if (label === "SuperAdmin") return `<span class="badge text-bg-dark">SuperAdmin</span>`;
    if (label === "Administrador") return `<span class="badge text-bg-primary">Administrador</span>`;
    if (label === "Vendedor") return `<span class="badge text-bg-secondary">Vendedor</span>`;
    return `<span class="badge text-bg-dark">${escapeHtml(label)}</span>`;
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
  // Guards de UI (tus reglas)
  // -----------------------
  function isSuperAdminUser(u) {
    return Number(u?.id_rol) === 1;
  }

  function isSelfUser(u) {
    return Number(u?.id_usuario) === sessionUserId();
  }

  function canEditUser(u) {
    // SuperAdmin (id_rol=1):
    // - Solo se puede editar a sí mismo
    if (isSuperAdminUser(u)) {
      return isSessionSuperAdmin() && isSelfUser(u);
    }
    // Cualquier otro: se permite editar
    return true;
  }

  function canToggleUser(u) {
    // no permitir toggle a SuperAdmin nunca
    if (isSuperAdminUser(u)) return false;
    // opcional: podrías impedir toggle a sí mismo, pero NO lo pediste
    return true;
  }

  function canDeleteUser(u) {
    // No se puede borrar al SuperAdmin nunca
    if (isSuperAdminUser(u)) return false;
    // El logueado no puede eliminarse
    if (isSelfUser(u)) return false;
    return true;
  }

  function canCreateUsers() {
    // Si quieres restringir "Nuevo Usuario" a Admin/SuperAdmin, descomenta:
    // return sessionUserRole() === 1 || sessionUserRole() === 2;
    return true;
  }

  function applyRoleLockIfNeeded(editingUser) {
    // Si estoy editando y el usuario editado es SuperAdmin => bloquear rol
    if (editingUser && isSuperAdminUser(editingUser)) {
      fRol().disabled = true;
    } else {
      fRol().disabled = false;
    }
  }

  // -----------------------
  // API helper (JSON + FormData)
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
  // Load data
  // -----------------------
  async function loadUsers() {
    const data = await apiFetch("/usuarios", { method: "GET" });
    users = Array.isArray(data) ? data : [];
    render();
  }

  // -----------------------
  // Filtering + paging
  // -----------------------
  function filteredUsers() {
    const q = state.q.trim().toLowerCase();
    if (!q) return [...users];

    return users.filter(u => {
      const fullName = `${u.nombre ?? ""} ${u.apellido ?? ""}`.trim();
      const roleLabel = ROLE_LABEL_BY_ID[Number(u.id_rol)] || `${u.id_rol}`;
      const hay = [
        fullName,
        u.email ?? "",
        u.username ?? "",
        u.telefono ?? "",
        roleLabel,
        estadoLabel(u.estado),
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
  function actionButtons(u) {
    const canEdit = canEditUser(u);
    const canToggle = canToggleUser(u);
    const canDel = canDeleteUser(u);

    // Si no puede nada, mostramos "No editable"
    if (!canEdit && !canToggle && !canDel) {
      return `<div class="text-end text-muted small">Restringido</div>`;
    }

    const isActive = Number(u.estado) === 1;
    const toggleIcon = isActive ? "bi-slash-circle" : "bi-check-circle";
    const toggleTitle = isActive ? "Desactivar usuario" : "Activar usuario";

    return `
      <div class="d-flex justify-content-end gap-2">
        <button type="button"
                class="btn btn-sm btn-primary ${canEdit ? "" : "disabled"}"
                data-action="edit"
                data-id="${u.id_usuario}"
                title="${canEdit ? "Editar usuario" : "No permitido"}">
          <i class="bi bi-pencil-square"></i>
        </button>

        <button type="button"
                class="btn btn-sm btn-warning ${canToggle ? "" : "disabled"}"
                data-action="toggle"
                data-id="${u.id_usuario}"
                title="${canToggle ? toggleTitle : "No permitido"}">
          <i class="bi ${toggleIcon}"></i>
        </button>

        <button type="button"
                class="btn btn-sm btn-danger ${canDel ? "" : "disabled"}"
                data-action="delete"
                data-id="${u.id_usuario}"
                title="${canDel ? "Eliminar usuario (estado=3)" : "No permitido"}">
          <i class="bi bi-trash"></i>
        </button>
      </div>
    `;
  }

  function render() {
    // Nuevo usuario: si quieres deshabilitar por rol:
    if (btnNuevo()) {
      btnNuevo().disabled = !canCreateUsers();
    }

    const list = filteredUsers();
    const { slice, totalPages, page } = paged(list);
    state.page = page;

    const total = list.length;
    if (state.pageSize === "all") {
      info().textContent = `Mostrando ${total} de ${total} usuarios`;
    } else {
      const size = Number(state.pageSize);
      const from = total === 0 ? 0 : (page - 1) * size + 1;
      const to = Math.min(total, page * size);
      info().textContent = `Mostrando ${from}-${to} de ${total} usuarios`;
    }

    tbody().innerHTML = slice.map((u, idx) => {
      const n = state.pageSize === "all"
        ? (idx + 1)
        : ((page - 1) * Number(state.pageSize) + idx + 1);

      const fullName = `${u.nombre ?? ""} ${u.apellido ?? ""}`.trim() || "(Sin nombre)";
      const phone = u.telefono ?? "";

      const avatarUrl = u.imagen
        ? ("/storage/" + u.imagen)
        : "https://i.pravatar.cc/80?img=8";

      const userTag = u.username || "usuario";

      return `
        <tr>
          <td>${n}</td>
          <td>
            <div class="d-flex align-items-center gap-2">
              <img src="${escapeHtml(avatarUrl)}"
                   class="rounded-circle border" style="width:38px;height:38px;object-fit:cover;" alt="avatar">
              <div>
                <div class="fw-semibold">${escapeHtml(fullName)}</div>
                <div class="text-muted small">@${escapeHtml(userTag)}</div>
              </div>
            </div>
          </td>
          <td>${escapeHtml(u.email ?? "")}</td>
          <td>${escapeHtml(phone)}</td>
          <td>${roleBadgeById(u.id_rol)}</td>
          <td>${estadoBadge(u.estado)}</td>
          <td class="text-end">${actionButtons(u)}</td>
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
        if (!Number.isFinite(p)) return;
        if (p < 1) return;
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
    form().dataset.removeImagen = "0";

    form().querySelectorAll(".is-invalid, .is-valid").forEach(el => {
      el.classList.remove("is-invalid", "is-valid");
    });

    form().reset();

    imgPreview().style.display = "none";
    imgPreview().src = "";
    imgPlaceholder().style.display = "block";
    imgInput().value = "";

    fPass().placeholder = "Mín. 6 caracteres";
    fPass2().placeholder = "Repite la contraseña";

    // por defecto rol habilitado
    fRol().disabled = false;
  }

  function openModalCreate() {
    resetForm();
    document.getElementById("modalUsuarioTitle").textContent = "Nuevo Usuario";
    modal.show();
  }

  function openModalEdit(u) {
    // reglas: si no puede editar, ni abrir modal
    if (!canEditUser(u)) {
      showToast("No tienes permiso para editar este usuario.", "warning", 2500);
      return;
    }

    resetForm();
    editingId = Number(u.id_usuario);
    document.getElementById("modalUsuarioTitle").textContent = "Editar Usuario";

    fNombre().value = u.nombre ?? "";
    fApellido().value = u.apellido ?? "";
    fEmail().value = u.email ?? "";
    fUsername().value = u.username ?? "";
    fTelefono().value = u.telefono ?? "";
    fRol().value = String(u.id_rol ?? "");

    // bloquear rol si es SuperAdmin (cuando edita su perfil)
    applyRoleLockIfNeeded(u);

    if (u.imagen) {
      imgPreview().src = "/storage/" + u.imagen;
      imgPreview().style.display = "block";
      imgPlaceholder().style.display = "none";
    }

    fPass().value = "";
    fPass2().value = "";
    fPass().placeholder = "Dejar vacío para no cambiar";
    fPass2().placeholder = "Dejar vacío para no cambiar";

    modal.show();
  }

  function clearImgPreview() {
    imgPreview().src = "";
    imgPreview().style.display = "none";
    imgPlaceholder().style.display = "block";
    imgInput().value = "";
  }

  function validateForm() {
    let ok = true;

    const nombre = fNombre().value.trim();
    const apellido = fApellido().value.trim();
    const email = fEmail().value.trim();
    const username = fUsername().value.trim();
    const telefono = onlyDigits(fTelefono().value.trim());
    const rol = fRol().value.trim();

    const pass = fPass().value;
    const pass2 = fPass2().value;

    const inval = (el) => { el.classList.add("is-invalid"); el.classList.remove("is-valid"); ok = false; };
    const val = (el) => { el.classList.remove("is-invalid"); el.classList.add("is-valid"); };

    if (!nombre) inval(fNombre()); else val(fNombre());
    if (!apellido) inval(fApellido()); else val(fApellido());
    if (!email || !isEmail(email)) inval(fEmail()); else val(fEmail());
    if (!username || username.length < 3) inval(fUsername()); else val(fUsername());

    if (telefono && telefono.length < 7) {
      inval(fTelefono());
    } else {
      fTelefono().value = telefono;
      val(fTelefono());
    }

    // Si rol está disabled (SuperAdmin editándose), no validar como requerido
    if (!fRol().disabled) {
      if (!rol) inval(fRol()); else val(fRol());
    } else {
      fRol().classList.remove("is-invalid");
    }

    if (editingId === null) {
      if (!pass || pass.length < 6) inval(fPass()); else val(fPass());
      if (!pass2 || pass2 !== pass) inval(fPass2()); else val(fPass2());
    } else {
      if (pass) {
        if (pass.length < 6) inval(fPass()); else val(fPass());
        if (!pass2 || pass2 !== pass) inval(fPass2()); else val(fPass2());
      } else {
        fPass().classList.remove("is-invalid");
        fPass2().classList.remove("is-invalid");
      }
    }

    return ok;
  }

  // -----------------------
  // API operations (FormData)
  // -----------------------
  async function createUserFromForm() {
    const fd = new FormData();
    fd.append("nombre", fNombre().value.trim());
    fd.append("apellido", fApellido().value.trim());
    fd.append("email", fEmail().value.trim());
    fd.append("username", fUsername().value.trim());
    fd.append("telefono", fTelefono().value.trim() || "");
    fd.append("id_rol", String(Number(fRol().value)));
    fd.append("password", fPass().value);

    const file = imgInput().files?.[0];
    if (file) fd.append("imagen", file);

    await apiFetch("/usuarios", { method: "POST", body: fd, isFormData: true });
    showToast("Usuario creado correctamente.", "success", 2500);
    await loadUsers();
  }

  async function updateUserFromForm() {
    const id = editingId;

    // regla: el usuario logueado no puede editar si no tiene permiso (doble check)
    const u = users.find(x => Number(x.id_usuario) === Number(id));
    if (u && !canEditUser(u)) {
      throw new Error("No tienes permiso para editar este usuario.");
    }

    const fd = new FormData();
    fd.append("_method", "PUT");
    fd.append("nombre", fNombre().value.trim());
    fd.append("apellido", fApellido().value.trim());
    fd.append("email", fEmail().value.trim());
    fd.append("username", fUsername().value.trim());
    fd.append("telefono", fTelefono().value.trim() || "");

    // Solo enviar id_rol si el select NO está bloqueado
    if (!fRol().disabled) {
      fd.append("id_rol", String(Number(fRol().value)));
    }

    const pass = fPass().value;
    if (pass) fd.append("password", pass);

    const file = imgInput().files?.[0];
    if (file) fd.append("imagen", file);

    if (form().dataset.removeImagen === "1") {
      fd.append("remove_imagen", "1");
    }

    await apiFetch(`/usuarios/${id}`, { method: "POST", body: fd, isFormData: true });
    showToast("Usuario actualizado.", "success", 2200);

    // Si el usuario editado es el mismo logueado, actualiza auth_user (nombre/apellido/rol/username/email/telefono)
    if (u && isSelfUser(u)) {
      const current = getSessionUser();
      const merged = {
        ...current,
        nombre: fNombre().value.trim(),
        apellido: fApellido().value.trim(),
        email: fEmail().value.trim(),
        username: fUsername().value.trim(),
        telefono: fTelefono().value.trim(),
        // id_rol solo si no estaba bloqueado
        ...(fRol().disabled ? {} : { id_rol: Number(fRol().value) }),
      };
      localStorage.setItem(USER_KEY, JSON.stringify(merged));
    }

    await loadUsers();
  }

  async function toggleEstado(id) {
    const u = users.find(x => Number(x.id_usuario) === Number(id));
    if (!u) return;

    if (!canToggleUser(u)) {
      throw new Error("No está permitido cambiar el estado de este usuario.");
    }

    const newEstado = Number(u.estado) === 1 ? 2 : 1;

    await apiFetch(`/usuarios/${id}/estado`, {
      method: "PATCH",
      body: { estado: newEstado },
      isFormData: false
    });

    showToast(`Estado actualizado: ${newEstado === 1 ? "Activo" : "Inactivo"}.`, "info", 2000);
    await loadUsers();
  }

  async function deleteLogico(id) {
    const u = users.find(x => Number(x.id_usuario) === Number(id));
    if (!u) return;

    if (!canDeleteUser(u)) {
      throw new Error("No está permitido eliminar este usuario.");
    }

    await apiFetch(`/usuarios/${id}`, { method: "DELETE" });
    showToast("Usuario marcado como eliminado (estado=3).", "danger", 2200);
    await loadUsers();
  }

  // -----------------------
  // Table actions
  // -----------------------
  async function onTableClick(e) {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;

    // si está disabled, no hacer nada
    if (btn.classList.contains("disabled") || btn.disabled) return;

    const id = Number(btn.getAttribute("data-id"));
    const action = btn.getAttribute("data-action");

    if (action === "toggle") {
      try { await toggleEstado(id); } catch (err) { showToast(err.message, "danger", 2600); }
      return;
    }

    if (action === "delete") {
      const u = users.find(x => Number(x.id_usuario) === id);
      const fullName = u ? `${u.nombre ?? ""} ${u.apellido ?? ""}`.trim() : "este usuario";
      if (!confirm(`¿Eliminar a ${fullName}? (estado=3)`)) return;

      try { await deleteLogico(id); } catch (err) { showToast(err.message, "danger", 2600); }
      return;
    }

    if (action === "edit") {
      const u = users.find(x => Number(x.id_usuario) === id);
      if (!u) return;
      openModalEdit(u);
      return;
    }
  }

  // -----------------------
  // Init (SPA-safe)
  // -----------------------
  window.initUsuariosPage = function () {
    if (!root()) return;

    if (root().dataset.inited === "1") return;
    root().dataset.inited = "1";

    modal = new bootstrap.Modal(document.getElementById("modalUsuario"));

    btnNuevo().addEventListener("click", () => {
      if (!canCreateUsers()) {
        showToast("No tienes permiso para crear usuarios.", "warning", 2500);
        return;
      }
      openModalCreate();
    });

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

    // Imagen preview
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

    // Submit
    form().addEventListener("submit", async (ev) => {
      ev.preventDefault();
      ev.stopPropagation();

      if (!validateForm()) {
        showToast("Revisa los campos marcados en rojo.", "warning", 2500);
        return;
      }

      try {
        if (editingId === null) {
          await createUserFromForm();
        } else {
          await updateUserFromForm();
        }
        modal.hide();
      } catch (err) {
        showToast(err.message, "danger", 2800);
      }
    });

    loadUsers().catch((err) => {
      showToast(err.message || "No se pudo cargar usuarios.", "danger", 2800);
    });
  };
})();
