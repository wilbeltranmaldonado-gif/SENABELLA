// ==========================================
// CARRITO DE COMPRAS - SENABELLA
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

  // 1. SISTEMA DE NOTIFICACIONES TOAST
  if (!window.SenabellaToast) {
    let contenedorToast = document.getElementById("contenedor-toast");
    if (!contenedorToast) {
      contenedorToast = document.createElement("div");
      contenedorToast.id = "contenedor-toast";
      document.body.appendChild(contenedorToast);
    }

    window.SenabellaToast = function (mensaje, icono, tipo) {
      let toast = document.createElement("div");
      toast.className = "toast-senabella toast-" + (tipo || "exito");
      toast.innerHTML =
        '<i class="fa-solid ' + (icono || "fa-circle-check") + '"></i>' +
        '<span>' + mensaje + '</span>' +
        '<button class="toast-cerrar"><i class="fa-solid fa-xmark"></i></button>';
      
      contenedorToast.appendChild(toast);
      setTimeout(function () { toast.classList.add("toast-visible"); }, 10);

      toast.querySelector(".toast-cerrar").addEventListener("click", function () {
        toast.classList.remove("toast-visible");
        setTimeout(function () { toast.remove(); }, 300);
      });

      setTimeout(function () {
        toast.classList.remove("toast-visible");
        setTimeout(function () { toast.remove(); }, 300);
      }, 3500);
    };
  }

  // 2. PARSEAR Y FORMATEAR MONEDA COLOMBIANA
  function parsearPrecio(texto) {
    if (!texto) return 0;
    return parseFloat(texto.replace(/[^\d]/g, "")) || 0;
  }

  function formatearPrecio(numero) {
    return "$ " + Math.round(numero).toLocaleString("es-CO");
  }

  // 3. ACTUALIZAR CONTADOR EN EL HEADER
  function actualizarContadorHeader(cantidadTotal) {
    let contador = document.querySelector(".contador-carrito");
    if (contador) {
      contador.textContent = " " + cantidadTotal + " ";
      contador.classList.add("contador-animado");
      setTimeout(function () {
        contador.classList.remove("contador-animado");
      }, 400);
    }
  }

  // 4. RECALCULAR RESUMEN DE LA ORDEN Y PRODUCTOS SELECCIONADOS
  function recalcularResumen() {
    let filas = document.querySelectorAll(".fila-producto");
    let totalPrecio = 0;
    let cantidadProductosTotal = 0;
    let cantidadProductosSeleccionados = 0;

    for (let i = 0; i < filas.length; i++) {
      let fila = filas[i];
      let check = fila.querySelector('input[type="checkbox"]');
      let precioEl = fila.querySelector(".precio-actual");
      let cantidadEl = fila.querySelector(".selector-cantidad p");

      let cantidad = cantidadEl ? (parseInt(cantidadEl.textContent) || 1) : 1;
      cantidadProductosTotal += cantidad;

      if (check && check.checked && precioEl) {
        let precio = parsearPrecio(precioEl.textContent);
        totalPrecio += precio * cantidad;
        cantidadProductosSeleccionados += cantidad;
      }
    }

    // Actualizar etiquetas de la interfaz
    let tituloCantidad = document.querySelector(".cantidad-carrito");
    let resumenSubtotalLabel = document.querySelector(".fila-resumen p");
    let precioResumen = document.querySelector(".precio-resumen");
    let precioTotal = document.querySelector(".precio-total");

    if (tituloCantidad) {
      tituloCantidad.textContent = "(" + cantidadProductosTotal + " " + (cantidadProductosTotal === 1 ? "producto" : "productos") + ")";
    }

    if (resumenSubtotalLabel) {
      resumenSubtotalLabel.textContent = "Productos (" + cantidadProductosSeleccionados + ")";
    }

    if (precioResumen) precioResumen.textContent = formatearPrecio(totalPrecio);
    if (precioTotal) precioTotal.textContent = formatearPrecio(totalPrecio);

    actualizarContadorHeader(cantidadProductosSeleccionados);
    verificarEstadoCarritoVacio();

    return totalPrecio;
  }

  // 5. CONTROL DE VISTA CARRITO VACÍO
  function verificarEstadoCarritoVacio() {
    let contenedorItems = document.getElementById("contenedor-items-carrito");
    let vistaVacio = document.getElementById("vista-carrito-vacio");
    let filas = document.querySelectorAll(".fila-producto");

    if (!contenedorItems || !vistaVacio) return;

    if (filas.length === 0) {
      contenedorItems.style.display = "none";
      vistaVacio.style.display = "block";
    } else {
      contenedorItems.style.display = "block";
      vistaVacio.style.display = "none";
    }
  }

  // 6. EVENTOS PARA CADA FILA DE PRODUCTO
  function vincularEventosFila(fila) {
    let check = fila.querySelector('input[type="checkbox"]');
    if (check) {
      check.addEventListener("change", function () {
        recalcularResumen();
      });
    }

    let selector = fila.querySelector(".selector-cantidad");
    if (selector) {
      let btnMenos = selector.querySelector("button:first-child");
      let btnMas = selector.querySelector("button:last-child");
      let numEl = selector.querySelector("p");

      if (btnMenos && numEl) {
        btnMenos.addEventListener("click", function () {
          let cant = parseInt(numEl.textContent) || 1;
          if (cant > 1) {
            numEl.textContent = cant - 1;
            recalcularResumen();
          }
        });
      }

      if (btnMas && numEl) {
        btnMas.addEventListener("click", function () {
          let cant = parseInt(numEl.textContent) || 1;
          if (cant < 20) {
            numEl.textContent = cant + 1;
            recalcularResumen();
          } else {
            window.SenabellaToast("Límite máximo de 20 unidades alcanzado", "fa-circle-info", "info");
          }
        });
      }
    }

    // Icono papelera para eliminar producto
    let iconoEliminar = fila.querySelector(".icono-opciones");
    if (iconoEliminar) {
      iconoEliminar.style.cursor = "pointer";
      iconoEliminar.title = "Eliminar producto";
      iconoEliminar.addEventListener("click", function () {
        let nombre = fila.querySelector(".nombre-producto")?.textContent.trim() || "Producto";
        fila.remove();
        recalcularResumen();
        window.SenabellaToast(nombre.substring(0, 30) + "... eliminado del carrito", "fa-trash-can", "info");
      });
    }
  }

  // Vincular eventos a filas iniciales (si existieran)
  document.querySelectorAll(".fila-producto").forEach(vincularEventosFila);

  // 7. CONTROL DEL CHECKBOX DEL VENDEDOR Y ACORDEÓN
  let checkVendedor = document.querySelector(".cabecera-vendedor input[type='checkbox']");
  if (checkVendedor) {
    checkVendedor.addEventListener("change", function () {
      let estaMarcado = checkVendedor.checked;
      document.querySelectorAll(".fila-producto input[type='checkbox']").forEach(function (chk) {
        chk.checked = estaMarcado;
      });
      recalcularResumen();
    });
  }

  let flechaVendedor = document.querySelector(".cabecera-vendedor .fa-chevron-up, .cabecera-vendedor .fa-chevron-down");
  if (flechaVendedor) {
    flechaVendedor.style.cursor = "pointer";
    flechaVendedor.addEventListener("click", function () {
      let tarjeta = flechaVendedor.closest(".tarjeta-carrito");
      let elementos = tarjeta.querySelectorAll(".fila-producto, .caja-garantia, .divisor-tarjeta");
      
      let estaVisible = flechaVendedor.classList.contains("fa-chevron-up");
      elementos.forEach(function (el) {
        el.style.display = estaVisible ? "none" : "";
      });

      flechaVendedor.classList.toggle("fa-chevron-up", !estaVisible);
      flechaVendedor.classList.toggle("fa-chevron-down", estaVisible);
    });
  }

  // 8. AGREGAR PRODUCTOS DESDE SUGERENCIAS ("¿Y SI LE SUMAS LO ÚLTIMO?")
  let botonesSugerencia = document.querySelectorAll(".tarjeta-sugerencia .boton-ver-producto");
  botonesSugerencia.forEach(function (btn) {
    btn.addEventListener("click", function () {
      let tarjetaSugerida = btn.closest(".tarjeta-sugerencia");
      if (!tarjetaSugerida) return;

      let nombre = tarjetaSugerida.querySelector(".nombre-sugerencia")?.textContent.trim() || "Producto Sugerido";
      let marca = tarjetaSugerida.querySelector(".marca-sugerencia")?.textContent.trim() || "SENABELLA";
      let precioText = tarjetaSugerida.querySelector(".precio-sugerencia")?.textContent.trim() || 
                       tarjetaSugerida.querySelector("p:not(.marca-sugerencia):not(.nombre-sugerencia):not(.precio-antiguo-pequeno)")?.textContent.trim() || "$ 199.900";
      let img = tarjetaSugerida.querySelector(".imagen-sugerencia")?.src || "";

      let contenedorItems = document.getElementById("contenedor-items-carrito");
      let vistaVacio = document.getElementById("vista-carrito-vacio");
      
      if (vistaVacio) vistaVacio.style.display = "none";
      if (contenedorItems) contenedorItems.style.display = "block";

      let tarjetaCarrito = document.querySelector(".tarjeta-carrito");
      if (!tarjetaCarrito && contenedorItems) {
        tarjetaCarrito = document.createElement("div");
        tarjetaCarrito.className = "tarjeta-carrito";
        tarjetaCarrito.innerHTML = `
          <div class="cabecera-vendedor">
            <label class="contenedor-casilla">
              <input type="checkbox" checked />
              <span class="marca-casilla"></span>
              <p class="texto-vendedor">Vendido por <strong class="nombre-vendedor">Senabella</strong></p>
            </label>
            <i class="fa-solid fa-chevron-up"></i>
          </div>
          <div class="divisor-tarjeta"></div>
          <div class="caja-garantia">
            <i class="fa-solid fa-chevron-down"></i>
          </div>
        `;
        contenedorItems.appendChild(tarjetaCarrito);
      }

      // Verificar si ya existe en el carrito
      let filasExistentes = document.querySelectorAll(".fila-producto");
      let productoExistente = null;

      filasExistentes.forEach(function (fila) {
        let nombreFila = fila.querySelector(".nombre-producto")?.textContent.trim();
        if (nombreFila === nombre) {
          productoExistente = fila;
        }
      });

      if (productoExistente) {
        let numEl = productoExistente.querySelector(".selector-cantidad p");
        if (numEl) {
          let cant = parseInt(numEl.textContent) || 1;
          numEl.textContent = cant + 1;
        }
        let check = productoExistente.querySelector('input[type="checkbox"]');
        if (check) check.checked = true;
      } else {
        // Crear nueva fila de producto
        let nuevaFila = document.createElement("div");
        nuevaFila.className = "fila-producto";
        nuevaFila.innerHTML = `
          <label class="contenedor-casilla">
            <input type="checkbox" checked />
            <span class="marca-casilla"></span>
          </label>
          <img src="${img}" alt="${nombre}" class="imagen-producto" />
          <div class="detalles-producto">
            <h3 class="nombre-producto">${nombre}</h3>
            <p class="marca-producto">${marca}</p>
            <p class="color-producto">Color: <strong>Estándar</strong></p>
          </div>
          <div class="caja-precio-producto">
            <div class="fila-precio">
              <p class="precio-actual">${precioText}</p>
            </div>
          </div>
          <div class="caja-acciones-producto">
            <i class="fa-solid fa-trash-can icono-opciones" title="Eliminar producto"></i>
            <div class="selector-cantidad">
              <button><i class="fa-solid fa-minus"></i></button>
              <p>1</p>
              <button><i class="fa-solid fa-plus"></i></button>
            </div>
          </div>
        `;

        let cajaGarantia = tarjetaCarrito.querySelector(".caja-garantia");
        if (cajaGarantia) {
          tarjetaCarrito.insertBefore(nuevaFila, cajaGarantia);
          let divisor = document.createElement("div");
          divisor.className = "divisor-tarjeta";
          tarjetaCarrito.insertBefore(divisor, cajaGarantia);
        } else {
          tarjetaCarrito.appendChild(nuevaFila);
        }

        vincularEventosFila(nuevaFila);
      }

      // Marcar checkbox del vendedor si se agrega producto
      if (checkVendedor) checkVendedor.checked = true;

      // Animación en el botón de la sugerencia
      let textoOriginal = btn.textContent;
      btn.innerHTML = '<i class="fa-solid fa-check"></i> ¡Agregado!';
      btn.style.backgroundColor = "#aad100";
      btn.style.color = "#222";

      setTimeout(function () {
        btn.textContent = textoOriginal;
        btn.style.backgroundColor = "";
        btn.style.color = "";
      }, 1500);

      recalcularResumen();
      window.SenabellaToast(nombre + " agregado al carrito", "fa-cart-plus", "exito");
    });
  });

  // 9. PROCESO DE COMPRA (BOTÓN CONTINUAR COMPRA / PAGAR)
  let botonPagar = document.querySelector(".tarjeta-resumen .boton-pagar") || document.querySelector(".boton-pagar");
  if (botonPagar) {
    botonPagar.addEventListener("click", function (e) {
      e.preventDefault();
      let total = recalcularResumen();
      let filas = document.querySelectorAll(".fila-producto");

      if (filas.length === 0) {
        window.SenabellaToast("Tu carrito está vacío. Agrega productos para continuar.", "fa-basket-shopping", "advertencia");
        return;
      }

      if (total <= 0) {
        window.SenabellaToast("Selecciona al menos un producto para continuar la compra", "fa-triangle-exclamation", "advertencia");
        return;
      }

      botonPagar.disabled = true;
      let textoOriginal = botonPagar.textContent;
      botonPagar.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Procesando compra...';

      setTimeout(function () {
        botonPagar.innerHTML = '<i class="fa-solid fa-circle-check"></i> ¡Compra Exitosa!';
        botonPagar.style.backgroundColor = "#aad100";
        botonPagar.style.color = "#222";

        window.SenabellaToast("¡Tu pedido se ha procesado con éxito!", "fa-circle-check", "exito");

        setTimeout(function () {
          // Eliminar los productos comprados que estaban seleccionados
          document.querySelectorAll(".fila-producto").forEach(function (fila) {
            let check = fila.querySelector('input[type="checkbox"]');
            if (check && check.checked) {
              fila.remove();
            }
          });

          recalcularResumen();
          botonPagar.disabled = false;
          botonPagar.textContent = textoOriginal;
          botonPagar.style.backgroundColor = "";
          botonPagar.style.color = "";
        }, 2000);
      }, 1200);
    });
  }

  // INICIALIZAR ESTADO AL CARGAR
  recalcularResumen();
});