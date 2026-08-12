// ==========================================
// CHECKOUT - SENABELLA
// ==========================================

document.addEventListener("DOMContentLoaded", function () {
  
  const contenedorProductos = document.getElementById("contenedor-productos-checkout");
  const badgeTotal = document.getElementById("badge-total-items");
  const subtotalEl = document.getElementById("resumen-subtotal");
  const totalEl = document.getElementById("resumen-total");
  const formCheckout = document.getElementById("form-checkout");
  const btnFinalizar = document.getElementById("btn-finalizar");

  // Función para parsear precio (string a número)
  function parsearPrecio(texto) {
    if (!texto) return 0;
    return parseFloat(texto.replace(/[^\d]/g, "")) || 0;
  }

  // Función para formatear precio (número a string COP)
  function formatearPrecio(numero) {
    return "$ " + Math.round(numero).toLocaleString("es-CO");
  }

  // Cargar y renderizar los productos del carrito
  function cargarResumenOrden() {
    // Obtener los items del localStorage (mismo key usado en carrito.js)
    let items;
    try {
      items = JSON.parse(localStorage.getItem("senabella_cart_db")) || [];
    } catch (e) {
      items = [];
    }

    // Filtrar solo los marcados para comprar
    let itemsComprar = items.filter(item => item.checked);

    if (itemsComprar.length === 0) {
      window.SenabellaToast("No hay productos seleccionados para comprar.", "fa-basket-shopping", "advertencia");
      setTimeout(() => {
        window.location.href = "carrito.html";
      }, 2000);
      return;
    }

    let html = "";
    let totalPrecio = 0;
    let totalCantidad = 0;

    itemsComprar.forEach(item => {
      let cant = parseInt(item.cantidad) || 1;
      let precioNum = parsearPrecio(item.precioText);
      totalPrecio += (precioNum * cant);
      totalCantidad += cant;

      html += `
        <div class="producto-checkout">
          <div class="img-producto-checkout">
            <img src="${item.img || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnaxViT3U737FB2Z2wgIYSxpYhUeo0T-NOcwgXHJPl5A&s=10'}" alt="${item.nombre}">
            <div class="cantidad-badge">${cant}</div>
          </div>
          <div class="info-producto-checkout">
            <h4>${item.nombre}</h4>
            <p>${item.marca || 'SENABELLA'} - Color: ${item.color || 'Estándar'}</p>
            <div class="precio-producto-checkout">${item.precioText}</div>
          </div>
        </div>
      `;
    });

    // Inyectar HTML
    if (contenedorProductos) contenedorProductos.innerHTML = html;
    
    // Actualizar totales
    let totalFormateado = formatearPrecio(totalPrecio);
    if (badgeTotal) badgeTotal.textContent = totalCantidad + (totalCantidad === 1 ? " item" : " items");
    if (subtotalEl) subtotalEl.textContent = totalFormateado;
    if (totalEl) totalEl.textContent = totalFormateado;

    return { totalPrecio, itemsComprar };
  }

  // Inicializar resumen
  let datosOrden = cargarResumenOrden();

  // Validación y Envío del Formulario
  if (formCheckout) {
    formCheckout.addEventListener("submit", function (e) {
      e.preventDefault();

      // Validar manualmente (además de required de HTML5)
      let direccion = document.getElementById("direccion");
      let ciudad = document.getElementById("ciudad");
      let telefono = document.getElementById("telefono");
      let valido = true;

      // Limpiar errores previos
      document.querySelectorAll(".campo-checkout input, .campo-checkout select").forEach(el => el.classList.remove("error"));
      document.querySelectorAll(".mensaje-error").forEach(el => el.style.display = "none");

      if (!direccion.value.trim()) {
        direccion.classList.add("error");
        direccion.nextElementSibling.style.display = "block";
        valido = false;
      }

      if (!ciudad.value) {
        ciudad.classList.add("error");
        ciudad.nextElementSibling.style.display = "block";
        valido = false;
      }

      if (!telefono.value.trim() || telefono.value.length < 7) {
        telefono.classList.add("error");
        telefono.nextElementSibling.style.display = "block";
        valido = false;
      }

      if (!valido) {
        window.SenabellaToast("Por favor completa correctamente los datos de envío.", "fa-triangle-exclamation", "advertencia");
        return;
      }

      // Si todo está bien, procesar orden
      if (btnFinalizar) {
        btnFinalizar.disabled = true;
        btnFinalizar.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Procesando tu orden...';
      }

      // Simular tiempo de carga de API de pagos
      setTimeout(() => {
        // Generar un número de orden aleatorio
        const numeroOrden = "SENA-" + Math.floor(100000 + Math.random() * 900000);
        
        // Obtener método de pago
        const metodoPago = document.querySelector('input[name="metodo_pago"]:checked').value;

        // Guardar detalles de la orden para la página de confirmación
        const detalleOrden = {
          numero: numeroOrden,
          fecha: new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' }),
          total: formatearPrecio(datosOrden.totalPrecio),
          metodoPago: metodoPago,
          direccion: direccion.value,
          ciudad: ciudad.value
        };

        localStorage.setItem("ultima_orden_senabella", JSON.stringify(detalleOrden));

        // Limpiar productos comprados del carrito
        try {
          let items = JSON.parse(localStorage.getItem("senabella_cart_db")) || [];
          let itemsRestantes = items.filter(item => !item.checked);
          localStorage.setItem("senabella_cart_db", JSON.stringify(itemsRestantes));
        } catch(e) {}

        // Redirigir a confirmación
        window.location.href = "confirmacion.html";
        
      }, 1500);

    });
  }

});
