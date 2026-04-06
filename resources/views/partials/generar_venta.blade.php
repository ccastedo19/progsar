<div class="container-fluid py-3" id="generar-venta-page">
  <div class="card shadow-sm border-0">
    <div class="card-body" style="padding-top: 0;">

      <div class="row g-2 mb-1 align-items-end cot-top-row">

        <div class="col-12 col-lg-4 col-xl-3">
          <label class="form-label fw-semibold mb-1">Cliente</label>
          <select class="form-select" id="ventaCliente" style="width:100%;">
            <option value="">Cargando clientes...</option>
          </select>
        </div>

        <div class="col-12 col-sm-6 col-lg-3 col-xl-3">
          <div class="d-flex align-items-center justify-content-between mb-1 gap-2">
            <label class="form-label fw-semibold mb-0">% Facturado</label>

            <div class="cot-segmented" id="ventaFacturadoSwitch">
              <button type="button" class="cot-segmented-btn active" data-value="no">No</button>
              <button type="button" class="cot-segmented-btn" data-value="si">Sí</button>
            </div>
          </div>

          <div class="input-group cot-input-facturado">
            <input type="number" class="form-control" id="ventaPorcentajeFacturado" min="0" max="100" step="0.01" value="0">
            <span class="input-group-text">%</span>
          </div>
        </div>

        <div class="col-12 col-sm-6 col-lg-2 col-xl-2">
          <label class="form-label fw-semibold mb-1">Delivery</label>
          <div class="input-group">
            <span class="input-group-text">Bs</span>
            <input type="number" class="form-control" id="ventaDelivery" min="0" step="0.01" value="0">
          </div>
        </div>

        <div class="col-12 col-sm-6 col-lg-4 col-xl-4">
          <label class="form-label fw-semibold d-none d-lg-block mb-1">&nbsp;</label>
          <div class="d-flex gap-2 justify-content-lg-end cot-top-actions">
            <button type="button" class="btn btn-outline-secondary" id="btnVentaLimpiar">
              <i class="bi bi-arrow-clockwise me-1"></i> Limpiar
            </button>

            <button type="button" class="btn btn-danger fw-semibold" id="btnVentaGuardar">
              <i class="bi bi-receipt-cutoff me-1"></i> Registrar Venta
            </button>
          </div>
        </div>

      </div>

      <div class="row g-3 cot-main-row">

        <div class="col-12 col-xl-4">
          <div class="card border-0 shadow-sm cot-panel-left">
            <div class="card-header bg-white border-0 pb-0">
              <h5 class="mb-0 fw-semibold">Detalle de Venta</h5>
            </div>

            <div class="card-body pt-1 d-flex flex-column">
              <div class="cot-items-list border rounded mb-3" id="ventaItemsList"></div>

              <div class="rounded p-3 mb-3 cot-summary-box">
                <div class="d-flex justify-content-between mb-2">
                  <span class="text-muted">Subtotal base</span>
                  <strong id="ventaSubtotalBase">Bs 0.00</strong>
                </div>

                <div class="d-flex justify-content-between mb-2">
                  <span class="text-muted">Delivery</span>
                  <strong id="ventaDeliveryView">Bs 0.00</strong>
                </div>

                <div class="d-flex justify-content-between mb-2">
                  <span class="text-muted">% Facturado</span>
                  <strong id="ventaPctView">0%</strong>
                </div>

                <hr class="my-2">

                <div id="ventaTotalesWrap"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 col-xl-8">
          <div class="card border-0 shadow-sm cot-panel-right">
            <div class="card-header bg-white border-0 pb-0">
              <div class="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3">
                <h5 class="mb-0 fw-semibold">Catálogo</h5>

                <div class="d-flex flex-column flex-md-row gap-2 w-100 w-lg-auto">
                  <div class="d-flex gap-2">
                    <input type="text" class="form-control form-control-sm" id="ventaSearchNombre" placeholder="Buscar por nombre">
                    <input type="text" class="form-control form-control-sm" id="ventaSearchCodigo" placeholder="Buscar por código">
                  </div>
                </div>
              </div>
            </div>

            <div class="card-body pt-3 cot-products-body">
              <div class="cot-products-grid" id="ventaProductsGrid"></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</div>

<div class="modal fade" id="modalVentaErrores" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header bg-danger text-white">
        <h5 class="modal-title">Errores de validación</h5>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Cerrar"></button>
      </div>
      <div class="modal-body">
        <ul class="mb-0 ps-3" id="ventaErroresList"></ul>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
      </div>
    </div>
  </div>
</div>

<div class="modal fade" id="modalPdfVenta" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-fullscreen">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Vista previa de venta</h5>

        <div class="d-flex gap-2">
          <button type="button" class="btn btn-primary" id="btnPdfDescargar">
            Descargar
          </button>

          <button type="button" class="btn btn-secondary" id="btnPdfImprimir">
            Imprimir
          </button>

          <button type="button" class="btn btn-danger" data-bs-dismiss="modal">
            Cerrar
          </button>
        </div>
      </div>

      <div class="modal-body p-0">
        <iframe id="pdfPreviewFrame" style="width:100%; height:100%; border:0;"></iframe>
      </div>
    </div>
  </div>
</div>

<style>
  .cot-main-row {
    align-items: stretch;
  }

  .cot-panel-left,
  .cot-panel-right {
    height: 680px;
  }

  .cot-panel-left .card-body,
  .cot-panel-right .card-body {
    height: calc(100% - 52px);
    min-height: 0;
  }

  .cot-top-row .form-label {
    font-size: .92rem;
  }

  .cot-segmented {
    display: inline-flex;
    border: 1px solid #adb5bd;
    border-radius: 999px;
    overflow: hidden;
    background: #dee2e6;
    flex-shrink: 0;
  }

  .cot-segmented-btn {
    border: 0;
    background: transparent;
    padding: .28rem .62rem;
    font-size: .78rem;
    font-weight: 700;
    color: #495057;
    transition: .15s ease;
    white-space: nowrap;
  }

  .cot-segmented-btn.active {
    background: #0d6efd;
    color: #fff;
  }

  .cot-input-facturado .form-control {
    min-width: 0;
  }

  .cot-top-actions .btn {
    padding: .48rem .75rem;
    font-size: .9rem;
    white-space: nowrap;
  }

  .cot-panel-left .card-header,
  .cot-panel-right .card-header {
    padding: .85rem 1rem .25rem;
  }

  .cot-panel-left .card-header h5,
  .cot-panel-right .card-header h5 {
    font-size: 1.05rem;
  }

  .cot-panel-left .card-body,
  .cot-panel-right .card-body {
    display: flex;
    flex-direction: column;
    padding: .8rem 1rem 1rem;
  }

  .cot-items-list {
    flex: 1 1 auto;
    min-height: 0;
    max-height: 390px;
    overflow-y: auto;
    background: #fff;
  }

  .cot-item-empty {
    padding: .85rem;
    color: #6c757d;
    text-align: center;
    font-size: .92rem;
  }

  .cot-item-row {
    display: block;
    padding: .7rem .8rem;
    border-bottom: 1px solid #a8aaaa;
    background: #fff;
  }

  .cot-item-row:last-child {
    border-bottom: 0;
  }

  .cot-item-content {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: .45rem;
  }

  .cot-item-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: .55rem;
  }

  .cot-item-info {
    min-width: 0;
    flex: 1 1 auto;
  }

  .cot-item-name {
    font-weight: 700;
    font-size: .96rem;
    color: #212529;
    line-height: 1.15;
    margin: 0;
  }

  .cot-item-meta {
    font-size: .78rem;
    color: #6c757d;
    line-height: 1.3;
    margin-top: .15rem;
  }

  .cot-item-actions {
    display: flex;
    align-items: center;
    gap: .3rem;
    flex-shrink: 0;
  }

  .cot-qty-box {
    min-width: 28px;
    text-align: center;
    font-weight: 700;
    font-size: .88rem;
    color: #212529;
  }

  .cot-btn-qty,
  .cot-item-remove {
    width: 29px;
    height: 29px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    border-radius: 8px;
  }

  .cot-item-edit-grid {
    display: grid;
    gap: .5rem;
    align-items: end;
  }

  .cot-item-edit-grid-compact {
    grid-template-columns: 1fr;
  }

  .cot-field {
    min-width: 0;
  }

  .cot-field .form-label {
    font-size: .78rem;
  }

  .cot-field .form-control {
    padding: .3rem .55rem;
    font-size: .88rem;
  }

  .cot-summary-box {
    flex: 0 0 auto;
    padding: .75rem .9rem !important;
    margin-bottom: 0 !important;
  }

  .cot-summary-box .d-flex {
    margin-bottom: .35rem !important;
  }

  .cot-summary-box span.text-muted {
    font-size: .88rem;
  }

  .cot-summary-box strong {
    font-size: .93rem;
  }

  .cot-total-line {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: .35rem;
    gap: .5rem;
  }

  .cot-total-line:last-child {
    margin-bottom: 0;
  }

  .cot-total-line .label {
    font-weight: 600;
    font-size: .92rem;
  }

  .cot-total-line .value {
    font-size: 1rem;
    font-weight: 800;
    white-space: nowrap;
  }

  .cot-total-line.total-factura .value {
    color: #0d6efd;
  }

  .cot-total-line.total-sinfactura .value {
    color: #198754;
  }

  .cot-panel-right {
    overflow: hidden;
  }

  .cot-panel-right .card-header {
    padding-bottom: .5rem !important;
  }

  .cot-panel-right .card-body {
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  .cot-products-body {
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
    padding-top: .35rem !important;
    padding-right: .1rem;
  }

  .cot-products-grid {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: .85rem;
    align-content: start;
  }

  .cot-product-card {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 245px;
    background: #fff;
    border: 1px solid #dfe3e8;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.16);
    cursor: pointer;
    transition: transform .15s ease, box-shadow .15s ease, border-color .15s ease;
  }

  .cot-product-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.10);
    border-color: #cfd6dd;
  }

  .cot-product-stock-badge {
    position: absolute;
    top: 7px;
    right: 7px;
    min-width: 28px;
    height: 28px;
    padding: 0 .45rem;
    border-radius: 999px;
    background: #dc3545;
    color: #fff;
    font-weight: 700;
    font-size: .72rem;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 3;
    box-shadow: 0 2px 6px rgba(0,0,0,.12);
  }

  .cot-product-image {
    height: 145px;
    flex: 0 0 145px;
    background: #f8f9fa;
    border-bottom: 1px solid #edf0f2;
    overflow: hidden;
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .cot-product-image img {
    width: 100%;
    height: 100%;
    object-fit: fill;
    display: block;
    border-radius: 8px;
  }

  .cot-product-body {
    flex: 1 1 auto;
    min-height: 0;
    padding: .6rem .7rem .65rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: .3rem;
  }

  .cot-product-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: .45rem;
    min-height: 18px;
  }

  .cot-product-code {
    flex: 1 1 auto;
    min-width: 0;
    font-weight: 700;
    font-size: .74rem;
    color: #6b7280;
    line-height: 1.1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .cot-product-price {
    flex: 0 0 auto;
    color: #dc3545;
    font-size: .9rem;
    font-weight: 800;
    line-height: 1;
    white-space: nowrap;
  }

  .cot-product-name {
    font-size: .88rem;
    font-weight: 700;
    line-height: 1.2;
    color: #1f2937;
    margin: 0;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    min-height: 2.3em;
    max-height: 2.3em;
  }

  .cot-products-body::-webkit-scrollbar,
  .cot-items-list::-webkit-scrollbar {
    width: 8px;
  }

  .cot-products-body::-webkit-scrollbar-thumb,
  .cot-items-list::-webkit-scrollbar-thumb {
    background: #c1c7cd;
    border-radius: 999px;
  }

  .cot-products-body::-webkit-scrollbar-track,
  .cot-items-list::-webkit-scrollbar-track {
    background: #edf0f2;
  }

  .select2-container {
    width: 100% !important;
  }

  .select2-container .select2-selection--single {
    height: 35px !important;
    display: flex !important;
    align-items: center !important;
    border: 1px solid #ced4da !important;
    border-radius: .375rem !important;
  }

  .select2-container--default .select2-selection--single .select2-selection__rendered {
    line-height: 36px !important;
    padding-left: .75rem !important;
    padding-right: 2rem !important;
    font-size: .92rem;
    color: #212529 !important;
  }

  .select2-container--default .select2-selection--single .select2-selection__arrow {
    height: 36px !important;
  }

  .select2-container--default .select2-selection--single .select2-selection__placeholder {
    color: #6c757d !important;
  }

  input[type="number"]::-webkit-outer-spin-button,
  input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type="number"] {
    -moz-appearance: textfield;
  }

  @media (max-width: 1399.98px) {
    .cot-products-grid {
      grid-template-columns: repeat(5, minmax(0, 1fr));
    }
  }

  @media (min-width: 1200px) and (max-width: 1366.98px) {
    .container-fluid#generar-venta-page {
      padding-left: .55rem;
      padding-right: .55rem;
    }

    .cot-panel-left,
    .cot-panel-right {
      height: 620px;
    }

    .cot-items-list {
      max-height: 280px;
    }

    .cot-products-grid {
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: .75rem;
    }

    .cot-product-card {
      height: 215px;
    }

    .cot-product-image {
      height: 136px;
      flex: 0 0 136px;
    }

    .cot-top-actions .btn {
      padding: .42rem .65rem;
      font-size: .85rem;
    }

    .cot-segmented-btn {
      padding: .26rem .5rem;
      font-size: .74rem;
    }
  }

  @media (max-width: 1199.98px) {
    .cot-panel-left,
    .cot-panel-right {
      height: auto;
    }

    .cot-products-body {
      max-height: 560px;
    }

    .cot-items-list {
      max-height: 420px;
    }
  }

  @media (max-width: 991.98px) {
    .cot-products-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .cot-products-body {
      max-height: 520px;
    }
  }

  @media (max-width: 767.98px) {
    .cot-item-top {
      flex-direction: column;
      align-items: stretch;
    }

    .cot-item-actions {
      justify-content: flex-start;
    }

    .cot-top-actions {
      justify-content: stretch !important;
    }

    .cot-top-actions .btn {
      flex: 1 1 auto;
    }
  }

  @media (max-width: 575.98px) {
    .cot-products-grid {
      grid-template-columns: 1fr;
    }

    .cot-products-body {
      max-height: 460px;
    }
  }
</style>