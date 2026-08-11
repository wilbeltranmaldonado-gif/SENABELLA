/* =========================================================================
   SENABELLA · admin.js
   - Datos simulados del dashboard (reemplazar por datos reales del backend)
   - Genera las tarjetas KPI, la tabla de pedidos y la lista de stock bajo
   - Inicializa las gráficas con Chart.js
   - Maneja sidebar móvil, dropdowns y modo oscuro (comparte localStorage
     con el resto del sitio, para que el tema se mantenga consistente)
   ========================================================================= */

(function () {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

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
      color: "#e0a72e",
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
      colorBg: "#f4faE0",
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
    colores: ["#2fa84f", "#3e8ed0", "#e0a72e", "#e0503f"],
  };

  const PEDIDOS_RECIENTES = [
    { id: "SN-10482", cliente: "Pedro Quijano", correo: "pequijano30@gmail.com", producto: "Zapatillas Runner Pro", estado: "pendiente", total: "$389.900" },
    { id: "SN-10481", cliente: "Laura Gómez", correo: "laura.gomez@mail.com", producto: "Licuadora Oster 600W", estado: "en-camino", total: "$219.900" },
    { id: "SN-10480", cliente: "Andrés Torres", correo: "atorres@mail.com", producto: 'Smart TV 55" 4K', estado: "entregado", total: "$1.899.900" },
    { id: "SN-10479", cliente: "Camila Ruiz", correo: "camila.ruiz@mail.com", producto: "Set de sábanas Queen", estado: "entregado", total: "$149.900" },
    { id: "SN-10478", cliente: "Julián Rojas", correo: "jrojas@mail.com", producto: "Audífonos inalámbricos", estado: "cancelado", total: "$99.900" },
    { id: "SN-10477", cliente: "Valentina Díaz", correo: "vdiaz@mail.com", producto: "Cafetera espresso", estado: "en-camino", total: "$459.900" },
  ];

  const ESTADOS_INFO = {
    "entregado": { texto: "Entregado", clase: "admin-badge-success" },
    "en-camino": { texto: "En camino", clase: "admin-badge-info" },
    "pendiente": { texto: "Pendiente", clase: "admin-badge-warning" },
    "cancelado": { texto: "Cancelado", clase: "admin-badge-danger" },
  };

  const PRODUCTOS_BAJO_STOCK = [
    { nombre: "Zapatillas Runner Pro · Talla 40", stock: 3, minimo: 15 },
    { nombre: "Licuadora Oster 600W", stock: 5, minimo: 20 },
    { nombre: "Audífonos inalámbricos X200", stock: 2, minimo: 10 },
    { nombre: "Set de sábanas Queen", stock: 6, minimo: 25 },
  ];

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
     RENDER: Tabla de pedidos recientes
     ===================================================================== */
  function renderPedidos() {
    const tbody = $("#adminTablaPedidos");
    if (!tbody) return;

    tbody.innerHTML = PEDIDOS_RECIENTES.map((pedido) => {
      const estado = ESTADOS_INFO[pedido.estado];
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
          <td>${pedido.total}</td>
          <td>
            <button class="admin-tabla-boton" title="Ver detalle del pedido">
              <i class="fa-regular fa-eye"></i>
            </button>
          </td>
        </tr>
      `;
    }).join("");
  }

  /* =====================================================================
     RENDER: Lista de productos con stock bajo
     ===================================================================== */
  function renderStockBajo() {
    const lista = $("#adminListaStock");
    if (!lista) return;

    lista.innerHTML = PRODUCTOS_BAJO_STOCK.map((producto) => {
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
          <button class="admin-stock-boton">Reabastecer</button>
        </li>
      `;
    }).join("");
  }

  /* =====================================================================
     GRÁFICAS (Chart.js)
     ===================================================================== */
  function initGraficas() {
    if (typeof Chart === "undefined") return;

    const ctxVentas = $("#chartVentas");
    if (ctxVentas) {
      new Chart(ctxVentas, {
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
      new Chart(ctxEstados, {
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
     NAVEGACIÓN LATERAL (resalta la vista activa)
     ===================================================================== */
  function setupNavegacion() {
    const items = $$(".admin-nav-item");
    const tituloVista = $("#adminTituloVista");

    items.forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        items.forEach((i) => i.classList.remove("activo"));
        item.classList.add("activo");

        const nombre = $("span", item)?.textContent.trim() ?? "Resumen";
        if (tituloVista) tituloVista.textContent = nombre === "Resumen" ? "Resumen general" : nombre;

        cerrarSidebarMovil();
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
    renderKpis();
    renderPedidos();
    renderStockBajo();
    initGraficas();
    setupNavegacion();
    setupSidebarMovil();
    setupDropdowns();
    setupModoOscuro();
    setupCerrarSesion();
    setupFecha();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
