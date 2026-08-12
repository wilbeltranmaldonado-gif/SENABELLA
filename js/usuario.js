/* =========================================================================
   SENABELLA · usuario.js
   - Datos de cada sección del perfil centralizados en un solo objeto
   - Al cambiar de pestaña en la barra lateral, se renderiza el contenido
     real de esa sección (no solo el título)
   - Los botones "Editar" funcionan con delegación de eventos, así siguen
     funcionando aunque el contenido se regenere dinámicamente
   - "Cerrar sesión" no es una pestaña: dispara una confirmación y redirige
   ========================================================================= */

(function () {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* -------------------------------------------------------------------
     DATOS: una entrada por cada pestaña del menú lateral.
     Cada campo puede ser:
       - editable: true/false → si muestra el botón "Editar"
       - icono + tooltip → para mostrar un ícono con texto emergente
     Una sección puede en cambio usar "vacio" para mostrar un mensaje
     cuando no hay datos que listar (ej. Mis listas).
     ------------------------------------------------------------------- */
  const SECCIONES = {
    "datos-personales": {
      titulo: "Datos personales",
      campos: [
        { etiqueta: "Nombre y apellidos", valor: "Pedro Quijano", editable: true },
        { etiqueta: "Tipo de documento", valor: "Cédula de extranjería", editable: false },
        { etiqueta: "Celular", valor: "+57 3 134300009", editable: true },
        {
          etiqueta: "Correo",
          valor: "pequijano30@gmail.com",
          editable: true,
          icono: "fa-regular fa-circle-question",
          tooltip: "Correo verificado",
        },
      ],
    },

    "direcciones": {
      titulo: "Direcciones",
      campos: [
        { etiqueta: "Dirección principal", valor: "Cra 45 #12-34, Bogotá", editable: true },
        { etiqueta: "Dirección de trabajo", valor: "Calle 100 #15-20, Bogotá", editable: true },
      ],
    },

    "medios-pago": {
      titulo: "Medios de pago",
      campos: [
        { etiqueta: "Tarjeta principal", valor: "Visa terminada en 4321", editable: true },
        { etiqueta: "Tarjeta secundaria", valor: "Mastercard terminada en 7788", editable: true },
      ],
    },

    "reembolso": {
      titulo: "Datos para reembolso",
      campos: [
        { etiqueta: "Cuenta bancaria", valor: "Bancolombia · Ahorros ****1234", editable: true },
        { etiqueta: "Titular de la cuenta", valor: "Pedro Quijano", editable: false },
      ],
    },

    "mis-listas": {
      titulo: "Mis listas",
      vacio: "Aún no has creado ninguna lista de favoritos.",
    },

    "configurar-cuenta": {
      titulo: "Configurar mi cuenta",
      campos: [
        { etiqueta: "Contraseña", valor: "••••••••", editable: true },
        { etiqueta: "Autenticación en dos pasos", valor: "Desactivada", editable: true },
      ],
    },

    "dispositivos": {
      titulo: "Dispositivos vinculados",
      campos: [
        { etiqueta: "Chrome · Windows", valor: "Última conexión: hoy, 9:41 a. m.", editable: false },
        { etiqueta: "App móvil · Android", valor: "Última conexión: ayer, 6:12 p. m.", editable: false },
      ],
    },
  };

  /* --- Construye el HTML de un campo individual (grupo-info) --- */
  function renderCampo(campo) {
    const icono = campo.icono
      ? `<i class="${campo.icono} info-icon-tooltip" title="${campo.tooltip ?? ""}"></i>`
      : "";
    const boton = campo.editable ? `<button class="boton-editar">Editar</button>` : "";

    return `
      <div class="grupo-info">
        <div>
          <div class="etiqueta-info">${campo.etiqueta}</div>
          <div class="valor-info" data-original="${campo.valor}">
            ${campo.valor} ${icono}
          </div>
        </div>
        ${boton}
      </div>
    `;
  }

  /* --- Renderiza una sección completa dentro de la tarjeta --- */
  function renderSeccion(claveSeccion) {
    const seccion = SECCIONES[claveSeccion];
    const tarjeta = $(".tarjeta-contenido");
    if (!seccion || !tarjeta) return;

    const titulo = $(".titulo-seccion", tarjeta);
    const contenedorCampos = $(".lista-campos", tarjeta);

    titulo.textContent = seccion.titulo;

    if (seccion.vacio) {
      contenedorCampos.innerHTML = `<p class="estado-vacio">${seccion.vacio}</p>`;
      return;
    }

    contenedorCampos.innerHTML = seccion.campos.map(renderCampo).join("");
  }

  /* --- Cambia de pestaña con una pequeña transición --- */
  function cambiarSeccion(claveSeccion) {
    const tarjeta = $(".tarjeta-contenido");
    if (!tarjeta) return;

    tarjeta.style.transition = "opacity .2s ease, transform .2s ease";
    tarjeta.style.opacity = "0";
    tarjeta.style.transform = "translateY(6px)";

    setTimeout(() => {
      renderSeccion(claveSeccion);
      tarjeta.style.opacity = "1";
      tarjeta.style.transform = "translateY(0)";
    }, 180);
  }

  /* --- Navegación lateral tipo pestañas --- */
  function setupMenuLateral() {
    const items = $$(".barra-lateral .elemento-menu");
    if (!items.length) return;

    items.forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();

        /* "Cerrar sesión" no cambia de pestaña, cierra la sesión */
        if (item.dataset.logout === "true") {
          const confirmar = window.confirm("¿Seguro que quieres cerrar sesión?");
          if (confirmar) {
            localStorage.removeItem("senabella_sesion");
            localStorage.removeItem("senabella_rol");
            window.location.href = "inicio.html";
          }
          return;
        }

        const claveSeccion = item.dataset.section;
        if (!claveSeccion) return;

        items.forEach((i) => i.classList.remove("activo"));
        item.classList.add("activo");

        cambiarSeccion(claveSeccion);
      });
    });
  }

  /* --- Edición inline de campos con botón "Editar" ---
     Usa delegación de eventos sobre la tarjeta de contenido, así
     sigue funcionando aunque los campos se regeneren al cambiar
     de pestaña. */
  function setupEdicionInline() {
    const tarjeta = $(".tarjeta-contenido");
    if (!tarjeta) return;

    tarjeta.addEventListener("click", (e) => {
      const boton = e.target.closest(".boton-editar");
      if (!boton) return;

      const grupo = boton.closest(".grupo-info");
      const valorEl = $(".valor-info", grupo);
      if (!valorEl) return;

      if (boton.dataset.editando === "true") {
        /* Guardar */
        const input = $("input", grupo);
        const nuevoValor = input.value.trim() || valorEl.dataset.original;
        valorEl.textContent = nuevoValor;
        valorEl.dataset.original = nuevoValor;
        boton.textContent = "Editar";
        boton.dataset.editando = "false";
        window.SenabellaToast?.("Cambios guardados correctamente", "fa-circle-check");
        return;
      }

      /* Entrar en modo edición */
      valorEl.dataset.original = valorEl.textContent.trim();
      const input = document.createElement("input");
      input.type = "text";
      input.value = valorEl.dataset.original;
      input.style.cssText = `
        font: inherit; padding:6px 10px; border:1px solid #84b814;
        border-radius:8px; width:100%; max-width:260px;
      `;
      valorEl.textContent = "";
      valorEl.appendChild(input);
      input.focus();
      input.select();

      boton.textContent = "Guardar";
      boton.dataset.editando = "true";

      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") boton.click();
      });
    });
  }

  /* --- Carga datos dinámicos guardados al registrarse --- */
  function cargarDatosUsuarioRegistrado() {
    try {
      const usuarioGuardado = JSON.parse(localStorage.getItem('senabella_usuario') || 'null');
      if (usuarioGuardado) {
        if (usuarioGuardado.nombre) {
          SECCIONES["datos-personales"].campos[0].valor = usuarioGuardado.nombre;
        }
        if (usuarioGuardado.celular) {
          SECCIONES["datos-personales"].campos[2].valor = usuarioGuardado.celular;
        }
        if (usuarioGuardado.correo) {
          SECCIONES["datos-personales"].campos[3].valor = usuarioGuardado.correo;
        }
      }
    } catch (e) {
      console.error('Error al cargar los datos del usuario:', e);
    }
  }

  function init() {
    cargarDatosUsuarioRegistrado();
    setupMenuLateral();
    setupEdicionInline();
    renderSeccion("datos-personales"); // sección visible al cargar la página
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
