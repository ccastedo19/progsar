(() => {
  const API = "/api";

  let ventas = [];

  const state = {
    q: ""
  };

  function tbody() {
    return document.getElementById("tbodyVentasAnuladas");
  }

  function searchInput() {
    return document.getElementById("searchVentasAnuladas");
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

  function formatDate(value) {
    if (!value) return "-";

    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "-";

    return d.toLocaleDateString("es-BO");
  }

  function totalVenta(v) {
    return Number(v.facturado_estado) === 1
      ? Number(v.total_con_factura || 0)
      : Number(v.total_sin_factura || 0);
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

  async function verVenta(id) {
    const token = localStorage.getItem("auth_token");

    const res = await fetch(`/api/ventas/${id}`, {
      headers: {
        "Accept": "application/json",
        "Authorization": "Bearer " + token
      }
    });

    if (!res.ok) {
      console.error("Error obteniendo venta", res.status);
      return;
    }

    const data = await res.json();

    if (!data || !data.detalles) {
      console.error("Venta sin detalles");
      return;
    }

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
      items: data.detalles.map(d => ({
        codigo: d.codigo,
        descripcion: d.nombre_producto,
        fichas_tecnicas: d.fichas_tecnicas,
        cantidad: d.cantidad,
        precioU: d.precio_unitario,
        descuento: d.descuento,
        totalLinea: d.total_producto
      }))
    };

    window.VentaPDF.open(pdfData);
  }

  document.addEventListener("click", function (e) {
    const btn = e.target.closest("button[data-action='view']");
    if (!btn) return;

    const id = Number(btn.getAttribute("data-id"));
    verVenta(id);
  });

  async function loadVentas() {
    const token = localStorage.getItem("auth_token");

    const res = await fetch(`${API}/ventas?estado=0`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Authorization": "Bearer " + token
      }
    });

    if (!res.ok) {
      console.error("Error cargando ventas anuladas", res.status);
      return;
    }

    const data = await res.json();

    ventas = Array.isArray(data)
      ? data
      : Array.isArray(data?.data)
      ? data.data
      : [];

    applyFilters();
  }

  function render(list = ventas) {
    if (!list.length) {
      tbody().innerHTML = `
        <tr>
          <td colspan="8" class="text-center text-muted">
            No hay ventas anuladas
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

        <td>
          ${escapeHtml(Number(v.facturado_estado) ? "Con factura" : "Sin factura")}
        </td>

        <td>
          ${escapeHtml(v.motivo_anulacion || "-")}
        </td>

        <td>
          ${escapeHtml(formatDate(v.fecha_anulacion))}
        </td>

        <td class="text-end fw-semibold">
          ${escapeHtml(money(totalVenta(v)))}
        </td>

        <td class="text-center">
          <button
            class="btn btn-sm btn-primary"
            data-action="view"
            data-id="${v.id_venta}"
            title="Ver venta"
          >
            <i class="bi bi-eye"></i>
          </button>
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
        const motivo = String(v.motivo_anulacion ?? "");

        return [numero, cliente, motivo]
          .join(" ")
          .toLowerCase()
          .includes(q);
      });
    }

    if (desde) {
      const d = new Date(desde);
      d.setHours(0, 0, 0, 0);

      lista = lista.filter(v => {
        const fecha = new Date(v.fecha_anulacion || v.fecha);
        return fecha >= d;
      });
    }

    if (hasta) {
      const h = new Date(hasta);
      h.setHours(23, 59, 59, 999);

      lista = lista.filter(v => {
        const fecha = new Date(v.fecha_anulacion || v.fecha);
        return fecha <= h;
      });
    }

    render(lista);
  }

  function limpiarFiltros() {
    state.q = "";

    if (searchInput()) searchInput().value = "";
    if (filtroDesde()) filtroDesde().value = "";
    if (filtroHasta()) filtroHasta().value = "";

    render(ventas);
  }

  window.initVentasAnuladasPage = function () {
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