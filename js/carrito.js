document.addEventListener("DOMContentLoaded", function () {

  // 1. Convertir texto a número
  function parsearPrecio(texto) {
    return parseFloat(texto.replace(/[^\d]/g, "")) || 0;
  }

  // 2. Formatear número a moneda colombiana
  function formatearPrecio(numero) {
    return "$ " + numero.toLocaleString("es-CO");
  }

  // 3. Recalcular el total y la cantidad de productos
  function recalcularResumen() {
    let filas = document.querySelectorAll(".fila-producto");
    let total = 0;
    let cantidadProductos = 0;

    for (let i = 0; i < filas.length; i++) {
      let fila = filas[i];
      let check = fila.querySelector('input[type="checkbox"]');
      let precioEl = fila.querySelector(".precio-actual");
      let cantidadEl = fila.querySelector(".selector-cantidad p");

      if (check && check.checked && precioEl && cantidadEl) {
        let precio = parsearPrecio(precioEl.textContent);
        let cantidad = parseInt(cantidadEl.textContent) || 1;
        total += precio * cantidad;
        cantidadProductos += cantidad;
      }
    }

    let resumen = document.querySelector(".fila-resumen p");
    let precioResumen = document.querySelector(".precio-resumen");
    let precioTotal = document.querySelector(".precio-total");
    let cantidadTitulo = document.querySelector(".cantidad-carrito");

    if (resumen) resumen.textContent = "Productos (" + cantidadProductos + ")";
    if (precioResumen) precioResumen.textContent = formatearPrecio(total);
    if (precioTotal) precioTotal.textContent = formatearPrecio(total);
    if (cantidadTitulo) cantidadTitulo.textContent = "(" + cantidadProductos + " productos)";

    if (window.SenabellaCart) window.SenabellaCart.set(cantidadProductos);
    return total;
  }

  // 4. Configurar botones de aumentar (+) y disminuir (-)
  let filas = document.querySelectorAll(".fila-producto");
  for (let i = 0; i < filas.length; i++) {
    let fila = filas[i];
    let selector = fila.querySelector(".selector-cantidad");
    if (!selector) continue;

    let botones = selector.children; // [btnMenos, texto, btnMas]
    
    botones[0].addEventListener("click", function () {
      let n = parseInt(botones[1].textContent) || 1;
      if (n > 1) n--;
      botones[1].textContent = n;
      recalcularResumen();
    });

    botones[2].addEventListener("click", function () {
      let n = parseInt(botones[1].textContent) || 1;
      if (n < 20) n++;
      botones[1].textContent = n;
      recalcularResumen();
    });
  }


  // 5. Eliminar producto del carrito
  let iconos = document.querySelectorAll(".icono-opciones");
  for (let i = 0; i < iconos.length; i++) {
    iconos[i].style.cursor = "pointer";
    iconos[i].addEventListener("click", function () {
      let fila = iconos[i].closest(".fila-producto");
      if (fila) {
        fila.remove();
        recalcularResumen();
      }
    });
  }


  // 6. Botón Continuar Compra / Pagar
  let botonPagar = document.querySelector(".boton-pagar");
  if (botonPagar) {
    botonPagar.addEventListener("click", function () {
      let total = recalcularResumen();
      if (total <= 0) {
        if (window.SenabellaToast) {
          window.SenabellaToast("Selecciona al menos un producto", "fa-triangle-exclamation");
        }
        return;
      }

      botonPagar.disabled = true;
      let textoOriginal = botonPagar.textContent;
      botonPagar.textContent = "Procesando…";

      setTimeout(function () {
        botonPagar.textContent = "¡Compra confirmada!";
        if (window.SenabellaToast) {
          window.SenabellaToast("Compra confirmada con éxito", "fa-circle-check");
        }
        setTimeout(function () {
          botonPagar.disabled = false;
          botonPagar.textContent = textoOriginal;
        }, 2200);
      }, 900);
    });
  }

  // Ejecución inicial del cálculo
  recalcularResumen();
});