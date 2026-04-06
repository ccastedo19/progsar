(() => {
  "use strict";

  let modal = null;
  let currentDoc = null;
  let currentBlobUrl = null;

  function money(n, moneda = "Bs") {
    const x = Number(n || 0);
    return `${moneda} ${x.toFixed(2)}`;
  }

  function onlyClientName(clienteText) {
    if (!clienteText) return "";
    return String(clienteText).split(" - ")[0].trim();
  }

  function formatVigencia(fromDate, toDate) {
    if (!fromDate || !toDate) return "";

    const a = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
    const b = new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate());

    const diffMs = b.getTime() - a.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    return `${Math.max(0, diffDays)} ${Math.max(0, diffDays) === 1 ? "día" : "días"}`;
  }

  function buildDescripcionProducto(item) {
    const nombre = String(item?.descripcion || "").trim();
    const fichas = Array.isArray(item?.fichas_tecnicas) ? item.fichas_tecnicas : [];

    const lineas = [];

    if (nombre) {
      lineas.push(nombre);
    }

    fichas.forEach(f => {
      const caracteristica = String(f?.caracteristica || "").trim();
      const especificacion = String(f?.especificacion || "").trim();

      if (caracteristica || especificacion) {
        lineas.push(`${caracteristica}: ${especificacion}`);
      }
    });

    return lineas.join("\n");
  }

  function calcTotals(data) {
    const subtotal = (data.items || []).reduce((acc, it) => acc + Number(it.totalLinea || 0), 0);
    const delivery = Number(data.delivery || 0);
    const factState = data.factState || "no";
    const pct = (factState === "si" || factState === "ambos") ? Math.max(0, Number(data.pct || 0)) : 0;

    const totalSinFactura = subtotal + delivery;
    const totalConFactura = subtotal + (subtotal * pct / 100) + delivery;

    return {
      subtotal,
      delivery,
      pct,
      totalSinFactura,
      totalConFactura,
      factState
    };
  }

  function revokeBlob() {
    if (currentBlobUrl) {
      URL.revokeObjectURL(currentBlobUrl);
      currentBlobUrl = null;
    }
  }

  function ensureModal() {
    const el = document.getElementById("modalPdfCotizacion");
    if (!el) {
      console.error("No existe #modalPdfCotizacion");
      return null;
    }

    if (!modal) {
      modal = new bootstrap.Modal(el);
    }

    if (!el.dataset.bound) {
      el.dataset.bound = "1";

      document.getElementById("btnPdfDescargar")?.addEventListener("click", () => {
        if (!currentDoc) return;
        currentDoc.save(`cotizacion-${Date.now()}.pdf`);
      });

      document.getElementById("btnPdfImprimir")?.addEventListener("click", () => {
        if (!currentBlobUrl) return;

        const frame = document.getElementById("pdfPreviewFrame");
        if (!frame) return;

        try {
          frame.contentWindow.focus();
          frame.contentWindow.print();
        } catch (e) {
          const w = window.open(currentBlobUrl, "_blank");
          if (w) w.focus();
        }
      });

      el.addEventListener("hidden.bs.modal", () => {
        const frame = document.getElementById("pdfPreviewFrame");
        if (frame) frame.src = "about:blank";
        revokeBlob();
        currentDoc = null;
      });
    }

    return modal;
  }

  function numeroALetrasBO(num) {

    const unidades = [
      "", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve"
    ];

    const especiales = [
      "diez","once","doce","trece","catorce","quince",
      "dieciséis","diecisiete","dieciocho","diecinueve"
    ];

    const decenas = [
      "", "", "veinte", "treinta", "cuarenta",
      "cincuenta", "sesenta", "setenta", "ochenta", "noventa"
    ];

    const centenas = [
      "", "ciento", "doscientos", "trescientos", "cuatrocientos",
      "quinientos", "seiscientos", "setecientos", "ochocientos", "novecientos"
    ];

    function convertirMenorMil(n) {

      if (n === 0) return "";
      if (n === 100) return "cien";

      let texto = "";

      if (n >= 100) {
        texto += centenas[Math.floor(n / 100)] + " ";
        n %= 100;
      }

      if (n >= 10 && n < 20) {
        texto += especiales[n - 10];
        return texto.trim();
      }

      if (n >= 20) {
        texto += decenas[Math.floor(n / 10)];
        n %= 10;

        if (n > 0) texto += " y ";
      }

      if (n > 0 && n < 10) {
        texto += unidades[n];
      }

      return texto.trim();
    }

    function convertirNumero(n) {

      if (n === 0) return "cero";

      let texto = "";

      if (n >= 1000000) {

        const millones = Math.floor(n / 1000000);

        if (millones === 1) {
          texto += "un millón ";
        } else {
          texto += convertirMenorMil(millones) + " millones ";
        }

        n %= 1000000;
      }

      if (n >= 1000) {

        const miles = Math.floor(n / 1000);

        if (miles === 1) {
          texto += "mil ";
        } else {
          texto += convertirMenorMil(miles) + " mil ";
        }

        n %= 1000;
      }

      if (n > 0) {
        texto += convertirMenorMil(n);
      }

      return texto.trim();
    }

    const numero = Number(num || 0);

    const entero = Math.floor(numero);
    const centavos = Math.round((numero - entero) * 100);

    let resultado = convertirNumero(entero);

    if (centavos > 0) {
      resultado += " con " + convertirNumero(centavos);
    }

    return resultado;
  }

  function buildPdf(data) {
    if (!window.jspdf || !window.jspdf.jsPDF) {
      throw new Error("jsPDF no está cargado.");
    }

    const jsPDF = window.jspdf.jsPDF;
    const doc = new jsPDF({ unit: "pt", format: "a4" });

    const PAGE_W = doc.internal.pageSize.getWidth();
    const PAGE_H = doc.internal.pageSize.getHeight();
    const M = 24;
    const CONTENT_W = PAGE_W - (M * 2);

    const RED = [220, 38, 38];
    const DARK = [17, 24, 39];
    const GRAY = [107, 114, 128];
    const BLACK = [0, 0, 0];

    const empresa = data.empresa || {};
    const now = new Date();
    const fechaStr = now.toLocaleDateString("es-BO");
    const horaStr = now.toLocaleTimeString("es-BO", { hour: "2-digit", minute: "2-digit" });

    let vigenciaDate = null;
    if (data.vigenciaDate) {
      const d = new Date(String(data.vigenciaDate).slice(0, 10) + "T00:00:00");
      if (!isNaN(d.getTime())) vigenciaDate = d;
    }

    const vigenciaStr = vigenciaDate ? formatVigencia(new Date(), vigenciaDate) : "";
    const clienteRaw = data.clienteText || "Cliente no seleccionado";
    const clienteNombre = onlyClientName(clienteRaw);
    const totals = calcTotals(data);

    let totalFinal = totals.totalSinFactura;
    if (totals.factState === "si" || totals.factState === "ambos") {
      totalFinal = totals.totalConFactura;
    }

    const totalEnLetras = numeroALetrasBO(totalFinal);
    const totalItems = (data.items || []).reduce((acc, it) => acc + Number(it.cantidad || 0), 0);
    let numero = "S/N";
    if (data.numero !== undefined && data.numero !== null) {
    numero = String(data.numero).padStart(3, "0");
    }

    try {
      const logoPath = "/images/progsar.png";
      doc.addImage(logoPath, "PNG", M, 35, 140, 40);
    } catch (e) {
      console.warn("No se pudo cargar el logo:", e);
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.setTextColor(...DARK);
    doc.text("COTIZACIÓN", PAGE_W / 2, 50, { align: "center" });

    doc.setFontSize(13);
    doc.setTextColor(...RED);
    doc.text(`N° ${numero}`, PAGE_W - M, 50, { align: "right" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.8);
    doc.setTextColor(...DARK);

    let y = 85;
    doc.text(`Empresa: ${empresa.nombre || ""}`, M, y); y += 10;
    doc.text(`Oficina: ${empresa.direccion || ""}`, M, y); y += 10;
    doc.text(`Teléfonos: ${empresa.telefono || ""}`, M, y);

    y += 14;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.4);
    doc.text(`Cliente: ${clienteNombre}`, M, y);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.4);
    let yr = 84;
    doc.text(`Fecha: ${fechaStr} - ${horaStr}`, PAGE_W - M, yr, { align: "right" }); yr += 11;
    if (vigenciaStr) doc.text(`Vigencia: ${vigenciaStr}`, PAGE_W - M, yr, { align: "right" });

    const rows = (data.items || []).map((it, idx) => ([
        String(idx + 1),
        it.codigo || "",
        buildDescripcionProducto(it),
        String(it.cantidad || 0),
        Number(it.precioU || 0).toFixed(2),
        Number(it.descuento || 0).toFixed(2),
        Number(it.totalLinea || 0).toFixed(2)
    ]));

    const wNro = 26;
    const wCod = 56;
    const wDescText = 220;
    const rightW = CONTENT_W - (wNro + wCod + wDescText);
    const wCant = Math.round(rightW * 0.16);
    const wPU = Math.round(rightW * 0.32);
    const wDesc = Math.round(rightW * 0.24);
    const wPrec = rightW - (wCant + wPU + wDesc);

    const tableY = 150;

    doc.autoTable({
    startY: tableY,
    theme: "plain",
    margin: { left: M, right: M },
    head: [["Nro", "Código", "Descripción", "Cant", "Precio Unitario", "Descuento", "Precio"]],
    body: rows.length ? rows : [["", "", "Sin items", "", "", "", ""]],
    headStyles: {
        fillColor: RED,
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 8.2,
        cellPadding: { top: 4, right: 6, bottom: 4, left: 6 },
        valign: "middle",
        halign: "center"
    },
    styles: {
        font: "helvetica",
        fontSize: 7.9,
        textColor: DARK,
        cellPadding: { top: 3, right: 5, bottom: 3, left: 5 },
        lineWidth: 0
    },
    bodyStyles: {
        cellPadding: { top: 3, right: 5, bottom: 3, left: 5 },
        valign: "middle"
    },
    columnStyles: {
        0: { cellWidth: wNro, halign: "center" },
        1: { cellWidth: wCod, halign: "center" },
        2: { cellWidth: wDescText, halign: "left", overflow: "linebreak" },
        3: { cellWidth: wCant, halign: "center" },
        4: { cellWidth: wPU, halign: "center" },
        5: { cellWidth: wDesc, halign: "center" },
        6: { cellWidth: wPrec, halign: "center" }
    },

    didParseCell: function (data) {
      if (data.section === "head" && data.column.index === 2) {
        data.cell.styles.halign = "left";
      }

      if (data.section === "body" && data.column.index === 2) {
        const rawText = String(data.cell.raw || "");
        const lineas = rawText ? rawText.split("\n") : [];

        data.cell._customDescripcion = lineas;

        const lineHeight = 10;
        const paddingTop = 4;
        const paddingBottom = 4;
        const minHeight = (lineas.length * lineHeight) + paddingTop + paddingBottom;

        data.cell.styles.minCellHeight = Math.max(18, minHeight);

        data.cell.text = [""];
      }
    },
    didDrawCell: function (data) {
      if (data.section !== "body") return;
      if (data.column.index !== 2) return;

      const lineas = data.cell._customDescripcion;
      if (!Array.isArray(lineas) || !lineas.length) return;

      const doc = data.doc;
      const x = data.cell.x + 5;
      let y = data.cell.y + 10;

      lineas.forEach((linea, index) => {
        const partes = linea.split(":");

        if (partes.length > 1 && index !== 0) {
          const key = partes[0].trim() + ":";
          const value = partes.slice(1).join(":").trim();

          doc.setFont("helvetica", "bold");
          doc.text(key, x, y);

          const w = doc.getTextWidth(key + " ");

          doc.setFont("helvetica", "normal");
          doc.text(value, x + w, y);
        } else {
          doc.setFont("helvetica", index === 0 ? "bold" : "normal");
          doc.text(linea, x, y);
        }

        y += 10;
      });
    },

    rowPageBreak: "avoid"
    });
    const endY = doc.lastAutoTable.finalY || (tableY + 60);
    const boxY = endY + 10;

    const noteW = CONTENT_W * 0.62;
    const noteH = 28;

    doc.setFillColor(239, 68, 68);
    doc.rect(M, boxY, noteW, noteH, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.4);
    doc.setTextColor(255, 255, 255);
    doc.text("Si en caso venciera su proforma de la fecha límite, deberá actualizar su proforma.", M + 10, boxY + 20);

    const totalsX0 = M + noteW + 10;
    const totalsX1 = M + CONTENT_W;

    doc.setDrawColor(...BLACK);
    doc.setLineWidth(1);
    doc.line(totalsX0, boxY, totalsX1, boxY);

    doc.setTextColor(...DARK);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.6);

    const xLabel = totalsX0;
    const xValue = M + CONTENT_W;
    let ty = boxY + 14;

    doc.text("Subtotal:", xLabel, ty);
    doc.text(money(totals.subtotal), xValue, ty, { align: "right" }); ty += 12;

    doc.text("Delivery:", xLabel, ty);
    doc.text(money(totals.delivery), xValue, ty, { align: "right" }); ty += 12;

    if (totals.factState === "ambos") {
      doc.text("Total sin factura:", xLabel, ty);
      doc.text(money(totals.totalSinFactura), xValue, ty, { align: "right" }); ty += 12;

      doc.text("Total con factura:", xLabel, ty);
      doc.text(money(totals.totalConFactura), xValue, ty, { align: "right" }); ty += 12;

      doc.text("Factura:", xLabel, ty);
      doc.setFont("helvetica", "normal");
      doc.text(`${totals.pct.toFixed(2)}%`, xValue, ty, { align: "right" });
    } else if (totals.factState === "si") {
      doc.text("Total a pagar:", xLabel, ty);
      doc.text(money(totals.totalConFactura), xValue, ty, { align: "right" }); ty += 12;

      doc.text("Factura:", xLabel, ty);
      doc.setFont("helvetica", "normal");
      doc.text(`${totals.pct.toFixed(2)}%`, xValue, ty, { align: "right" });
    } else {
      doc.text("Total a pagar:", xLabel, ty);
      doc.text(money(totals.totalSinFactura), xValue, ty, { align: "right" }); ty += 12;

      doc.text("Factura:", xLabel, ty);
      doc.setFont("helvetica", "normal");
      doc.text("Sin Factura", xValue, ty, { align: "right" });
    }

    const textY = boxY + noteH + 18;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.2);
    doc.setTextColor(...DARK);
    doc.text(`Items: ${totalItems} • Cotización total de: ${totalEnLetras}`, M, textY);

    const signY = Math.min(boxY + 130, PAGE_H - 55);

    doc.setDrawColor(...GRAY);
    doc.setLineWidth(0.8);
    doc.line(M + 85, signY, M + 235, signY);
    doc.line(PAGE_W - M - 235, signY, PAGE_W - M - 85, signY);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.6);
    doc.setTextColor(...DARK);

    doc.text("Progsar Maquinarias", M + 160, signY + 14, { align: "center" });

    doc.text(clienteNombre || "", PAGE_W - M - 160, signY + 14, { align: "center" });

    return doc;
  }

  function openPreview(data) {
    const m = ensureModal();
    if (!m) return;

    currentDoc = buildPdf(data);

    revokeBlob();

    const blob = currentDoc.output("blob");
    currentBlobUrl = URL.createObjectURL(blob);

    const frame = document.getElementById("pdfPreviewFrame");
    if (frame) frame.src = currentBlobUrl;

    m.show();
  }

  window.CotizacionPDF = {
    open: openPreview
  };
})();