document.addEventListener("DOMContentLoaded", function () {


  // 2. Slider horizontal de marcas
  let contenedorBotones = document.querySelector(".botones");
  let flecha = document.querySelector(".boton-flecha");

  if (contenedorBotones && flecha) {
    contenedorBotones.style.scrollBehavior = "smooth";
    flecha.addEventListener("click", function () {
      contenedorBotones.scrollLeft += 220;
    });
  }

  // Resaltar marca seleccionada
  let botonesMarca = document.querySelectorAll(".botones button");
  for (let i = 0; i < botonesMarca.length; i++) {
    botonesMarca[i].addEventListener("click", function () {
      for (let j = 0; j < botonesMarca.length; j++) {
        botonesMarca[j].classList.remove("sn-activo");
        botonesMarca[j].style.background = "";
        botonesMarca[j].style.color = "";
      }
      this.classList.add("sn-activo");
      this.style.background = "#84b814";
      this.style.color = "#fff";

      if (window.SenabellaToast) {
        window.SenabellaToast("Filtrando por " + this.textContent.trim(), "fa-tag");
      }
    });
  }

  // 3. Ordenar productos por precio
  let selectOrden = document.querySelector(".opciones-recomendacion");
  let gridProductos = document.querySelector(".tarjeta-producto");

  if (selectOrden && gridProductos) {
    selectOrden.addEventListener("change", function () {
      let tarjetas = Array.from(gridProductos.querySelectorAll(".tar-producto"));

      tarjetas.sort(function (a, b) {
        let precioAEl = a.querySelector(".precio");
        let precioBEl = b.querySelector(".precio");

        let textoA = precioAEl ? precioAEl.textContent : "0";
        let textoB = precioBEl ? precioBEl.textContent : "0";

        let numA = parseFloat(textoA.replace(/[^\d]/g, "")) || 0;
        let numB = parseFloat(textoB.replace(/[^\d]/g, "")) || 0;

        if (selectOrden.value === "Menor precio") {
          return numA - numB;
        } else if (selectOrden.value === "Mayor precio") {
          return numB - numA;
        }
        return 0;
      });

      for (let i = 0; i < tarjetas.length; i++) {
        gridProductos.appendChild(tarjetas[i]);
      }

      if (window.SenabellaToast) {
        window.SenabellaToast("Orden aplicado: " + selectOrden.value, "fa-arrow-down-wide-short");
      }
    });
  }

  // 4. Guardar datos del producto al hacer clic y redirigir a detalle_producto.html
  let productos = document.querySelectorAll(".tar-producto");

  productos.forEach(function (producto) {
    producto.addEventListener("click", function (e) {
      // Evitar que el clic en el botón de favorito dispare la redirección
      if (e.target.classList.contains("favorite-btn")) return;

      let marca = producto.querySelector(".nom-producto") ? producto.querySelector(".nom-producto").textContent.trim() : "";
      let descripcion = producto.querySelector(".descripcion") ? producto.querySelector(".descripcion").textContent.trim() : "";
      let imagen = producto.querySelector("img") ? producto.querySelector("img").src : "";
      let precioEl = producto.querySelector(".precio");
      let precioActual = precioEl ? (precioEl.childNodes[0] ? precioEl.childNodes[0].textContent.trim() : precioEl.textContent.trim()) : "";
      let precioAntiguo = producto.querySelector(".precio-secundario1") ? producto.querySelector(".precio-secundario1").textContent.trim() : "";
      let referencia = producto.querySelector(".referencia") ? producto.querySelector(".referencia").textContent.trim() : "";

      let datosProducto = {
        marca: marca,
        titulo: marca + " " + descripcion,
        descripcion: descripcion,
        imagen: imagen,
        precioActual: precioActual,
        precioAntiguo: precioAntiguo,
        referencia: referencia
      };

      localStorage.setItem("productoSeleccionado", JSON.stringify(datosProducto));
    });
  });
});
