<main class="container my-4">
  <div class="row g-3">

    <!-- Clientes -->
    <div class="col-12 col-md-6 col-lg-3">
      <div class="card shadow-sm h-100">
        <div class="card-body d-flex align-items-center justify-content-between">
          <div>
            <div class="text-muted small">Clientes</div>
            <div class="fs-3 fw-bold">128</div>
          </div>
          <div class="fs-1 text-danger">
            <i class="bi bi-people"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Productos -->
    <div class="col-12 col-md-6 col-lg-3">
      <div class="card shadow-sm h-100">
        <div class="card-body d-flex align-items-center justify-content-between">
          <div>
            <div class="text-muted small">Productos</div>
            <div class="fs-3 fw-bold">46</div>
          </div>
          <div class="fs-1 text-danger">
            <i class="bi bi-box-seam"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Ventas -->
    <div class="col-12 col-md-6 col-lg-3">
      <div class="card shadow-sm h-100">
        <div class="card-body d-flex align-items-center justify-content-between">
          <div>
            <div class="text-muted small">Ventas</div>
            <div class="fs-3 fw-bold">19</div>
          </div>
          <div class="fs-1 text-danger">
            <i class="bi bi-cash-coin"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Cotizaciones -->
    <div class="col-12 col-md-6 col-lg-3">
      <div class="card shadow-sm h-100">
        <div class="card-body d-flex align-items-center justify-content-between">
          <div>
            <div class="text-muted small">Cotizaciones</div>
            <div class="fs-3 fw-bold">32</div>
          </div>
          <div class="fs-1 text-danger">
            <i class="bi bi-file-earmark-text"></i>
          </div>
        </div>
      </div>
    </div>

  </div>
</main>

<section class="container my-4">
  <div class="row g-3">

    <!-- Ventas por mes -->
    <div class="col-12 col-lg-6">
      <div class="card shadow-sm h-100">
        <div class="card-body">
          <div class="d-flex align-items-center justify-content-between mb-2">
            <h6 class="mb-0">
              <i class="bi bi-bar-chart-line me-2"></i> Ventas por mes
            </h6>
            <span class="badge text-bg-light">Demo</span>
          </div>

          <div style="height: 320px;">
            <canvas id="chartVentasMes"></canvas>
          </div>
        </div>
      </div>
    </div>

    <!-- Ventas por semana -->
    <div class="col-12 col-lg-6">
      <div class="card shadow-sm h-100">
        <div class="card-body">
          <div class="d-flex align-items-center justify-content-between mb-2">
            <h6 class="mb-0">
              <i class="bi bi-calendar-week me-2"></i> Ventas por semana (mes actual)
            </h6>
            <span class="badge text-bg-light">Demo</span>
          </div>

          <div style="height: 320px;">
            <canvas id="chartVentasSemana"></canvas>
          </div>
        </div>
      </div>
    </div>

  </div>
</section>
