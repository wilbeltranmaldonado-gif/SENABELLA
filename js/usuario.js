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
      subtitulo: "Consulta y actualiza tu información personal.",
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
      subtitulo: "Gestiona tus direcciones de envío y facturación.",
      campos: [
        { etiqueta: "Dirección principal", valor: "Cra 45 #12-34, Bogotá", editable: true },
        { etiqueta: "Dirección de trabajo", valor: "Calle 100 #15-20, Bogotá", editable: true },
      ],
    },

    "medios-pago": {
      titulo: "Medios de pago",
      subtitulo: "Administra tus métodos de pago.",
      campos: [
        { etiqueta: "Tarjeta principal", valor: "Visa terminada en 4321", editable: true },
        { etiqueta: "Tarjeta secundaria", valor: "Mastercard terminada en 7788", editable: true },
      ],
    },

    "reembolso": {
      titulo: "Datos para reembolso",
      subtitulo: "Configura los datos con los que recibirás tus reembolsos.",
      campos: [
        { etiqueta: "Cuenta bancaria", valor: "Bancolombia · Ahorros ****1234", editable: true },
        { etiqueta: "Titular de la cuenta", valor: "Pedro Quijano", editable: false },
      ],
    },

    "mis-listas": {
      titulo: "Mis listas",
      subtitulo: "Crea y administra tus listas personales.",
      vacio: "Aún no has creado ninguna lista de favoritos.",
    },

    "configurar-cuenta": {
      titulo: "Configurar mi cuenta",
      subtitulo: "Ajusta las preferencias y la seguridad de tu cuenta.",
      campos: [
        { etiqueta: "Contraseña", valor: "••••••••", editable: true },
        { etiqueta: "Autenticación en dos pasos", valor: "Desactivada", editable: true },
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
    const subtitulo = $(".subtitulo-seccion", tarjeta);
    const contenedorCampos = $(".lista-campos", tarjeta);

    titulo.textContent = seccion.titulo;
if (subtitulo) subtitulo.textContent = seccion.subtitulo ?? "";

    if (seccion.especial === "mi-perfil") {
      let usuario = {};
      try {
        usuario = JSON.parse(localStorage.getItem("senabella_usuario")) || {};
      } catch (e) { }

      contenedorCampos.innerHTML = `
        <form id="form-mi-perfil" class="formulario" style="margin-top: 15px;" novalidate>

          <div class="grupo-campo" style="margin-bottom: 15px;">
            <label for="perfil-nombre" style="display:block; margin-bottom:5px; font-weight:500;">Nombre completo *</label>
            <input type="text" id="perfil-nombre"
              value="${usuario.nombre || ''}"
              placeholder="Ej. María García"
              required
              style="width:100%; padding:10px; border:1px solid var(--color-borde); border-radius:8px;">
          </div>

          <div class="grupo-campo" style="margin-bottom: 15px;">
            <label for="perfil-email" style="display:block; margin-bottom:5px; font-weight:500;">Correo electrónico *</label>
            <input type="email" id="perfil-email"
              value="${usuario.email || ''}"
              placeholder="Ej. maria@email.com"
              required
              style="width:100%; padding:10px; border:1px solid var(--color-borde); border-radius:8px;">
          </div>

          <div class="grupo-campo" style="margin-bottom: 15px;">
            <label for="perfil-celular" style="display:block; margin-bottom:5px; font-weight:500;">Celular</label>
            <input type="tel" id="perfil-celular"
              value="${usuario.celular || ''}"
              placeholder="Ej. 300 123 4567"
              style="width:100%; padding:10px; border:1px solid var(--color-borde); border-radius:8px;">
          </div>

          <div class="grupo-campo" style="margin-bottom: 20px;">
            <label for="perfil-password" style="display:block; margin-bottom:5px; font-weight:500;">Nueva contraseña <span style="font-weight:400; color:var(--text-muted); font-size:0.85em;">(dejar en blanco para no cambiarla)</span></label>
            <input type="password" id="perfil-password"
              placeholder="Mínimo 6 caracteres"
              style="width:100%; padding:10px; border:1px solid var(--color-borde); border-radius:8px;">
          </div>

          <button type="submit" id="btn-guardar-perfil"
            style="width:100%; padding:13px; border-radius:8px;
                   background:var(--color-primario, #84b814); color:#fff;
                   border:none; font-size:1rem; font-weight:700;
                   cursor:pointer; display:flex; align-items:center;
                   justify-content:center; gap:8px; transition:opacity .2s;">
            <i class="fa-solid fa-floppy-disk"></i> Guardar datos
          </button>

          <div id="perfil-mensaje" style="display:none; margin-top:14px; padding:10px 14px;
               border-radius:8px; font-size:0.9rem; font-weight:500;"></div>
        </form>
      `;

      setTimeout(() => {
        const formPerfil = document.getElementById("form-mi-perfil");
        if (!formPerfil) return;

        /* --- Restricciones en tiempo real --- */
        const inputCelularP = document.getElementById("perfil-celular");
        if (inputCelularP) {
          // Solo permite escribir dígitos y espacios; bloquea letras
          inputCelularP.addEventListener("keydown", function (e) {
            const permitidas = ["Backspace","Delete","ArrowLeft","ArrowRight","Tab","Home","End"];
            if (!permitidas.includes(e.key) && !/^[0-9\s]$/.test(e.key)) e.preventDefault();
          });
          // Recorta a máximo 12 dígitos si se pega texto
          inputCelularP.addEventListener("input", function () {
            this.value = this.value.replace(/[^0-9\s]/g, "");
            const soloDigitos = this.value.replace(/\s/g, "");
            if (soloDigitos.length > 12) this.value = this.value.slice(0, this.value.length - (soloDigitos.length - 12));
          });
        }

        formPerfil.addEventListener("submit", function (e) {
          e.preventDefault();
          const nombre   = document.getElementById("perfil-nombre").value.trim();
          const email    = document.getElementById("perfil-email").value.trim();
          const celular  = document.getElementById("perfil-celular").value.trim();
          const password = document.getElementById("perfil-password").value;
          const msg      = document.getElementById("perfil-mensaje");

          /* Validaciones */
          if (!nombre) { mostrarMensaje(msg, "⚠ Por favor ingresa tu nombre completo.", "error"); return; }
          if (!email || !/^[^@]+@[^@]+\.[^@]+$/.test(email)) { mostrarMensaje(msg, "⚠ Ingresa un correo electrónico válido.", "error"); return; }
          if (celular) {
            const dig = celular.replace(/\s/g, "");
            if (dig.length > 12) { mostrarMensaje(msg, "⚠ El celular no puede tener más de 12 dígitos.", "error"); return; }
          }
          if (password && password.length < 6) { mostrarMensaje(msg, "⚠ La contraseña debe tener mínimo 6 caracteres.", "error"); return; }

          /* Guardar */
          usuario.nombre  = nombre;
          usuario.email   = email;
          usuario.celular = celular;
          if (password) usuario.password = password;
          localStorage.setItem("senabella_usuario", JSON.stringify(usuario));

          mostrarMensaje(msg, "✓ Datos guardados correctamente.", "exito");
          if (window.SenabellaToast) window.SenabellaToast("Perfil actualizado", "fa-circle-check", "exito");
          document.getElementById("perfil-password").value = "";
        });
      }, 50);

      return;
    }

    if (seccion.especial === "mis-compras") {
      try {
        const ordenesUsuario = JSON.parse(localStorage.getItem("senabella_user_orders")) || [];
        if (ordenesUsuario.length === 0) {
          contenedorCampos.innerHTML = `<p class="estado-vacio">Aún no has realizado ninguna compra.</p>`;
        } else {
          let htmlCompras = '';
          ordenesUsuario.forEach(orden => {
              let htmlProductos = '';
              if (orden.productos && orden.productos.length > 0) {
                htmlProductos = '<div style="margin-top: 10px; width: 100%;">';
                htmlProductos += '<strong style="font-size: 0.9em; display: block; margin-bottom: 8px;">Productos:</strong>';
                orden.productos.forEach(prod => {
                  htmlProductos += `
                  <div style="font-size: 0.85em; display: flex; align-items: center; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #eee;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                      <img src="${prod.imagen || '../assets/default-product.png'}" alt="${prod.nombre}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px; border: 1px solid #ddd;">
                      <span>${prod.cantidad}x ${prod.nombre}</span>
                    </div>
                    <span>$${Math.round(prod.precio).toLocaleString("es-CO")}</span>
                  </div>`;
                });
                htmlProductos += '</div>';
              }

              htmlCompras += `
                <div class="grupo-info" style="align-items: flex-start; flex-direction: column; gap: 8px; margin-bottom: 15px; border: 1px solid #eee; border-radius: 8px; padding: 15px;">
                  <div style="width: 100%; display: flex; justify-content: space-between; align-items: center;">
                    <span class="etiqueta-info">Orden: ${orden.numero}</span>
                    <span style="font-weight: bold; color: var(--color-exito, #27ae60);">${orden.total}</span>
                  </div>
                  <div class="valor-info" style="font-size: 0.9em; margin-bottom: 0;">Fecha: ${orden.fecha}</div>
                  <div class="valor-info" style="font-size: 0.9em; margin-bottom: 0;">Método: ${orden.metodoPago.toUpperCase()}</div>
                  <div class="valor-info" style="font-size: 0.9em; margin-bottom: 0;">Enviado a: ${orden.direccion}, ${orden.ciudad}</div>
                  ${htmlProductos}
                </div>
              `;
          });
          contenedorCampos.innerHTML = htmlCompras;
        }
      } catch (e) {
        contenedorCampos.innerHTML = `<p class="estado-vacio">Aún no has realizado ninguna compra.</p>`;
      }
      return;
    }

    if (seccion.especial === "datos-envio") {
      let usuario = {};
      try {
        usuario = JSON.parse(localStorage.getItem("senabella_usuario")) || {};
      } catch (e) { }

      contenedorCampos.innerHTML = `
        <form id="form-datos-envio" class="formulario" style="margin-top: 15px;">
          <div class="grupo-campo" style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; font-weight: 500;">Nombre Completo</label>
            <input type="text" id="envio-nombre" value="${usuario.nombre || ''}" readonly style="width: 100%; padding: 10px; border: 1px solid var(--color-borde); border-radius: 8px; background-color: #f9f9f9; color: #666;" title="No se puede cambiar el nombre">
          </div>
          <div class="grupo-campo" style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; font-weight: 500;">Celular de Contacto *</label>
            <input type="tel" id="envio-celular" value="${usuario.celular || ''}" placeholder="Ej. 300 123 4567" required style="width: 100%; padding: 10px; border: 1px solid var(--color-borde); border-radius: 8px;">
          </div>
          <div class="grupo-campo" style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; font-weight: 500;">Dirección de Envío *</label>
            <input type="text" id="envio-direccion" value="${usuario.direccion || ''}" placeholder="Ej. Calle 123 # 45 - 67" required style="width: 100%; padding: 10px; border: 1px solid var(--color-borde); border-radius: 8px;">
          </div>
          <div class="grupo-campo" style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 5px; font-weight: 500;">Ciudad *</label>
            <input type="text" id="envio-ciudad" value="${usuario.ciudad || ''}" placeholder="Ej. Bogotá" required style="width: 100%; padding: 10px; border: 1px solid var(--color-borde); border-radius: 8px;">
          </div>
          <button type="submit" id="btn-guardar-envio"
            style="width:100%; padding:13px; border-radius:8px;
                   background:var(--color-primario, #84b814); color:#fff;
                   border:none; font-size:1rem; font-weight:700;
                   cursor:pointer; display:flex; align-items:center;
                   justify-content:center; gap:8px; transition:opacity .2s;">
            <i class="fa-solid fa-floppy-disk"></i> Guardar datos
          </button>

          <div id="envio-mensaje" style="display:none; margin-top:14px; padding:10px 14px;
               border-radius:8px; font-size:0.9rem; font-weight:500;"></div>
        </form>
      `;

      // Event listener for the form
      setTimeout(() => {
        const formEnvio = document.getElementById("form-datos-envio");
        if (formEnvio) {

          /* --- Restricciones en tiempo real: Celular --- */
          const inputCelularE = document.getElementById("envio-celular");
          if (inputCelularE) {
            inputCelularE.addEventListener("keydown", function (e) {
              const permitidas = ["Backspace","Delete","ArrowLeft","ArrowRight","Tab","Home","End"];
              if (!permitidas.includes(e.key) && !/^[0-9\s]$/.test(e.key)) e.preventDefault();
            });
            inputCelularE.addEventListener("input", function () {
              this.value = this.value.replace(/[^0-9\s]/g, "");
              const soloDigitos = this.value.replace(/\s/g, "");
              if (soloDigitos.length > 12) this.value = this.value.slice(0, this.value.length - (soloDigitos.length - 12));
            });
          }

          /* --- Restricciones en tiempo real: Ciudad (sin números) --- */
          const inputCiudadE = document.getElementById("envio-ciudad");
          if (inputCiudadE) {
            inputCiudadE.addEventListener("keydown", function (e) {
              const permitidas = ["Backspace","Delete","ArrowLeft","ArrowRight","Tab","Home","End"," ","-"];
              if (!permitidas.includes(e.key) && /^[0-9]$/.test(e.key)) e.preventDefault();
            });
            inputCiudadE.addEventListener("input", function () {
              this.value = this.value.replace(/[0-9]/g, "");
            });
          }

          formEnvio.addEventListener("submit", function(e) {
            e.preventDefault();
            const celular   = document.getElementById("envio-celular").value.trim();
            const direccion = document.getElementById("envio-direccion").value.trim();
            const ciudad    = document.getElementById("envio-ciudad").value.trim();
            const msg       = document.getElementById("envio-mensaje");

            /* Validaciones */
            const celularLimpio = celular.replace(/\s/g, "");
            if (!celular) { mostrarMensaje(msg, "⚠ Por favor ingresa tu celular de contacto.", "error"); return; }
            if (celularLimpio.length > 12) { mostrarMensaje(msg, "⚠ El celular no puede tener más de 12 dígitos.", "error"); return; }
            if (!direccion) { mostrarMensaje(msg, "⚠ Por favor ingresa la dirección de envío.", "error"); return; }
            if (direccion.length < 8) { mostrarMensaje(msg, "⚠ La dirección debe tener al menos 8 caracteres. Ej: Calle 10 # 5-20", "error"); return; }
            if (!ciudad) { mostrarMensaje(msg, "⚠ Por favor ingresa la ciudad.", "error"); return; }
            if (ciudad.length < 3) { mostrarMensaje(msg, "⚠ Ingresa un nombre de ciudad válido.", "error"); return; }

            usuario.celular   = celularLimpio;
            usuario.direccion = direccion;
            usuario.ciudad    = ciudad;
            localStorage.setItem("senabella_usuario", JSON.stringify(usuario));

            mostrarMensaje(msg, "✓ Datos de envío guardados correctamente.", "exito");
            if (window.SenabellaToast) window.SenabellaToast("Datos de envío actualizados", "fa-circle-check", "exito");
          });
        }
      }, 50);

      return;
    }

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
