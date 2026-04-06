// public/js/charts.js
(() => {
  // Datos DEMO (frontend)
  const ventasPorMes = {
    labels: ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"],
    data:   [12,   18,   10,   22,   15,   28,   25,   19,   30,   26,   14,   21]
  };

  const ventasSemanaMesActual = {
    labels: ["Semana 1","Semana 2","Semana 3","Semana 4"],
    data:   [6,        9,        4,        11]
  };

  function ensureDatalabelsRegistered() {
    // El CDN suele exponerlo como window.ChartDataLabels
    if (window.Chart && window.ChartDataLabels && !window.__datalabels_registered) {
      Chart.register(window.ChartDataLabels);
      window.__datalabels_registered = true;
    }
  }

  function destroyChartOnCanvas(canvasEl) {
    if (!window.Chart) return;
    const existing = Chart.getChart(canvasEl);
    if (existing) existing.destroy();
  }

  function renderHorizontalBarChart(canvasId, labels, data, titleText) {
    const el = document.getElementById(canvasId);
    if (!el) return;

    ensureDatalabelsRegistered();
    destroyChartOnCanvas(el);

    new Chart(el, {
      type: "bar",
      data: {
        labels,
        datasets: [{
          label: titleText,
          data
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: "y",
        plugins: {
          legend: { display: false },
          tooltip: { enabled: true },
          datalabels: window.ChartDataLabels ? {
            anchor: "end",
            align: "right",
            formatter: (value) => value,
            clamp: true
          } : undefined
        },
        scales: {
          x: { beginAtZero: true, ticks: { precision: 0 } },
          y: { ticks: { autoSkip: false } }
        }
      }
    });
  }

  // >>> Esto es lo que llamará spa.js al entrar a /dashboard
  window.initDashboardCharts = function () {
    const mesReady = document.getElementById("chartVentasMes");
    const semReady = document.getElementById("chartVentasSemana");
    if (!mesReady || !semReady) return;

    renderHorizontalBarChart("chartVentasMes", ventasPorMes.labels, ventasPorMes.data, "Ventas");
    renderHorizontalBarChart("chartVentasSemana", ventasSemanaMesActual.labels, ventasSemanaMesActual.data, "Ventas");
  };

  // Opcional: si quieres destruir al salir del dashboard (no obligatorio porque destruimos al re-crear)
  window.destroyDashboardCharts = function () {
    const elMes = document.getElementById("chartVentasMes");
    const elSemana = document.getElementById("chartVentasSemana");
    if (elMes) destroyChartOnCanvas(elMes);
    if (elSemana) destroyChartOnCanvas(elSemana);
  };
})();
