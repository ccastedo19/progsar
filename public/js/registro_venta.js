(() => {
  const API = "/api";
  let ventas = [];

  const state = {
    q: ""
  };

  function tbody() {
    return document.getElementById("tbodyRegistroVentas");
  }

  function searchInput() {
    return document.getElementById("searchRegistroVentas");
  }

  function filtroDesde() {
    return document.getElementById("filtroDesde");
  }

  function filtroHasta() {
    return document.getElementById("filtroHasta");
  }

  function btnFiltrar() {
    return document.getElementById("btnFiltrar");
  }

  function btnLimpiarFiltros() {
    return document.getElementById("btnLimpiarFiltros");
  }

  function money(n) {
    return `Bs ${Number(n || 0).toFixed(2)}`;
  }

  function formatDate(v) {
    if (!v) return "-";

    const d = new Date(v);
    if (Number.isNaN(d.getTime())) return "-";

    return d.toLocaleDateString("es-BO");
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

  function totalVenta(v) {
    return Number(v.facturado_estado) === 1
      ? Number(v.total_con_factura || 0)
      : Number(v.total_sin_factura || 0);
  }

  function calcGanancia(v) {
    if (!Array.isArray(v.detalles)) return 0;

    return v.detalles.reduce((acc, d) => {
      const precio = Number(d.precio_unitario || 0);
      const compra = Number(d.precio_compra || 0);
      const cant = Number(d.cantidad || 0);

      return acc + (precio - compra) * cant;
    }, 0);
  }

  async function loadVentas() {
    const token = localStorage.getItem("auth_token");

    const res = await fetch(`${API}/ventas?estado=2`, {
      headers: {
        Authorization: "Bearer " + token
      }
    });

    const data = await res.json();

    ventas = Array.isArray(data)
      ? data
      : Array.isArray(data?.data)
      ? data.data
      : [];

    for (const v of ventas) {
      const r = await fetch(`${API}/ventas/${v.id_venta}`, {
        headers: {
          Authorization: "Bearer " + token
        }
      });

      const ventaDetalle = await r.json();
      v.detalles = ventaDetalle.detalles || [];
    }

    applyFilters();
  }

  function render(list = ventas) {
    if (!list.length) {
      tbody().innerHTML = `
        <tr>
          <td colspan="6" class="text-center text-muted">
            No hay ventas registradas
          </td>
        </tr>
      `;
      return;
    }

    tbody().innerHTML = list.map(v => `
      <tr>
        <td class="fw-semibold">
          N° ${escapeHtml(v.numero ?? "-")}
        </td>

        <td>
          ${escapeHtml(formatDate(v.fecha))}
        </td>

        <td>
          ${escapeHtml(v?.cliente?.nombre_completo || "-")}
        </td>

        <td class="text-end fw-semibold">
          ${escapeHtml(money(totalVenta(v)))}
        </td>

        <td class="text-end text-success fw-semibold">
          ${escapeHtml(money(calcGanancia(v)))}
        </td>

        <td class="text-center">
          <div class="d-inline-flex gap-1">
            <button
              type="button"
              class="btn btn-sm btn-info"
              data-action="detalle"
              data-id="${v.id_venta}"
              title="Ver detalle"
            >
              <i class="bi bi-table"></i>
            </button>

            <button
              type="button"
              class="btn btn-sm btn-primary"
              data-action="pdf"
              data-id="${v.id_venta}"
              title="Ver PDF"
            >
              <i class="bi bi-eye"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join("");
  }

  function applyFilters() {
    const q = state.q.trim().toLowerCase();
    const desde = filtroDesde().value;
    const hasta = filtroHasta().value;

    let lista = [...ventas];

    if (q) {
      lista = lista.filter(v => {
        const numero = String(v.numero ?? "");
        const cliente = String(v?.cliente?.nombre_completo ?? "");

        return [numero, cliente]
          .join(" ")
          .toLowerCase()
          .includes(q);
      });
    }

    if (desde) {
      const d = new Date(desde);
      d.setHours(0, 0, 0, 0);

      lista = lista.filter(v => {
        const fecha = new Date(v.fecha);
        return fecha >= d;
      });
    }

    if (hasta) {
      const h = new Date(hasta);
      h.setHours(23, 59, 59, 999);

      lista = lista.filter(v => {
        const fecha = new Date(v.fecha);
        return fecha <= h;
      });
    }

    render(lista);
  }

  function limpiarFiltros() {
    state.q = "";
    searchInput().value = "";
    filtroDesde().value = "";
    filtroHasta().value = "";
    applyFilters();
  }

  async function verDetalleVenta(id) {
    const token = localStorage.getItem("auth_token");

    const res = await fetch(`${API}/ventas/${id}`, {
      headers: {
        Authorization: "Bearer " + token
      }
    });

    const venta = await res.json();

    const tbodyDetalle = document.getElementById("tbodyDetalleVenta");

    let totalVentaDetalle = 0;
    let totalGanancia = 0;

    tbodyDetalle.innerHTML = (venta.detalles || []).map(d => {
      const precio = Number(d.precio_unitario || 0);
      const compra = Number(d.precio_compra || 0);
      const cant = Number(d.cantidad || 0);

      const total = precio * cant;
      const ganancia = (precio - compra) * cant;

      totalVentaDetalle += total;
      totalGanancia += ganancia;

      return `
        <tr>
          <td>${escapeHtml(d.nombre_producto || "-")}</td>
          <td class="text-end">${escapeHtml(money(precio))}</td>
          <td class="text-end">${escapeHtml(money(compra))}</td>
          <td class="text-center">${escapeHtml(cant)}</td>
          <td class="text-end">${escapeHtml(money(total))}</td>
          <td class="text-end text-success fw-semibold">
            ${escapeHtml(money(ganancia))}
          </td>
        </tr>
      `;
    }).join("");

    document.getElementById("totalVentaDetalle").textContent = money(totalVentaDetalle);
    document.getElementById("totalGananciaDetalle").textContent = money(totalGanancia);

    new bootstrap.Modal(
      document.getElementById("modalDetalleVenta")
    ).show();
  }

  async function verPdfVenta(id) {
    const token = localStorage.getItem("auth_token");

    const res = await fetch(`${API}/ventas/${id}`, {
      headers: {
        Authorization: "Bearer " + token
      }
    });

    const data = await res.json();

    if (!data) return;

    const pdfData = {
      numero: data.numero,
      fecha: data.fecha,
      clienteText: data?.cliente?.nombre_completo || "",
      factState: Number(data.facturado_estado) === 1 ? "si" : "no",
      pct: Number(data.porcentaje_factura || 0),
      delivery: Number(data.delivery || 0),
      empresa: {
        nombre: "Progsar Maquinarias",
        direccion: "Av. Tomas de lezo, 3er anillo externo C/Viador Moreno Peña",
        telefono: "62051817 / 74468939"
      },
      items: (data.detalles || []).map(d => ({
        codigo: d.codigo,
        descripcion: d.nombre_producto,
        fichas_tecnicas: d.fichas_tecnicas || [],
        cantidad: d.cantidad,
        precioU: d.precio_unitario,
        descuento: 0,
        totalLinea: d.total_producto
      }))
    };

    window.VentaPDF.open(pdfData);
  }

  document.addEventListener("click", e => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;

    const id = btn.dataset.id;

    if (btn.dataset.action === "detalle") {
      verDetalleVenta(id);
    }

    if (btn.dataset.action === "pdf") {
      verPdfVenta(id);
    }
  });

  window.initRegistroVentaPage = function () {
    const search = searchInput();
    const btn = btnFiltrar();
    const btnLimpiar = btnLimpiarFiltros();

    if (search) {
      search.addEventListener("input", () => {
        state.q = search.value;
        applyFilters();
      });
    }

    if (btn) {
      btn.addEventListener("click", applyFilters);
    }

    if (btnLimpiar) {
      btnLimpiar.addEventListener("click", limpiarFiltros);
    }

    loadVentas();
  };
})();