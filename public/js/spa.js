(() => {
  const APP_ID = "spa-app";

  function appEl() {
    const el = document.getElementById(APP_ID);
    if (!el) throw new Error(`No existe #${APP_ID} en el layout`);
    return el;
  }

  function sameOrigin(url) {
    try {
      const u = new URL(url, window.location.origin);
      return u.origin === window.location.origin;
    } catch {
      return false;
    }
  }

  function isModifiedClick(e) {
    return e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0;
  }

  function setActiveNav(pathname) {
    const links = document.querySelectorAll("a[data-spa]");
    links.forEach(a => a.classList.remove("active"));

    links.forEach(a => {
      try {
        const u = new URL(a.getAttribute("href"), window.location.origin);
        if (u.pathname === pathname) a.classList.add("active");
      } catch {}
    });
  }

  // -----------------------------
  // Loader de estilos
  // -----------------------------
  const _loadedStyles = new Map();

  function loadStyleOnce(href) {
    if (_loadedStyles.has(href)) return _loadedStyles.get(href);

    const already = document.querySelector(`link[href="${href}"]`);
    if (already) {
      const p = Promise.resolve(true);
      _loadedStyles.set(href, p);
      return p;
    }

    const p = new Promise((resolve, reject) => {
      const l = document.createElement("link");
      l.rel = "stylesheet";
      l.href = href;
      l.onload = () => resolve(true);
      l.onerror = () => reject(new Error(`No se pudo cargar: ${href}`));
      document.head.appendChild(l);
    });

    _loadedStyles.set(href, p);
    return p;
  }

  // -----------------------------
  // Loader de scripts
  // -----------------------------
  const _loadedScripts = new Map();

  function loadScriptOnce(src) {
    if (_loadedScripts.has(src)) return _loadedScripts.get(src);

    const already = document.querySelector(`script[src="${src}"]`);
    if (already) {
      const p = Promise.resolve(true);
      _loadedScripts.set(src, p);
      return p;
    }

    const p = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = src;
      s.onload = () => resolve(true);
      s.onerror = () => reject(new Error(`No se pudo cargar: ${src}`));
      document.head.appendChild(s);
    });

    _loadedScripts.set(src, p);
    return p;
  }

  async function ensureSelect2Assets() {
    await loadStyleOnce("https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css");
    await loadScriptOnce("https://code.jquery.com/jquery-3.7.1.min.js");
    await loadScriptOnce("https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js");
  }

  async function ensureDashboardScripts() {
    await loadScriptOnce("https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js");
    await loadScriptOnce("https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.2.0");
    await loadScriptOnce("/js/charts.js");
  }

  async function afterRenderByRoute(pathname) {
    if (pathname === "/dashboard") {
      await ensureDashboardScripts();
      if (typeof window.initDashboardCharts === "function") {
        window.initDashboardCharts();
      } else {
        console.warn("Falta window.initDashboardCharts().");
      }
    }

    if (pathname === "/usuarios") {
      await loadScriptOnce("/js/usuarios.js");
      if (typeof window.initUsuariosPage === "function") {
        window.initUsuariosPage();
      } else {
        console.warn("Falta window.initUsuariosPage()");
      }
    }

    if (pathname === "/clientes") {
      await loadScriptOnce("/js/clientes.js");
      if (typeof window.initClientesPage === "function") {
        window.initClientesPage();
      } else {
        console.warn("Falta window.initClientesPage()");
      }
    }

    if (pathname === "/categorias") {
      await loadScriptOnce("/js/categorias.js");
      if (typeof window.initCategoriasPage === "function") {
        window.initCategoriasPage();
      } else {
        console.warn("Falta window.initCategoriasPage()");
      }
    }

    if (pathname === "/marcas") {
      await loadScriptOnce("/js/marcas.js");
      if (typeof window.initMarcasPage === "function") {
        window.initMarcasPage();
      } else {
        console.warn("Falta window.initMarcasPage()");
      }
    }

    if (pathname === "/proveedores") {
      await loadScriptOnce("/js/proveedores.js");
      if (typeof window.initProveedoresPage === "function") {
        window.initProveedoresPage();
      } else {
        console.warn("Falta window.initProveedoresPage()");
      }
    }

   if (pathname === "/cotizaciones") {
      await loadScriptOnce("https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js");
      await loadScriptOnce("https://cdn.jsdelivr.net/npm/jspdf-autotable@3.5.31/dist/jspdf.plugin.autotable.min.js");
      await loadScriptOnce("/js/cotizacion_pdf.js");
      await loadScriptOnce("/js/cotizaciones.js");

      if (typeof window.initCotizacionesPage === "function") {
        await window.initCotizacionesPage();
      } else {
        console.warn("Falta window.initCotizacionesPage()");
      }
    }

    if (pathname === "/generar_cotizacion") {
      await ensureSelect2Assets();
      await loadScriptOnce("https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js");
      await loadScriptOnce("https://cdn.jsdelivr.net/npm/jspdf-autotable@3.5.31/dist/jspdf.plugin.autotable.min.js");
      await loadScriptOnce("/js/cotizacion_pdf.js");
      await loadScriptOnce("/js/generar_cotizacion.js");

      if (typeof window.initGenerarCotizacionPage === "function") {
        await window.initGenerarCotizacionPage();
      } else {
        console.warn("Falta window.initGenerarCotizacionPage()");
      }
    }

    if (pathname === "/generar_venta") {
      await ensureSelect2Assets();
      await loadScriptOnce("https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js");
      await loadScriptOnce("https://cdn.jsdelivr.net/npm/jspdf-autotable@3.5.31/dist/jspdf.plugin.autotable.min.js");
      await loadScriptOnce("/js/venta_pdf.js");
      await loadScriptOnce("/js/generar_venta.js");

      if (typeof window.initGenerarVentaPage === "function") {
        await window.initGenerarVentaPage();
      } else {
        console.warn("Falta window.initGenerarVentaPage()");
      }
    }

    if (pathname === "/pre_registro_venta") {
      await loadScriptOnce("https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js");
      await loadScriptOnce("https://cdn.jsdelivr.net/npm/jspdf-autotable@3.5.31/dist/jspdf.plugin.autotable.min.js");
      await loadScriptOnce("/js/venta_pdf.js");
      await loadScriptOnce("/js/pre_registro_venta.js");

      if (typeof window.initPreRegistroVentaPage === "function") {
        await window.initPreRegistroVentaPage();
      } else {
        console.warn("Falta window.initPreRegistroVentaPage()");
      }
    }

    if (pathname === "/ventas_anuladas") {

      await loadScriptOnce("https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js");
      await loadScriptOnce("https://cdn.jsdelivr.net/npm/jspdf-autotable@3.5.31/dist/jspdf.plugin.autotable.min.js");
      await loadScriptOnce("/js/venta_pdf.js");
      await loadScriptOnce("/js/ventas_anuladas.js");

      if (typeof window.initVentasAnuladasPage === "function") {
        await window.initVentasAnuladasPage();
      } else {
        console.warn("Falta window.initVentasAnuladasPage()");
      }
    }

    if (pathname === "/registro_venta") {
      await loadScriptOnce("https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js");
      await loadScriptOnce("https://cdn.jsdelivr.net/npm/jspdf-autotable@3.5.31/dist/jspdf.plugin.autotable.min.js");

      await loadScriptOnce("/js/venta_pdf.js");
      await loadScriptOnce("/js/registro_venta.js");

      if (typeof window.initRegistroVentaPage === "function") {
        await window.initRegistroVentaPage();
      } else {
        console.warn("Falta window.initRegistroVentaPage()");
      }

    }
    
    if (pathname === "/productos") {
      await loadStyleOnce("https://cdn.jsdelivr.net/npm/quill@1.3.7/dist/quill.snow.css")
      await loadScriptOnce("https://cdn.jsdelivr.net/npm/quill@1.3.7/dist/quill.min.js");
      await ensureSelect2Assets();
      await loadScriptOnce("/js/productos.js");

      if (typeof window.initProductosPage === "function") {
        await window.initProductosPage();
      } else {
        console.warn("Falta window.initProductosPage()");
      }
    }
  }

  async function navigate(url, { push = true, force = false } = {}) {
    if (!sameOrigin(url)) {
      window.location.href = url;
      return;
    }

    const target = new URL(url, window.location.origin);

    if (!force && target.pathname === window.location.pathname && target.search === window.location.search) {
      if (target.hash) window.location.hash = target.hash;
      return;
    }

    const token = localStorage.getItem("auth_token");
    if (!token) {
      window.location.replace("/login");
      return;
    }

    const res = await fetch("/spa" + target.pathname + target.search, {
      method: "GET",
      headers: {
        "X-SPA": "1",
        "X-Requested-With": "XMLHttpRequest",
        "Accept": "text/html",
        "Authorization": "Bearer " + token,
      },
      credentials: "same-origin",
    });

    if (res.status === 401 || res.status === 419) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      window.location.replace("/login");
      return;
    }

    if (!res.ok) {
      window.location.href = target.toString();
      return;
    }

    const html = await res.text();
    appEl().innerHTML = html;

    if (push) {
      window.history.pushState({ spa: true }, "", target.pathname + target.search + target.hash);
    }

    setActiveNav(target.pathname);

    if (typeof window.onSpaRendered === "function") {
      try { window.onSpaRendered(target.pathname); } catch {}
    }

    await afterRenderByRoute(target.pathname);
  }

  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[data-spa]");
    if (!a) return;

    const href = a.getAttribute("href") || "";
    if (!href || href === "#") return;
    if (isModifiedClick(e)) return;
    if (a.target && a.target !== "_self") return;

    e.preventDefault();

    navigate(href, { push: true }).catch(() => {
      window.location.href = href;
    });
  });

  window.addEventListener("popstate", () => {
    navigate(window.location.href, { push: false, force: true }).catch(() => {
      window.location.reload();
    });
  });

  document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      window.location.replace("/login");
      return;
    }

    setActiveNav(window.location.pathname);

    navigate(window.location.href, { push: false, force: true }).catch(() => {
      window.location.reload();
    });
  });

  document.addEventListener("click", async (e) => {
    const btn = e.target.closest("#btn-logout");
    if (!btn) return;

    e.preventDefault();

    const token = localStorage.getItem("auth_token");
    if (!token) {
      window.location.replace("/login");
      return;
    }

    try {
      await fetch("/api/logout", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Authorization": "Bearer " + token,
        },
      });
    } finally {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      window.location.replace("/login");
    }
  });
})();