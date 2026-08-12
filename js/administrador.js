/* =========================================================================
   SENABELLA · admin.js
   - Datos simulados del dashboard (reemplazar por datos reales del backend)
   - Genera las tarjetas KPI, tablas y listas de cada vista
   - Inicializa las gráficas con Chart.js
   - Sistema de modales y notificaciones (toasts) reutilizable
   - Da funcionalidad real a cada botón: crear/editar/eliminar registros,
     exportar reportes, buscar, reabastecer stock, guardar configuración
   - Maneja sidebar móvil, dropdowns y modo oscuro (comparte localStorage
     con el resto del sitio, para que el tema se mantenga consistente)
   ========================================================================= */

(function () {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  const formatoCOP = (valor) =>
    "$" + Math.round(valor).toLocaleString("es-CO");

  /* =====================================================================
     DATOS SIMULADOS
     ===================================================================== */
  const KPIS = [
    {
      etiqueta: "Ventas de hoy",
      valor: "$12.480.000",
      tendencia: "+8.2% vs. ayer",
      positiva: true,
      icono: "fa-solid fa-sack-dollar",
      color: "#2fa84f",
      colorBg: "#e8f7ec",
      chispa: [8, 10, 9, 12, 11, 14, 16],
    },
    {
      etiqueta: "Pedidos nuevos",
      valor: "34",
      tendencia: "+5 vs. ayer",
      positiva: true,
      icono: "fa-solid fa-cart-shopping",
      color: "#3e8ed0",
      colorBg: "#e8f2fb",
      chispa: [20, 22, 18, 25, 24, 30, 34],
    },
    {
      etiqueta: "Productos activos",
      valor: "512",
      tendencia: "-3 esta semana",
      positiva: false,
      icono: "fa-solid fa-box",
      color: "#dc9a1f",
      colorBg: "#fdf3e0",
      chispa: [520, 518, 515, 517, 514, 513, 512],
    },
    {
      etiqueta: "Clientes registrados",
      valor: "8.940",
      tendencia: "+112 este mes",
      positiva: true,
      icono: "fa-solid fa-users",
      color: "#aad100",
      colorBg: "#f4fae0",
      chispa: [8700, 8760, 8790, 8830, 8860, 8905, 8940],
    },
  ];

  const VENTAS_SEMANA = {
    etiquetas: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
    valores: [4200000, 5100000, 4800000, 6200000, 7100000, 9800000, 8300000],
  };

  const PEDIDOS_ESTADO = {
    etiquetas: ["Entregado", "En camino", "Pendiente", "Cancelado"],
    valores: [148, 42, 19, 7],
    colores: ["#2fa84f", "#3e8ed0", "#dc9a1f", "#e0503f"],
  };

  const ESTADOS_INFO = {
    "entregado": { texto: "Entregado", clase: "admin-badge-success" },
    "en-camino": { texto: "En camino", clase: "admin-badge-info" },
    "pendiente": { texto: "Pendiente", clase: "admin-badge-warning" },
    "cancelado": { texto: "Cancelado", clase: "admin-badge-danger" },
    "pendiente-verificacion": { texto: "Por Verificar", clase: "admin-badge-warning" }
  };

  let contadorPedido = 10482;
  const PEDIDOS_RECIENTES = [
    { id: "SN-10482", cliente: "Pedro Quijano", correo: "pequijano30@gmail.com", producto: "Zapatillas Runner Pro", estado: "pendiente", total: 389900 },
    { id: "SN-10481", cliente: "Laura Gómez", correo: "laura.gomez@mail.com", producto: "Licuadora Oster 600W", estado: "en-camino", total: 219900 },
    { id: "SN-10480", cliente: "Andrés Torres", correo: "atorres@mail.com", producto: 'Smart TV 55" 4K', estado: "entregado", total: 1899900 },
    { id: "SN-10479", cliente: "Camila Ruiz", correo: "camila.ruiz@mail.com", producto: "Set de sábanas Queen", estado: "entregado", total: 149900 },
    { id: "SN-10478", cliente: "Julián Rojas", correo: "jrojas@mail.com", producto: "Audífonos inalámbricos", estado: "cancelado", total: 99900 },
    { id: "SN-10477", cliente: "Valentina Díaz", correo: "vdiaz@mail.com", producto: "Cafetera espresso", estado: "en-camino", total: 459900 },
  ];

  let contadorProducto = 1;
  const PRODUCTOS = [
    { id: contadorProducto++, nombre: "Zapatillas Runner Pro", categoria: "Calzado", precio: 389900, stock: 3, minimo: 15 },
    { id: contadorProducto++, nombre: "Licuadora Oster 600W", categoria: "Hogar", precio: 219900, stock: 5, minimo: 20 },
    { id: contadorProducto++, nombre: "Audífonos inalámbricos X200", categoria: "Tecnología", precio: 99900, stock: 2, minimo: 10 },
    { id: contadorProducto++, nombre: "Set de sábanas Queen", categoria: "Hogar", precio: 149900, stock: 6, minimo: 25 },
    { id: contadorProducto++, nombre: 'Smart TV 55" 4K', categoria: "Tecnología", precio: 1899900, stock: 18, minimo: 8 },
    { id: contadorProducto++, nombre: "Cafetera espresso", categoria: "Hogar", precio: 459900, stock: 24, minimo: 10 },
    { id: contadorProducto++, nombre: "Camiseta deportiva", categoria: "Ropa", precio: 59900, stock: 80, minimo: 20 },
    { id: contadorProducto++, nombre: "Mochila urbana", categoria: "Accesorios", precio: 129900, stock: 34, minimo: 12 },
  ];

  let contadorCliente = 1;
  const CLIENTES = [
    { id: contadorCliente++, nombre: "Pedro Quijano", correo: "pequijano30@gmail.com", pedidos: 5, gastado: 1240000, registro: "12 ene 2025" },
    { id: contadorCliente++, nombre: "Laura Gómez", correo: "laura.gomez@mail.com", pedidos: 3, gastado: 680000, registro: "03 feb 2025" },
    { id: contadorCliente++, nombre: "Andrés Torres", correo: "atorres@mail.com", pedidos: 8, gastado: 3120000, registro: "22 nov 2024" },
    { id: contadorCliente++, nombre: "Camila Ruiz", correo: "camila.ruiz@mail.com", pedidos: 2, gastado: 299800, registro: "15 mar 2025" },
    { id: contadorCliente++, nombre: "Julián Rojas", correo: "jrojas@mail.com", pedidos: 1, gastado: 99900, registro: "30 mar 2025" },
    { id: contadorCliente++, nombre: "Valentina Díaz", correo: "vdiaz@mail.com", pedidos: 6, gastado: 1580000, registro: "09 dic 2024" },
  ];

  let contadorCategoria = 1;
  const CATEGORIAS = [
    { id: contadorCategoria++, nombre: "Ropa", icono: "fa-shirt", productos: 118 },
    { id: contadorCategoria++, nombre: "Calzado", icono: "fa-shoe-prints", productos: 64 },
    { id: contadorCategoria++, nombre: "Tecnología", icono: "fa-laptop", productos: 92 },
    { id: contadorCategoria++, nombre: "Hogar", icono: "fa-couch", productos: 145 },
    { id: contadorCategoria++, nombre: "Accesorios", icono: "fa-bag-shopping", productos: 93 },
  ];

  let contadorCupon = 1;
  const CUPONES = [
    { id: contadorCupon++, codigo: "BIENVENIDA10", tipo: "porcentaje", valor: 10, vigencia: "31 dic 2026", activo: true },
    { id: contadorCupon++, codigo: "ENVIOGRATIS", tipo: "valor", valor: 15000, vigencia: "30 sep 2026", activo: true },
    { id: contadorCupon++, codigo: "BLACKFRIDAY", tipo: "porcentaje", valor: 25, vigencia: "29 nov 2026", activo: false },
  ];

  /* =====================================================================
     TOASTS
     ===================================================================== */
  function mostrarToast(mensaje, tipo = "exito") {
    const contenedor = $("#adminToasts");
    if (!contenedor) return;

    const iconos = {
      exito: "fa-solid fa-circle-check",
      error: "fa-solid fa-circle-exclamation",
      info: "fa-solid fa-circle-info",
    };

    const toast = document.createElement("div");
    toast.className = `admin-toast ${tipo}`;
    toast.innerHTML = `<i class="${iconos[tipo] || iconos.info}"></i><span>${mensaje}</span>`;
    contenedor.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("saliendo");
      setTimeout(() => toast.remove(), 200);
    }, 3200);
  }

  /* =====================================================================
     MODALES
     ===================================================================== */
  function cerrarModal() {
    const raiz = $("#adminModalRaiz");
    if (raiz) raiz.innerHTML = "";
    document.removeEventListener("keydown", cerrarModalConEsc);
  }

  function cerrarModalConEsc(e) {
    if (e.key === "Escape") cerrarModal();
  }

  function abrirModal({ titulo, cuerpoHTML, textoConfirmar = "Guardar", claseConfirmar = "admin-boton-primario", alConfirmar, ocultarFooter = false }) {
    const raiz = $("#adminModalRaiz");
    if (!raiz) return;

    raiz.innerHTML = `
      <div class="admin-modal-overlay" id="adminModalOverlay">
        <div class="admin-modal" role="dialog" aria-modal="true">
          <div class="admin-modal-header">
            <h3>${titulo}</h3>
            <button type="button" class="admin-modal-cerrar" id="adminModalCerrar" aria-label="Cerrar">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div class="admin-modal-body">
            <form id="adminModalForm">${cuerpoHTML}</form>
          </div>
          ${ocultarFooter
        ? ""
        : `<div class="admin-modal-footer">
                  <button type="button" class="admin-boton admin-boton-secundario" id="adminModalCancelar">Cancelar</button>
                  <button type="submit" form="adminModalForm" class="admin-boton ${claseConfirmar}">${textoConfirmar}</button>
                </div>`
      }
        </div>
      </div>
    `;

    const overlay = $("#adminModalOverlay");
    const form = $("#adminModalForm");

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) cerrarModal();
    });
    $("#adminModalCerrar").addEventListener("click", cerrarModal);
    $("#adminModalCancelar")?.addEventListener("click", cerrarModal);

    if (alConfirmar) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const datos = new FormData(form);
        alConfirmar(datos, form);
      });
    }

    document.addEventListener("keydown", cerrarModalConEsc);

    setTimeout(() => $("input, select, textarea", form)?.focus(), 30);
  }

  function abrirModalConfirmacion({ titulo, mensaje, textoConfirmar = "Eliminar", alConfirmar }) {
    abrirModal({
      titulo,
      cuerpoHTML: `<p style="margin:0;color:var(--text-muted);font-size:14px;">${mensaje}</p>`,
      textoConfirmar,
      claseConfirmar: "admin-boton-peligro",
      alConfirmar: () => {
        alConfirmar();
        cerrarModal();
      },
    });
  }

  /* =====================================================================
     RENDER: Tarjetas KPI (con mini gráfico de tendencia en SVG)
     ===================================================================== */
  function crearSparkline(valores, color) {
    const ancho = 100;
    const alto = 30;
    const max = Math.max(...valores);
    const min = Math.min(...valores);
    const rango = max - min || 1;

    const puntos = valores.map((v, i) => {
      const x = (i / (valores.length - 1)) * ancho;
      const y = alto - ((v - min) / rango) * alto;
      return `${x},${y}`;
    });

    return `
      <svg class="admin-kpi-sparkline" viewBox="0 0 ${ancho} ${alto}" preserveAspectRatio="none">
        <path d="M ${puntos.join(" L ")}" style="stroke:${color}"></path>
      </svg>
    `;
  }

  function renderKpis() {
    const contenedor = $("#adminGridKpi");
    if (!contenedor) return;

    contenedor.innerHTML = KPIS.map((kpi) => `
      <div class="admin-kpi" style="--kpi-color:${kpi.color}; --kpi-color-bg:${kpi.colorBg};">
        <div class="admin-kpi-top">
          <span class="admin-kpi-icono"><i class="${kpi.icono}"></i></span>
          <span class="admin-kpi-tendencia ${kpi.positiva ? "positiva" : "negativa"}">
            <i class="fa-solid ${kpi.positiva ? "fa-arrow-trend-up" : "fa-arrow-trend-down"}"></i>
            ${kpi.tendencia}
          </span>
        </div>
        <div>
          <div class="admin-kpi-etiqueta">${kpi.etiqueta}</div>
          <div class="admin-kpi-valor">${kpi.valor}</div>
        </div>
        ${crearSparkline(kpi.chispa, kpi.color)}
      </div>
    `).join("");
  }

  /* =====================================================================
     RENDER: Tabla de pedidos (dashboard y vista de pedidos)
     ===================================================================== */
  function renderPedidos(filtro = "") {
    const tbody = $("#adminTablaPedidos");
    if (!tbody) return;

    const texto = filtro.trim().toLowerCase();

    // Combinamos pedidos simulados con los reales guardados en localStorage
    let ordenesReales = [];
    try {
      ordenesReales = JSON.parse(localStorage.getItem("senabella_admin_orders")) || [];
    } catch (e) { }

    // Adaptamos las reales al formato esperado o simplemente las juntamos
    let listaReal = ordenesReales.map(o => ({
      id: o.numero,
      cliente: (o.cliente && o.cliente.direccion) ? o.cliente.direccion : "Cliente Local",
      correo: "sin-correo@senabella.com",
      producto: (o.productos && o.productos.length > 0) ? o.productos.map(p => p.nombre).join(", ") : "Productos",
      estado: o.estado || "pendiente",
      total: typeof o.total === "string" ? parseFloat(o.total.replace(/[^\d]/g, "")) : o.total,
      comprobante: o.comprobante || null
    }));

    let listaCombinada = [...listaReal, ...PEDIDOS_RECIENTES];

    const lista = listaCombinada.filter((p) =>
      !texto ||
      p.id.toLowerCase().includes(texto) ||
      p.cliente.toLowerCase().includes(texto) ||
      p.producto.toLowerCase().includes(texto)
    );

    if (!lista.length) {
      tbody.innerHTML = `
        <tr><td colspan="7">
          <div class="admin-estado-vacio">
            <i class="fa-solid fa-magnifying-glass"></i>
            <p>No encontramos pedidos que coincidan con "${filtro}".</p>
          </div>
        </td></tr>`;
      return;
    }

    tbody.innerHTML = lista.map((pedido) => {
      const estado = ESTADOS_INFO[pedido.estado] || ESTADOS_INFO["pendiente"];
      let acciones = `
        <button class="admin-tabla-boton" title="Ver detalle del pedido" data-accion="ver-pedido" data-id="${pedido.id}">
          <i class="fa-regular fa-eye"></i>
        </button>
      `;

      if (pedido.comprobante) {
        acciones += `
          <button class="admin-tabla-boton" title="Ver Comprobante" data-accion="ver-comprobante" data-id="${pedido.id}">
            <i class="fa-solid fa-file-invoice-dollar"></i>
          </button>
        `;
      }

      if (pedido.estado === "pendiente-verificacion") {
        acciones += `
          <button class="admin-tabla-boton" style="color:var(--success-color);" title="Aprobar Pago" data-accion="aprobar-pago" data-id="${pedido.id}">
            <i class="fa-solid fa-check"></i>
          </button>
          <button class="admin-tabla-boton peligro" title="Rechazar Pago" data-accion="rechazar-pago" data-id="${pedido.id}">
            <i class="fa-solid fa-xmark"></i>
          </button>
        `;
      }

      return `
        <tr>
          <td><strong>${pedido.id}</strong></td>
          <td>
            <div class="admin-celda-cliente">
              ${pedido.cliente}
              <small>${pedido.correo}</small>
            </div>
          </td>
          <td>${pedido.producto}</td>
          <td><span class="admin-badge ${estado.clase}">${estado.texto}</span></td>
          <td>${formatoCOP(pedido.total)}</td>
          <td>
            <div class="admin-tabla-acciones">
              ${acciones}
            </div>
          </td>
        </tr>
      `;
    }).join("");
  }

  /* =====================================================================
     RENDER: Lista de productos con stock bajo (dashboard)
     ===================================================================== */
  function renderStockBajo() {
    const lista = $("#adminListaStock");
    if (!lista) return;

    const bajos = PRODUCTOS.filter((p) => p.stock <= p.minimo);

    if (!bajos.length) {
      lista.innerHTML = `
        <div class="admin-stock-vacio">
          <i class="fa-solid fa-circle-check"></i>
          Todo el inventario está en niveles saludables.
        </div>`;
      return;
    }

    lista.innerHTML = bajos.map((producto) => {
      const porcentaje = Math.round((producto.stock / producto.minimo) * 100);
      return `
        <li class="admin-item-stock">
          <div class="admin-stock-info">
            <p>${producto.nombre}</p>
            <span>${producto.stock} unidades (mínimo recomendado: ${producto.minimo})</span>
            <div class="admin-stock-barra">
              <div class="admin-stock-barra-relleno" style="width:${Math.min(porcentaje, 100)}%"></div>
            </div>
          </div>
          <button class="admin-stock-boton" data-accion="reabastecer" data-id="${producto.id}">Reabastecer</button>
        </li>
      `;
    }).join("");
  }

  /* =====================================================================
     RENDER: Productos
     ===================================================================== */
  function renderProductos(filtro = "") {
    const tbody = $("#adminTablaProductos");
    if (!tbody) return;

    const texto = filtro.trim().toLowerCase();
    const lista = PRODUCTOS.filter((p) =>
      !texto || p.nombre.toLowerCase().includes(texto) || p.categoria.toLowerCase().includes(texto)
    );

    if ($("#adminConteoProductos")) $("#adminConteoProductos").textContent = PRODUCTOS.length;
    if ($("#adminConteoStockBajo")) $("#adminConteoStockBajo").textContent = PRODUCTOS.filter((p) => p.stock <= p.minimo).length;

    if (!lista.length) {
      tbody.innerHTML = `
        <tr><td colspan="6">
          <div class="admin-estado-vacio">
            <i class="fa-solid fa-box-open"></i>
            <p>No hay productos que coincidan con tu búsqueda.</p>
          </div>
        </td></tr>`;
      return;
    }

    tbody.innerHTML = lista.map((p) => {
      const bajo = p.stock <= p.minimo;
      return `
        <tr>
          <td><strong>${p.nombre}</strong></td>
          <td>${p.categoria}</td>
          <td>${formatoCOP(p.precio)}</td>
          <td>${p.stock} u.</td>
          <td>
            <span class="admin-badge ${bajo ? "admin-badge-warning" : "admin-badge-success"}">
              ${bajo ? "Stock bajo" : "Disponible"}
            </span>
          </td>
          <td>
            <div class="admin-tabla-acciones">
              <button class="admin-tabla-boton" title="Editar producto" data-accion="editar-producto" data-id="${p.id}">
                <i class="fa-regular fa-pen-to-square"></i>
              </button>
              <button class="admin-tabla-boton peligro" title="Eliminar producto" data-accion="eliminar-producto" data-id="${p.id}">
                <i class="fa-regular fa-trash-can"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join("");
  }

  /* =====================================================================
     RENDER: Clientes
     ===================================================================== */
  function renderClientes(filtro = "") {
    const tbody = $("#adminTablaClientes");
    if (!tbody) return;

    const texto = filtro.trim().toLowerCase();
    const lista = CLIENTES.filter((c) =>
      !texto || c.nombre.toLowerCase().includes(texto) || c.correo.toLowerCase().includes(texto)
    );

    if ($("#adminConteoClientes")) $("#adminConteoClientes").textContent = CLIENTES.length.toLocaleString("es-CO");

    if (!lista.length) {
      tbody.innerHTML = `
        <tr><td colspan="5">
          <div class="admin-estado-vacio">
            <i class="fa-solid fa-user-slash"></i>
            <p>No hay clientes que coincidan con tu búsqueda.</p>
          </div>
        </td></tr>`;
      return;
    }

    tbody.innerHTML = lista.map((c) => {
      const iniciales = c.nombre.split(" ").slice(0, 2).map((p) => p[0]).join("").toUpperCase();
      return `
        <tr>
          <td>
            <div class="admin-celda-persona">
              <span class="admin-mini-avatar">${iniciales}</span>
              <div class="admin-celda-cliente">
                ${c.nombre}
                <small>${c.correo}</small>
              </div>
            </div>
          </td>
          <td>${c.pedidos}</td>
          <td>${formatoCOP(c.gastado)}</td>
          <td>${c.registro}</td>
          <td>
            <div class="admin-tabla-acciones">
              <button class="admin-tabla-boton" title="Ver cliente" data-accion="ver-cliente" data-id="${c.id}">
                <i class="fa-regular fa-eye"></i>
              </button>
              <button class="admin-tabla-boton peligro" title="Eliminar cliente" data-accion="eliminar-cliente" data-id="${c.id}">
                <i class="fa-regular fa-trash-can"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join("");
  }

  /* =====================================================================
     RENDER: Categorías
     ===================================================================== */
  function renderCategorias() {
    const contenedor = $("#adminGridCategorias");
    if (!contenedor) return;

    if (!CATEGORIAS.length) {
      contenedor.innerHTML = `
        <div class="admin-estado-vacio">
          <i class="fa-solid fa-tags"></i>
          <p>Todavía no has creado categorías.</p>
        </div>`;
      return;
    }

    contenedor.innerHTML = CATEGORIAS.map((cat) => `
      <div class="admin-categoria-tarjeta">
        <span class="admin-categoria-icono"><i class="fa-solid ${cat.icono}"></i></span>
        <div class="admin-categoria-info">
          <strong>${cat.nombre}</strong>
          <span>${cat.productos} productos</span>
        </div>
        <button class="admin-tabla-boton peligro" title="Eliminar categoría" data-accion="eliminar-categoria" data-id="${cat.id}">
          <i class="fa-regular fa-trash-can"></i>
        </button>
      </div>
    `).join("");
  }

  /* =====================================================================
     RENDER: Cupones
     ===================================================================== */
  function renderCupones() {
    const tbody = $("#adminTablaCupones");
    if (!tbody) return;

    if (!CUPONES.length) {
      tbody.innerHTML = `
        <tr><td colspan="5">
          <div class="admin-estado-vacio">
            <i class="fa-solid fa-ticket"></i>
            <p>Todavía no has creado cupones.</p>
          </div>
        </td></tr>`;
      return;
    }

    tbody.innerHTML = CUPONES.map((c) => `
      <tr>
        <td><strong>${c.codigo}</strong></td>
        <td>${c.tipo === "porcentaje" ? c.valor + "%" : formatoCOP(c.valor)}</td>
        <td>${c.vigencia}</td>
        <td>
          <label class="admin-switch" title="${c.activo ? "Desactivar" : "Activar"} cupón">
            <input type="checkbox" data-accion="alternar-cupon" data-id="${c.id}" ${c.activo ? "checked" : ""}>
            <span class="admin-switch-riel"></span>
          </label>
        </td>
        <td>
          <button class="admin-tabla-boton peligro" title="Eliminar cupón" data-accion="eliminar-cupon" data-id="${c.id}">
            <i class="fa-regular fa-trash-can"></i>
          </button>
        </td>
      </tr>
    `).join("");
  }

  /* =====================================================================
     GRÁFICAS (Chart.js)
     ===================================================================== */
  let chartVentasInstancia = null;
  let chartEstadosInstancia = null;

  function initGraficas() {
    if (typeof Chart === "undefined") return;

    const ctxVentas = $("#chartVentas");
    if (ctxVentas) {
      if (chartVentasInstancia) chartVentasInstancia.destroy();
      chartVentasInstancia = new Chart(ctxVentas, {
        type: "bar",
        data: {
          labels: VENTAS_SEMANA.etiquetas,
          datasets: [{
            label: "Ventas",
            data: VENTAS_SEMANA.valores,
            backgroundColor: "#aad100",
            borderRadius: 6,
            maxBarThickness: 38,
          }],
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: {
            y: {
              ticks: {
                callback: (valor) => "$" + (valor / 1000000).toFixed(1) + "M",
              },
              grid: { color: "#eef0f3" },
            },
            x: { grid: { display: false } },
          },
        },
      });
    }

    const ctxEstados = $("#chartEstados");
    if (ctxEstados) {
      if (chartEstadosInstancia) chartEstadosInstancia.destroy();
      chartEstadosInstancia = new Chart(ctxEstados, {
        type: "doughnut",
        data: {
          labels: PEDIDOS_ESTADO.etiquetas,
          datasets: [{
            data: PEDIDOS_ESTADO.valores,
            backgroundColor: PEDIDOS_ESTADO.colores,
            borderWidth: 0,
          }],
        },
        options: {
          responsive: true,
          cutout: "68%",
          plugins: { legend: { display: false } },
        },
      });
    }

    /* Leyenda propia para el donut, con el mismo estilo del resto del panel */
    const leyenda = $("#adminLeyendaEstados");
    if (leyenda) {
      leyenda.innerHTML = PEDIDOS_ESTADO.etiquetas.map((etiqueta, i) => `
        <li>
          <span class="punto" style="background:${PEDIDOS_ESTADO.colores[i]}"></span>
          ${etiqueta} (${PEDIDOS_ESTADO.valores[i]})
        </li>
      `).join("");
    }
  }

  /* =====================================================================
     EXPORTAR CSV
     ===================================================================== */
  function descargarCSV(nombreArchivo, filas) {
    const contenido = filas.map((fila) =>
      fila.map((celda) => `"${String(celda).replace(/"/g, '""')}"`).join(",")
    ).join("\n");

    const blob = new Blob(["\uFEFF" + contenido], { type: "text/csv;charset=utf-8;" });
    const enlace = document.createElement("a");
    enlace.href = URL.createObjectURL(blob);
    enlace.download = nombreArchivo;
    document.body.appendChild(enlace);
    enlace.click();
    enlace.remove();
    URL.revokeObjectURL(enlace.href);
  }

  function exportarPedidos() {
    const filas = [["Pedido", "Cliente", "Correo", "Producto", "Estado", "Total"]];
    PEDIDOS_RECIENTES.forEach((p) =>
      filas.push([p.id, p.cliente, p.correo, p.producto, ESTADOS_INFO[p.estado].texto, p.total])
    );
    descargarCSV("senabella-pedidos.csv", filas);
    mostrarToast("Reporte de pedidos exportado.");
  }

  function exportarProductos() {
    const filas = [["Producto", "Categoría", "Precio", "Stock", "Mínimo recomendado"]];
    PRODUCTOS.forEach((p) => filas.push([p.nombre, p.categoria, p.precio, p.stock, p.minimo]));
    descargarCSV("senabella-productos.csv", filas);
    mostrarToast("Reporte de productos exportado.");
  }

  function exportarClientes() {
    const filas = [["Cliente", "Correo", "Pedidos", "Total gastado", "Registro"]];
    CLIENTES.forEach((c) => filas.push([c.nombre, c.correo, c.pedidos, c.gastado, c.registro]));
    descargarCSV("senabella-clientes.csv", filas);
    mostrarToast("Reporte de clientes exportado.");
  }

  /* =====================================================================
     ACCIONES: Pedidos
     ===================================================================== */
  function verDetallePedido(id) {
    const { ordenes, pedido } = obtenerPedidoAdmin(id);
    if (!pedido) return;

    const clienteNombre = (pedido.cliente && pedido.cliente.direccion) ? pedido.cliente.direccion : (pedido.cliente || "Cliente");
    const correo = pedido.correo || "sin-correo@senabella.com";
    const productoText = (pedido.productos && pedido.productos.length > 0) ? pedido.productos.map(p => p.nombre).join(", ") : (pedido.producto || "-");
    const totalNum = typeof pedido.total === "string" ? parseFloat(pedido.total.replace(/[^\d]/g, "")) : pedido.total;
    const idPedido = pedido.numero || pedido.id;

    abrirModal({
      titulo: `Pedido ${idPedido}`,
      textoConfirmar: "Actualizar estado",
      cuerpoHTML: `
        <div class="admin-modal-detalle-fila"><span>Cliente</span><span>${clienteNombre}</span></div>
        <div class="admin-modal-detalle-fila"><span>Correo</span><span>${correo}</span></div>
        <div class="admin-modal-detalle-fila"><span>Producto</span><span>${productoText}</span></div>
        <div class="admin-modal-detalle-fila"><span>Total</span><span>${formatoCOP(totalNum)}</span></div>
        <div class="admin-form-grupo" style="margin-top:16px;">
          <label for="campoEstadoPedido">Estado del pedido</label>
          <select id="campoEstadoPedido" name="estado">
            ${Object.entries(ESTADOS_INFO).map(([clave, info]) =>
              `<option value="${clave}" ${clave === pedido.estado ? "selected" : ""}>${info.texto}</option>`
            ).join("")}
          </select>
        </div>
      `,
      alConfirmar: (datos) => {
        pedido.estado = datos.get("estado");
        if (ordenes && ordenes.length > 0) {
          localStorage.setItem("senabella_admin_orders", JSON.stringify(ordenes));
        }
        const buscadorInput = $("#adminBuscadorInput");
        renderPedidos(buscadorInput ? buscadorInput.value : "");
        cerrarModal();
        mostrarToast(`Estado del pedido ${idPedido} actualizado a "${ESTADOS_INFO[pedido.estado].texto}".`);
      },
    });
  }

  function nuevoPedido() {
    abrirModal({
      titulo: "Nuevo pedido",
      textoConfirmar: "Crear pedido",
      cuerpoHTML: `
        <div class="admin-form-grupo">
          <label for="campoClientePedido">Cliente</label>
          <input type="text" id="campoClientePedido" name="cliente" placeholder="Nombre del cliente" required>
        </div>
        <div class="admin-form-grupo">
          <label for="campoProductoPedido">Producto</label>
          <input type="text" id="campoProductoPedido" name="producto" placeholder="Producto solicitado" required>
        </div>
        <div class="admin-form-fila">
          <div class="admin-form-grupo">
            <label for="campoTotalPedido">Total</label>
            <input type="number" id="campoTotalPedido" name="total" min="0" step="100" placeholder="0" required>
          </div>
          <div class="admin-form-grupo">
            <label for="campoEstadoNuevoPedido">Estado</label>
            <select id="campoEstadoNuevoPedido" name="estado">
              ${Object.entries(ESTADOS_INFO).map(([clave, info]) => `<option value="${clave}">${info.texto}</option>`).join("")}
            </select>
          </div>
        </div>
      `,
      alConfirmar: (datos) => {
        contadorPedido += 1;
        PEDIDOS_RECIENTES.unshift({
          id: `SN-${contadorPedido}`,
          cliente: datos.get("cliente").trim(),
          correo: "sin-correo@senabella.com",
          producto: datos.get("producto").trim(),
          estado: datos.get("estado"),
          total: Number(datos.get("total")) || 0,
        });
        renderPedidos();
        cerrarModal();
        mostrarToast("Pedido creado correctamente.");
      },
    });
  }

  function obtenerPedidoAdmin(id) {
    try {
      let ordenes = JSON.parse(localStorage.getItem("senabella_admin_orders")) || [];
      return { ordenes, pedido: ordenes.find(o => o.numero === id) || PEDIDOS_RECIENTES.find((p) => p.id === id) };
    } catch (e) { return { ordenes: [], pedido: null }; }
  }

  function verComprobantePago(id) {
    const { ordenes, pedido } = obtenerPedidoAdmin(id);
    if (!pedido || !pedido.comprobante) {
      mostrarToast("No se encontró comprobante para este pedido.", "error");
      return;
    }

    abrirModal({
      titulo: `Comprobante - Pedido ${id}`,
      textoConfirmar: "Actualizar estado",
      cuerpoHTML: `
        <div style="text-align: center; margin-bottom: 16px;">
          <img src="${pedido.comprobante}" alt="Comprobante de pago" style="max-width: 100%; max-height: 50vh; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        </div>
        <div class="admin-form-grupo">
          <label for="campoEstadoComprobante">Estado del pedido (Modificar aquí mismo)</label>
          <select id="campoEstadoComprobante" name="estado">
            ${Object.entries(ESTADOS_INFO).map(([clave, info]) =>
              `<option value="${clave}" ${clave === pedido.estado ? "selected" : ""}>${info.texto}</option>`
            ).join("")}
          </select>
        </div>
      `,
      alConfirmar: (datos) => {
        pedido.estado = datos.get("estado");
        if (ordenes && ordenes.length > 0) {
          localStorage.setItem("senabella_admin_orders", JSON.stringify(ordenes));
        }
        renderPedidos();
        cerrarModal();
        mostrarToast(`Estado actualizado a "${ESTADOS_INFO[pedido.estado].texto}".`);
      }
    });
  }

  function aprobarPago(id) {
    const { ordenes, pedido } = obtenerPedidoAdmin(id);
    if (!pedido) return;

    abrirModalConfirmacion({
      titulo: "Aprobar Pago",
      mensaje: `¿Estás seguro de que deseas aprobar el pago y procesar el pedido ${id}?`,
      textoConfirmar: "Aprobar",
      alConfirmar: () => {
        pedido.estado = "pendiente";
        if (ordenes.length > 0) {
          localStorage.setItem("senabella_admin_orders", JSON.stringify(ordenes));
        }
        renderPedidos();
        mostrarToast(`Pago aprobado. El pedido ${id} ahora está pendiente.`, "exito");
      }
    });
  }

  function rechazarPago(id) {
    const { ordenes, pedido } = obtenerPedidoAdmin(id);
    if (!pedido) return;

    abrirModalConfirmacion({
      titulo: "Rechazar Pago",
      mensaje: `¿Estás seguro de que deseas rechazar este pago? El pedido ${id} será marcado como cancelado.`,
      textoConfirmar: "Rechazar",
      alConfirmar: () => {
        pedido.estado = "cancelado";
        if (ordenes.length > 0) {
          localStorage.setItem("senabella_admin_orders", JSON.stringify(ordenes));
        }
        renderPedidos();
        mostrarToast(`Pago rechazado. El pedido ${id} fue cancelado.`, "info");
      }
    });
  }

  /* =====================================================================
     ACCIONES: Productos
     ===================================================================== */
  function formularioProducto(producto) {
    return `
      <div class="admin-form-grupo">
        <label for="campoNombreProducto">Nombre del producto</label>
        <input type="text" id="campoNombreProducto" name="nombre" value="${producto ? producto.nombre : ""}" placeholder="Ej. Zapatillas Runner Pro" required>
      </div>
      <div class="admin-form-fila">
        <div class="admin-form-grupo">
          <label for="campoCategoriaProducto">Categoría</label>
          <select id="campoCategoriaProducto" name="categoria">
            ${CATEGORIAS.map((c) => `<option value="${c.nombre}" ${producto && producto.categoria === c.nombre ? "selected" : ""}>${c.nombre}</option>`).join("")}
          </select>
        </div>
        <div class="admin-form-grupo">
          <label for="campoPrecioProducto">Precio</label>
          <input type="number" id="campoPrecioProducto" name="precio" min="0" step="100" value="${producto ? producto.precio : ""}" required>
        </div>
      </div>
      <div class="admin-form-fila">
        <div class="admin-form-grupo">
          <label for="campoStockProducto">Stock actual</label>
          <input type="number" id="campoStockProducto" name="stock" min="0" value="${producto ? producto.stock : ""}" required>
        </div>
        <div class="admin-form-grupo">
          <label for="campoMinimoProducto">Stock mínimo</label>
          <input type="number" id="campoMinimoProducto" name="minimo" min="0" value="${producto ? producto.minimo : 10}" required>
        </div>
      </div>
    `;
  }

  function nuevoProducto() {
    abrirModal({
      titulo: "Nuevo producto",
      textoConfirmar: "Crear producto",
      cuerpoHTML: formularioProducto(),
      alConfirmar: (datos) => {
        PRODUCTOS.unshift({
          id: contadorProducto++,
          nombre: datos.get("nombre").trim(),
          categoria: datos.get("categoria"),
          precio: Number(datos.get("precio")) || 0,
          stock: Number(datos.get("stock")) || 0,
          minimo: Number(datos.get("minimo")) || 0,
        });
        renderProductos();
        renderStockBajo();
        renderKpis();
        cerrarModal();
        mostrarToast("Producto creado correctamente.");
      },
    });
  }

  function editarProducto(id) {
    const producto = PRODUCTOS.find((p) => p.id === id);
    if (!producto) return;

    abrirModal({
      titulo: "Editar producto",
      textoConfirmar: "Guardar cambios",
      cuerpoHTML: formularioProducto(producto),
      alConfirmar: (datos) => {
        producto.nombre = datos.get("nombre").trim();
        producto.categoria = datos.get("categoria");
        producto.precio = Number(datos.get("precio")) || 0;
        producto.stock = Number(datos.get("stock")) || 0;
        producto.minimo = Number(datos.get("minimo")) || 0;
        const buscadorInput = $("#adminBuscadorInput");
        renderProductos(buscadorInput ? buscadorInput.value : "");
        renderStockBajo();
        cerrarModal();
        mostrarToast("Producto actualizado.");
      },
    });
  }

  function eliminarProducto(id) {
    const producto = PRODUCTOS.find((p) => p.id === id);
    if (!producto) return;

    abrirModalConfirmacion({
      titulo: "Eliminar producto",
      mensaje: `¿Seguro que quieres eliminar "${producto.nombre}"? Esta acción no se puede deshacer.`,
      alConfirmar: () => {
        const indice = PRODUCTOS.findIndex((p) => p.id === id);
        if (indice > -1) PRODUCTOS.splice(indice, 1);
        renderProductos();
        renderStockBajo();
        renderKpis();
        mostrarToast("Producto eliminado.", "info");
      },
    });
  }

  function reabastecerProducto(id) {
    const producto = PRODUCTOS.find((p) => p.id === id);
    if (!producto) return;

    abrirModal({
      titulo: `Reabastecer "${producto.nombre}"`,
      textoConfirmar: "Agregar al inventario",
      cuerpoHTML: `
        <div class="admin-form-grupo">
          <label for="campoCantidadReabastecer">Unidades a agregar <span class="admin-ayuda">(stock actual: ${producto.stock})</span></label>
          <input type="number" id="campoCantidadReabastecer" name="cantidad" min="1" value="${Math.max(producto.minimo - producto.stock, 5)}" required>
        </div>
      `,
      alConfirmar: (datos) => {
        const cantidad = Number(datos.get("cantidad")) || 0;
        producto.stock += cantidad;
        renderStockBajo();
        const buscadorInput = $("#adminBuscadorInput");
        renderProductos(buscadorInput ? buscadorInput.value : "");
        cerrarModal();
        mostrarToast(`Se agregaron ${cantidad} unidades a "${producto.nombre}".`);
      },
    });
  }

  /* =====================================================================
     ACCIONES: Clientes
     ===================================================================== */
  function nuevoCliente() {
    abrirModal({
      titulo: "Nuevo cliente",
      textoConfirmar: "Crear cliente",
      cuerpoHTML: `
        <div class="admin-form-grupo">
          <label for="campoNombreCliente">Nombre completo</label>
          <input type="text" id="campoNombreCliente" name="nombre" placeholder="Ej. Camila Ruiz" required>
        </div>
        <div class="admin-form-grupo">
          <label for="campoCorreoCliente">Correo</label>
          <input type="email" id="campoCorreoCliente" name="correo" placeholder="correo@ejemplo.com" required>
        </div>
      `,
      alConfirmar: (datos) => {
        CLIENTES.unshift({
          id: contadorCliente++,
          nombre: datos.get("nombre").trim(),
          correo: datos.get("correo").trim(),
          pedidos: 0,
          gastado: 0,
          registro: new Date().toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" }),
        });
        renderClientes();
        cerrarModal();
        mostrarToast("Cliente creado correctamente.");
      },
    });
  }

  function verCliente(id) {
    const cliente = CLIENTES.find((c) => c.id === id);
    if (!cliente) return;

    abrirModal({
      titulo: cliente.nombre,
      ocultarFooter: true,
      cuerpoHTML: `
        <div class="admin-modal-detalle-fila"><span>Correo</span><span>${cliente.correo}</span></div>
        <div class="admin-modal-detalle-fila"><span>Pedidos realizados</span><span>${cliente.pedidos}</span></div>
        <div class="admin-modal-detalle-fila"><span>Total gastado</span><span>${formatoCOP(cliente.gastado)}</span></div>
        <div class="admin-modal-detalle-fila"><span>Cliente desde</span><span>${cliente.registro}</span></div>
      `,
    });
  }

  function eliminarCliente(id) {
    const cliente = CLIENTES.find((c) => c.id === id);
    if (!cliente) return;

    abrirModalConfirmacion({
      titulo: "Eliminar cliente",
      mensaje: `¿Seguro que quieres eliminar a "${cliente.nombre}" de tu base de clientes?`,
      alConfirmar: () => {
        const indice = CLIENTES.findIndex((c) => c.id === id);
        if (indice > -1) CLIENTES.splice(indice, 1);
        renderClientes();
        mostrarToast("Cliente eliminado.", "info");
      },
    });
  }

  /* =====================================================================
     ACCIONES: Categorías
     ===================================================================== */
  function nuevaCategoria() {
    abrirModal({
      titulo: "Nueva categoría",
      textoConfirmar: "Crear categoría",
      cuerpoHTML: `
        <div class="admin-form-grupo">
          <label for="campoNombreCategoria">Nombre de la categoría</label>
          <input type="text" id="campoNombreCategoria" name="nombre" placeholder="Ej. Deportes" required>
        </div>
      `,
      alConfirmar: (datos) => {
        CATEGORIAS.unshift({
          id: contadorCategoria++,
          nombre: datos.get("nombre").trim(),
          icono: "fa-tag",
          productos: 0,
        });
        renderCategorias();
        cerrarModal();
        mostrarToast("Categoría creada correctamente.");
      },
    });
  }

  function eliminarCategoria(id) {
    const categoria = CATEGORIAS.find((c) => c.id === id);
    if (!categoria) return;

    abrirModalConfirmacion({
      titulo: "Eliminar categoría",
      mensaje: `¿Seguro que quieres eliminar "${categoria.nombre}"? Los productos asociados no se eliminarán.`,
      alConfirmar: () => {
        const indice = CATEGORIAS.findIndex((c) => c.id === id);
        if (indice > -1) CATEGORIAS.splice(indice, 1);
        renderCategorias();
        mostrarToast("Categoría eliminada.", "info");
      },
    });
  }

  /* =====================================================================
     ACCIONES: Cupones
     ===================================================================== */
  function nuevoCupon() {
    abrirModal({
      titulo: "Nuevo cupón",
      textoConfirmar: "Crear cupón",
      cuerpoHTML: `
        <div class="admin-form-grupo">
          <label for="campoCodigoCupon">Código</label>
          <input type="text" id="campoCodigoCupon" name="codigo" placeholder="Ej. VERANO20" style="text-transform:uppercase" required>
        </div>
        <div class="admin-form-fila">
          <div class="admin-form-grupo">
            <label for="campoTipoCupon">Tipo de descuento</label>
            <select id="campoTipoCupon" name="tipo">
              <option value="porcentaje">Porcentaje (%)</option>
              <option value="valor">Valor fijo ($)</option>
            </select>
          </div>
          <div class="admin-form-grupo">
            <label for="campoValorCupon">Valor</label>
            <input type="number" id="campoValorCupon" name="valor" min="0" placeholder="10" required>
          </div>
        </div>
        <div class="admin-form-grupo">
          <label for="campoVigenciaCupon">Vigente hasta</label>
          <input type="date" id="campoVigenciaCupon" name="vigencia" required>
        </div>
      `,
      alConfirmar: (datos) => {
        const fecha = new Date(datos.get("vigencia") + "T00:00:00");
        CUPONES.unshift({
          id: contadorCupon++,
          codigo: datos.get("codigo").trim().toUpperCase(),
          tipo: datos.get("tipo"),
          valor: Number(datos.get("valor")) || 0,
          vigencia: isNaN(fecha) ? datos.get("vigencia") : fecha.toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" }),
          activo: true,
        });
        renderCupones();
        cerrarModal();
        mostrarToast("Cupón creado correctamente.");
      },
    });
  }

  function alternarCupon(id, activo) {
    const cupon = CUPONES.find((c) => c.id === id);
    if (!cupon) return;
    cupon.activo = activo;
    mostrarToast(`Cupón "${cupon.codigo}" ${activo ? "activado" : "desactivado"}.`, "info");
  }

  function eliminarCupon(id) {
    const cupon = CUPONES.find((c) => c.id === id);
    if (!cupon) return;

    abrirModalConfirmacion({
      titulo: "Eliminar cupón",
      mensaje: `¿Seguro que quieres eliminar el cupón "${cupon.codigo}"?`,
      alConfirmar: () => {
        const indice = CUPONES.findIndex((c) => c.id === id);
        if (indice > -1) CUPONES.splice(indice, 1);
        renderCupones();
        mostrarToast("Cupón eliminado.", "info");
      },
    });
  }

  /* =====================================================================
     PLANTILLAS DE VISTA
     ===================================================================== */
  function plantillaVistas() {
    return {
      resumen: `
        <div class="admin-bienvenida">
          <div>
            <h2>Hola, Admin</h2>
            <p id="adminFecha">Este es el resumen de la tienda</p>
          </div>

          <div class="admin-acciones-rapidas">
            <button class="admin-boton admin-boton-primario" data-accion="nuevo-producto">
              <i class="fa-solid fa-plus"></i>
              Nuevo producto
            </button>

            <button class="admin-boton admin-boton-secundario" data-accion="exportar-pedidos">
              <i class="fa-solid fa-file-arrow-down"></i>
              Exportar reporte
            </button>
          </div>
        </div>

        <section class="admin-grid-kpi" id="adminGridKpi"></section>

        <section class="admin-grid-charts">
          <div class="admin-tarjeta admin-tarjeta-chart">
            <div class="admin-tarjeta-header">
              <h3>Ventas de la semana</h3>
            </div>
            <canvas id="chartVentas" height="230"></canvas>
          </div>

          <div class="admin-tarjeta admin-tarjeta-chart">
            <div class="admin-tarjeta-header">
              <h3>Pedidos por estado</h3>
            </div>
            <canvas id="chartEstados" height="230"></canvas>
            <ul class="admin-leyenda" id="adminLeyendaEstados"></ul>
          </div>
        </section>

        <section class="admin-grid-tablas">
          <div class="admin-tarjeta admin-tarjeta-tabla">
            <div class="admin-tarjeta-header">
              <h3>Últimos pedidos</h3>
              <button class="admin-ver-todo" data-vista-ir="pedidos">Ver todo <i class="fa-solid fa-arrow-right"></i></button>
            </div>
            <div class="admin-tabla-scroll">
              <table class="admin-tabla">
                <thead>
                  <tr>
                    <th>Pedido</th><th>Cliente</th><th>Producto</th><th>Estado</th><th>Total</th><th></th>
                  </tr>
                </thead>
                <tbody id="adminTablaPedidos"></tbody>
              </table>
            </div>
          </div>

          <div class="admin-tarjeta admin-tarjeta-stock">
            <div class="admin-tarjeta-header">
              <h3>Stock bajo</h3>
            </div>
            <ul class="admin-lista-stock" id="adminListaStock"></ul>
          </div>
        </section>
      `,

      pedidos: `
        <div class="admin-bienvenida">
          <div>
            <h2>Pedidos</h2>
            <p>Administra los pedidos realizados en la tienda.</p>
          </div>
          <div class="admin-acciones-rapidas">
            <button class="admin-boton admin-boton-secundario" data-accion="exportar-pedidos">
              <i class="fa-solid fa-file-arrow-down"></i>
              Exportar
            </button>
            <button class="admin-boton admin-boton-primario" data-accion="nuevo-pedido">
              <i class="fa-solid fa-plus"></i>
              Nuevo pedido
            </button>
          </div>
        </div>

        <div class="admin-tarjeta">
          <div class="admin-tarjeta-header">
            <h3>Lista de pedidos</h3>
          </div>
          <div class="admin-tabla-scroll">
            <table class="admin-tabla">
              <thead>
                <tr><th>Pedido</th><th>Cliente</th><th>Producto</th><th>Estado</th><th>Total</th><th></th></tr>
              </thead>
              <tbody id="adminTablaPedidos"></tbody>
            </table>
          </div>
        </div>
      `,

      productos: `
        <div class="admin-bienvenida">
          <div>
            <h2>Productos</h2>
            <p>Gestiona los productos de la tienda.</p>
          </div>
          <button class="admin-boton admin-boton-primario" data-accion="nuevo-producto">
            <i class="fa-solid fa-plus"></i>
            Nuevo producto
          </button>
        </div>

        <div class="admin-grid-kpi" style="grid-template-columns:repeat(2,1fr);">
          <div class="admin-kpi admin-kpi-simple">
            <div class="admin-kpi-etiqueta">Productos activos</div>
            <div class="admin-kpi-valor" id="adminConteoProductos">${PRODUCTOS.length}</div>
          </div>
          <div class="admin-kpi admin-kpi-simple">
            <div class="admin-kpi-etiqueta">Stock bajo</div>
            <div class="admin-kpi-valor" id="adminConteoStockBajo">0</div>
          </div>
        </div>

        <div class="admin-tarjeta">
          <div class="admin-tarjeta-header">
            <h3>Productos registrados</h3>
          </div>
          <div class="admin-tabla-scroll">
            <table class="admin-tabla">
              <thead>
                <tr><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Stock</th><th>Estado</th><th></th></tr>
              </thead>
              <tbody id="adminTablaProductos"></tbody>
            </table>
          </div>
        </div>
      `,

      clientes: `
        <div class="admin-bienvenida">
          <div>
            <h2>Clientes</h2>
            <p>Consulta y administra los clientes registrados.</p>
          </div>
          <button class="admin-boton admin-boton-primario" data-accion="nuevo-cliente">
            <i class="fa-solid fa-user-plus"></i>
            Nuevo cliente
          </button>
        </div>

        <div class="admin-grid-kpi" style="grid-template-columns:repeat(2,1fr);">
          <div class="admin-kpi admin-kpi-simple">
            <div class="admin-kpi-etiqueta">Clientes registrados</div>
            <div class="admin-kpi-valor" id="adminConteoClientes">${CLIENTES.length}</div>
          </div>
          <div class="admin-kpi admin-kpi-simple">
            <div class="admin-kpi-etiqueta">Nuevos este mes</div>
            <div class="admin-kpi-valor">112</div>
          </div>
        </div>

        <div class="admin-tarjeta">
          <div class="admin-tarjeta-header">
            <h3>Clientes</h3>
          </div>
          <div class="admin-tabla-scroll">
            <table class="admin-tabla">
              <thead>
                <tr><th>Cliente</th><th>Pedidos</th><th>Total gastado</th><th>Registro</th><th></th></tr>
              </thead>
              <tbody id="adminTablaClientes"></tbody>
            </table>
          </div>
        </div>
      `,

      categorias: `
        <div class="admin-bienvenida">
          <div>
            <h2>Categorías</h2>
            <p>Organiza los productos de la tienda.</p>
          </div>
          <button class="admin-boton admin-boton-primario" data-accion="nueva-categoria">
            <i class="fa-solid fa-plus"></i>
            Nueva categoría
          </button>
        </div>

        <div class="admin-tarjeta">
          <div class="admin-tarjeta-header">
            <h3>Categorías registradas</h3>
          </div>
          <div class="admin-grid-categorias" id="adminGridCategorias"></div>
        </div>
      `,

      cupones: `
        <div class="admin-bienvenida">
          <div>
            <h2>Cupones</h2>
            <p>Administra los descuentos disponibles.</p>
          </div>
          <button class="admin-boton admin-boton-primario" data-accion="nuevo-cupon">
            <i class="fa-solid fa-plus"></i>
            Nuevo cupón
          </button>
        </div>

        <div class="admin-tarjeta">
          <div class="admin-tarjeta-header">
            <h3>Cupones registrados</h3>
          </div>
          <div class="admin-tabla-scroll">
            <table class="admin-tabla">
              <thead>
                <tr><th>Código</th><th>Descuento</th><th>Vigencia</th><th>Activo</th><th></th></tr>
              </thead>
              <tbody id="adminTablaCupones"></tbody>
            </table>
          </div>
        </div>
      `,

      reportes: `
        <div class="admin-bienvenida">
          <div>
            <h2>Reportes</h2>
            <p>Consulta y descarga los reportes de la tienda.</p>
          </div>
          <button class="admin-boton admin-boton-primario" data-accion="exportar-pedidos">
            <i class="fa-solid fa-file-pdf"></i>
            Generar reporte
          </button>
        </div>

        <div class="admin-grid-kpi" style="grid-template-columns:repeat(2,1fr);">
          <div class="admin-kpi admin-kpi-simple">
            <div class="admin-kpi-etiqueta">Ventas del mes</div>
            <div class="admin-kpi-valor">$48.250.000</div>
          </div>
          <div class="admin-kpi admin-kpi-simple">
            <div class="admin-kpi-etiqueta">Pedidos</div>
            <div class="admin-kpi-valor">342</div>
          </div>
        </div>

        <div class="admin-tarjeta">
          <div class="admin-tarjeta-header">
            <h3>Reportes disponibles</h3>
          </div>

          <div class="admin-item-stock">
            <div class="admin-stock-info">
              <p>Reporte de ventas y pedidos</p>
              <span>Incluye cliente, producto, estado y total por pedido.</span>
            </div>
            <button class="admin-boton admin-boton-secundario admin-boton-sm" data-accion="exportar-pedidos">
              <i class="fa-solid fa-file-arrow-down"></i> Descargar CSV
            </button>
          </div>

          <div class="admin-item-stock">
            <div class="admin-stock-info">
              <p>Reporte de productos</p>
              <span>Incluye categoría, precio y niveles de inventario.</span>
            </div>
            <button class="admin-boton admin-boton-secundario admin-boton-sm" data-accion="exportar-productos">
              <i class="fa-solid fa-file-arrow-down"></i> Descargar CSV
            </button>
          </div>

          <div class="admin-item-stock">
            <div class="admin-stock-info">
              <p>Reporte de clientes</p>
              <span>Incluye historial de compras y valor total gastado.</span>
            </div>
            <button class="admin-boton admin-boton-secundario admin-boton-sm" data-accion="exportar-clientes">
              <i class="fa-solid fa-file-arrow-down"></i> Descargar CSV
            </button>
          </div>
        </div>
      `,

      configuracion: `
        <div class="admin-bienvenida">
          <div>
            <h2>Configuración</h2>
            <p>Configura las opciones del panel administrativo.</p>
          </div>
        </div>

        <div class="admin-tarjeta">
          <div class="admin-tarjeta-header">
            <h3>Configuración general</h3>
          </div>

          <form id="adminFormConfiguracion">
            <div class="admin-form-grupo">
              <label for="campoNombreTienda">Nombre de la tienda</label>
              <input type="text" id="campoNombreTienda" name="nombreTienda" value="Senabella">
            </div>

            <div class="admin-form-grupo">
              <label for="campoCorreoAdmin">Correo de administración</label>
              <input type="email" id="campoCorreoAdmin" name="correoAdmin" value="admin@senabella.com">
            </div>

            <div class="admin-form-grupo" style="display:flex;align-items:center;justify-content:space-between;gap:12px;">
              <div>
                <label style="margin-bottom:2px;">Notificaciones por correo</label>
                <p class="admin-ayuda" style="margin:0;">Recibe un aviso cuando entre un pedido nuevo.</p>
              </div>
              <label class="admin-switch">
                <input type="checkbox" name="notificaciones" checked>
                <span class="admin-switch-riel"></span>
              </label>
            </div>

            <button type="submit" class="admin-boton admin-boton-primario">
              <i class="fa-solid fa-floppy-disk"></i>
              Guardar cambios
            </button>
          </form>
        </div>
      `,
    };
  }

  /* =====================================================================
     NAVEGACIÓN LATERAL Y CAMBIO DE VISTAS
     ===================================================================== */
  function irAVista(vista) {
    const item = $(`.admin-nav-item[data-vista="${vista}"]`);
    if (item) item.click();
  }

  function setupNavegacion() {
    const items = $$(".admin-nav-item");
    const tituloVista = $("#adminTituloVista");
    const contenido = $("#contenidoVista");
    const vistas = plantillaVistas();

    function cambiarA(vista, item) {
      items.forEach((i) => i.classList.remove("activo"));
      if (item) item.classList.add("activo");

      const nombre = item ? $("span", item)?.textContent.trim() : null;

      if (tituloVista) {
        tituloVista.textContent =
          vista === "resumen" ? "Resumen general" : nombre || vista;
      }

      if (contenido && vistas[vista]) {
        contenido.innerHTML = vistas[vista];
      }

      renderVista(vista);

      const buscador = $("#adminBuscadorInput");
      if (buscador) buscador.value = "";
      $("#adminBuscadorContenedor")?.classList.remove("tiene-texto");

      cerrarSidebarMovil();
    }

    items.forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        cambiarA(item.dataset.vista, item);
      });
    });

    /* Mostrar Resumen al cargar */
    cambiarA("resumen", $('.admin-nav-item[data-vista="resumen"]'));
  }

  function renderVista(vista) {
    if (vista === "resumen") {
      renderKpis();
      renderPedidos();
      renderStockBajo();
      setupFecha();
      setTimeout(initGraficas, 60);
    }
    if (vista === "pedidos") renderPedidos();
    if (vista === "productos") renderProductos();
    if (vista === "clientes") renderClientes();
    if (vista === "categorias") renderCategorias();
    if (vista === "cupones") renderCupones();

    if (vista === "configuracion") {
      $("#adminFormConfiguracion")?.addEventListener("submit", (e) => {
        e.preventDefault();
        mostrarToast("Configuración guardada correctamente.");
      });
    }
  }

  /* =====================================================================
     DELEGACIÓN DE EVENTOS PARA BOTONES DINÁMICOS
     ===================================================================== */
  function setupDelegacionAcciones() {
    document.addEventListener("click", (e) => {
      const botonVista = e.target.closest("[data-vista-ir]");
      if (botonVista) {
        e.preventDefault();
        irAVista(botonVista.dataset.vistaIr);
        return;
      }

      const boton = e.target.closest("[data-accion]");
      if (!boton) return;

      const accion = boton.dataset.accion;
      const id = boton.dataset.id;

      switch (accion) {
        case "nuevo-producto": nuevoProducto(); break;
        case "editar-producto": editarProducto(Number(id)); break;
        case "eliminar-producto": eliminarProducto(Number(id)); break;
        case "reabastecer": reabastecerProducto(Number(id)); break;

        case "nuevo-pedido": nuevoPedido(); break;
        case "ver-pedido": verDetallePedido(id); break;
        case "ver-comprobante": verComprobantePago(id); break;
        case "aprobar-pago": aprobarPago(id); break;
        case "rechazar-pago": rechazarPago(id); break;

        case "nuevo-cliente": nuevoCliente(); break;
        case "ver-cliente": verCliente(Number(id)); break;
        case "eliminar-cliente": eliminarCliente(Number(id)); break;

        case "nueva-categoria": nuevaCategoria(); break;
        case "eliminar-categoria": eliminarCategoria(Number(id)); break;

        case "nuevo-cupon": nuevoCupon(); break;
        case "eliminar-cupon": eliminarCupon(Number(id)); break;

        case "exportar-pedidos": exportarPedidos(); break;
        case "exportar-productos": exportarProductos(); break;
        case "exportar-clientes": exportarClientes(); break;

        default: break;
      }
    });

    document.addEventListener("change", (e) => {
      if (e.target.dataset && e.target.dataset.accion === "alternar-cupon") {
        alternarCupon(Number(e.target.dataset.id), e.target.checked);
      }
    });
  }

  /* =====================================================================
     BUSCADOR DE LA TOPBAR
     ===================================================================== */
  function setupBuscador() {
    const input = $("#adminBuscadorInput");
    const contenedor = $("#adminBuscadorContenedor");
    const limpiar = $("#adminBuscadorLimpiar");
    if (!input) return;

    function filtrar() {
      const texto = input.value;
      contenedor.classList.toggle("tiene-texto", texto.length > 0);

      if ($("#adminTablaProductos")) renderProductos(texto);
      else if ($("#adminTablaClientes")) renderClientes(texto);
      else if ($("#adminTablaPedidos")) renderPedidos(texto);
    }

    input.addEventListener("input", filtrar);
    limpiar?.addEventListener("click", () => {
      input.value = "";
      filtrar();
      input.focus();
    });
  }

  /* =====================================================================
     NOTIFICACIONES DE LA CAMPANA
     ===================================================================== */
  function setupNotificaciones() {
    $$(".admin-dropdown-item[data-notif]").forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        item.style.opacity = "0.45";
        const badge = $("#adminBadgeNotificaciones");
        if (badge) {
          const restantes = Math.max(0, Number(badge.textContent) - 1);
          if (restantes === 0) {
            badge.remove();
          } else {
            badge.textContent = restantes;
          }
        }
        mostrarToast("Notificación marcada como leída.", "info");
      });
    });
  }

  /* =====================================================================
     SIDEBAR MÓVIL
     ===================================================================== */
  function cerrarSidebarMovil() {
    $("#adminSidebar")?.classList.remove("abierto");
    $("#adminOverlay")?.classList.remove("visible");
  }

  function setupSidebarMovil() {
    const boton = $("#adminBotonMenu");
    const overlay = $("#adminOverlay");

    boton?.addEventListener("click", () => {
      $("#adminSidebar")?.classList.add("abierto");
      overlay?.classList.add("visible");
    });

    overlay?.addEventListener("click", cerrarSidebarMovil);
  }

  /* =====================================================================
     DROPDOWNS (notificaciones y perfil)
     ===================================================================== */
  function setupDropdowns() {
    const pares = [
      ["#adminBotonNotificaciones", "#adminDropdownNotificaciones"],
      ["#adminBotonPerfil", "#adminDropdownPerfil"],
    ];

    pares.forEach(([selectorBoton, selectorDropdown]) => {
      const boton = $(selectorBoton);
      const dropdown = $(selectorDropdown);
      if (!boton || !dropdown) return;

      boton.addEventListener("click", (e) => {
        e.stopPropagation();
        const yaAbierto = dropdown.classList.contains("mostrar");
        $$(".admin-dropdown.mostrar").forEach((d) => d.classList.remove("mostrar"));
        if (!yaAbierto) dropdown.classList.add("mostrar");
      });
    });

    document.addEventListener("click", () => {
      $$(".admin-dropdown.mostrar").forEach((d) => d.classList.remove("mostrar"));
    });
  }

  /* =====================================================================
     MODO OSCURO
     Comparte la misma clave de localStorage ("modoOscuro") que el resto
     del sitio (ver js/header.js), así el tema se mantiene consistente
     entre el panel de admin y las páginas de cliente.
     ===================================================================== */
  function setupModoOscuro() {
    const boton = $("#adminThemeToggle");
    if (!boton) return;

    const modoGuardado = localStorage.getItem("modoOscuro");
    if (modoGuardado === "activado") {
      document.body.classList.add("modo-oscuro");
      boton.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }

    boton.addEventListener("click", () => {
      document.body.classList.toggle("modo-oscuro");
      const activado = document.body.classList.contains("modo-oscuro");
      boton.innerHTML = activado
        ? '<i class="fa-solid fa-sun"></i>'
        : '<i class="fa-solid fa-moon"></i>';
      localStorage.setItem("modoOscuro", activado ? "activado" : "desactivado");
    });
  }

  /* =====================================================================
     CERRAR SESIÓN
     ===================================================================== */
  function setupCerrarSesion() {
    ["#adminCerrarSesion", "#adminCerrarSesion2"].forEach((selector) => {
      $(selector)?.addEventListener("click", (e) => {
        e.preventDefault();
        const confirmar = window.confirm("¿Seguro que quieres cerrar sesión?");
        if (confirmar) window.location.href = "inicio.html";
      });
    });
  }

  /* =====================================================================
     FECHA DE BIENVENIDA
     ===================================================================== */
  function setupFecha() {
    const el = $("#adminFecha");
    if (!el) return;
    const hoy = new Date();
    const texto = hoy.toLocaleDateString("es-CO", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
    el.textContent = `Este es el resumen de la tienda hoy, ${texto}`;
  }

  /* =====================================================================
     INIT
     ===================================================================== */
  function init() {
    setupNavegacion();
    setupDelegacionAcciones();
    setupBuscador();
    setupNotificaciones();
    setupSidebarMovil();
    setupDropdowns();
    setupModoOscuro();
    setupCerrarSesion();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
