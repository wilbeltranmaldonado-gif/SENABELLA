document.addEventListener("DOMContentLoaded", function () {

  // 1. Elementos y datos
  let productos = Array.from(document.querySelectorAll(".tar-producto"));
  let gridProductos = document.querySelector(".tarjeta-producto");
  let numResultados = document.querySelector(".resultados");

  let filtroMarcaButtons = document.querySelectorAll(".filtro-marca .botones button");
  let categoriasCirculares = document.querySelectorAll(".categorias-circulares .categoria");
  let categoriasLista = document.querySelectorAll(".categorias-lista .categoria-lis");
  let marcasListaMenu = document.querySelectorAll(".menu_lateral .filtro"); // Filtros del menu lateral
  let paginacionNumeros = document.querySelectorAll(".num-pagina span.pag-2");
  let paginacionFlechaIzq = document.querySelector(".num-pagina .fa-chevron-left");
  let paginacionFlechaDer = document.querySelector(".num-pagina .fa-chevron-right");
  let selectOrden = document.querySelector(".opciones-recomendacion");

  let estadoFiltro = {
    marca: "",
    categoria: "",
    busqueda: "",
    paginaActual: 1
  };

  // 2. Slider horizontal de marcas (Botón Flecha)
  let contenedorBotones = document.querySelector(".botones");
  let flecha = document.querySelector(".boton-flecha");

  if (contenedorBotones && flecha) {
    contenedorBotones.style.scrollBehavior = "smooth";
    flecha.addEventListener("click", function () {
      contenedorBotones.scrollLeft += 220;
    });
  }

  // 3. Función principal de filtrado y actualización
  function aplicarFiltros() {
    let productosVisibles = 0;

    productos.forEach(function (tarjeta) {
      let nomMarcaEl = tarjeta.querySelector(".nom-producto");
      let descEl = tarjeta.querySelector(".descripcion");

      let marcaTexto = nomMarcaEl ? nomMarcaEl.textContent.trim().toUpperCase() : "";
      let descTexto = descEl ? descEl.textContent.trim().toLowerCase() : "";

      let cumpleMarca = !estadoFiltro.marca || marcaTexto === estadoFiltro.marca;
      let cumpleCategoria = !estadoFiltro.categoria || descTexto.includes(estadoFiltro.categoria.toLowerCase());

      if (cumpleMarca && cumpleCategoria) {
        tarjeta.style.display = "block";
        productosVisibles++;
      } else {
        tarjeta.style.display = "none";
      }
    });

    if (numResultados) {
      numResultados.textContent = "Resultados (" + productosVisibles + ")";
    }

    if (window.SenabellaToast && (estadoFiltro.marca || estadoFiltro.categoria)) {
      let msg = "Filtrando por: " + (estadoFiltro.marca || estadoFiltro.categoria);
      window.SenabellaToast(msg, "fa-filter");
    }
  }

  // 4. Filtros de Marcas superiores (Botones de Marca)
  filtroMarcaButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      let marcaSeleccionada = this.textContent.trim().toUpperCase();

      if (this.classList.contains("sn-activo")) {
        this.classList.remove("sn-activo");
        this.style.background = "";
        this.style.color = "";
        estadoFiltro.marca = "";
      } else {
        filtroMarcaButtons.forEach(function (b) {
          b.classList.remove("sn-activo");
          b.style.background = "";
          b.style.color = "";
        });
        this.classList.add("sn-activo");
        this.style.background = "#84b814";
        this.style.color = "#fff";
        estadoFiltro.marca = marcaSeleccionada;
      }
      aplicarFiltros();
    });
  });

  // 5. Botones Circulares Superiores (Categorías circulares)
  categoriasCirculares.forEach(function (cat) {
    cat.style.cursor = "pointer";
    cat.addEventListener("click", function () {
      let titulo = this.querySelector(".titulo-cat") ? this.querySelector(".titulo-cat").textContent.trim() : "";
      
      let yaActivo = this.classList.contains("circulo-activo");

      categoriasCirculares.forEach(function (c) {
        c.classList.remove("circulo-activo");
        c.style.transform = "";
        c.style.borderColor = "";
      });

      if (!yaActivo) {
        this.classList.add("circulo-activo");
        this.style.transform = "scale(1.08)";
        let imgDiv = this.querySelector(".imagen-cat");
        if (imgDiv) imgDiv.style.border = "2px solid #84b814";

        // Mapear algunos nombres clave para filtrar la descripción
        if (titulo.toLowerCase().includes("portátiles")) estadoFiltro.categoria = "portátil";
        else if (titulo.toLowerCase().includes("impresoras")) estadoFiltro.categoria = "impresora";
        else if (titulo.toLowerCase().includes("tablets")) estadoFiltro.categoria = "tablet";
        else if (titulo.toLowerCase().includes("almacenamiento")) estadoFiltro.categoria = "disco";
        else estadoFiltro.categoria = titulo.split(" ")[0];
      } else {
        estadoFiltro.categoria = "";
      }

      aplicarFiltros();
    });
  });

  // 6. Botones del menú lateral izquierdo (Categorías y Filtros acordeón)
  categoriasLista.forEach(function (catItem) {
    catItem.style.cursor = "pointer";
    catItem.addEventListener("click", function () {
      let textoCat = this.textContent.trim();
      let yaActiva = this.classList.contains("cat-lista-activa");

      categoriasLista.forEach(function (c) {
        c.classList.remove("cat-lista-activa");
        c.style.fontWeight = "normal";
        c.style.color = "";
      });

      if (!yaActiva) {
        this.classList.add("cat-lista-activa");
        this.style.fontWeight = "bold";
        this.style.color = "#84b814";

        if (textoCat.toLowerCase().includes("portátiles")) estadoFiltro.categoria = "portátil";
        else if (textoCat.toLowerCase().includes("impresoras")) estadoFiltro.categoria = "impresora";
        else if (textoCat.toLowerCase().includes("tablets")) estadoFiltro.categoria = "tablet";
        else estadoFiltro.categoria = textoCat.split(" ")[0];
      } else {
        estadoFiltro.categoria = "";
      }

      aplicarFiltros();
    });
  });

  // Acordeón interactivo para los desplegables de la izquierda
  let desplegablesIzquierda = document.querySelectorAll(".menu_lateral .filtro1");
  desplegablesIzquierda.forEach(function (headerFiltro) {
    headerFiltro.style.cursor = "pointer";
    headerFiltro.addEventListener("click", function () {
      let contenedorPadre = this.closest(".filtro");
      let icono = this.querySelector("i");
      let contenidoOculto = contenedorPadre.querySelectorAll(".opcion-domicilio, .info-entrega, .categorias-lista");

      if (contenidoOculto.length > 0) {
        let estaVisible = contenidoOculto[0].style.display !== "none";
        contenidoOculto.forEach(function (el) {
          el.style.display = estaVisible ? "none" : "";
        });
        if (icono) {
          icono.classList.toggle("fa-chevron-up", !estaVisible);
          icono.classList.toggle("fa-chevron-down", estaVisible);
        }
      }
    });
  });

  // 7. Paginación de Productos (Cambiar de página)
  paginacionNumeros.forEach(function (pagBtn) {
    pagBtn.style.cursor = "pointer";
    pagBtn.addEventListener("click", function () {
      let numPag = parseInt(this.textContent.trim());
      if (!isNaN(numPag)) {
        cambiarPagina(numPag);
      }
    });
  });

  if (paginacionFlechaIzq) {
    paginacionFlechaIzq.style.cursor = "pointer";
    paginacionFlechaIzq.addEventListener("click", function () {
      if (estadoFiltro.paginaActual > 1) {
        cambiarPagina(estadoFiltro.paginaActual - 1);
      }
    });
  }

  if (paginacionFlechaDer) {
    paginacionFlechaDer.style.cursor = "pointer";
    paginacionFlechaDer.addEventListener("click", function () {
      if (estadoFiltro.paginaActual < 3) {
        cambiarPagina(estadoFiltro.paginaActual + 1);
      }
    });
  }

  function cambiarPagina(numPag) {
    estadoFiltro.paginaActual = numPag;

    paginacionNumeros.forEach(function (span) {
      if (parseInt(span.textContent.trim()) === numPag) {
        span.classList.add("active");
        span.style.fontWeight = "bold";
        span.style.color = "#84b814";
      } else {
        span.classList.remove("active");
        span.style.fontWeight = "normal";
        span.style.color = "";
      }
    });

    // Simular el cambio de página filtrando u ordenando ligeramente los productos
    if (window.SenabellaToast) {
      window.SenabellaToast("Página " + numPag + " cargada", "fa-file-lines");
    }

    gridProductos.scrollIntoView({ behavior: "smooth" });
  }

  // 8. Ordenar productos por precio (Recomendados, Menor, Mayor)
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

      tarjetas.forEach(function (t) {
        gridProductos.appendChild(t);
      });

      if (window.SenabellaToast) {
        window.SenabellaToast("Orden aplicado: " + selectOrden.value, "fa-arrow-down-wide-short");
      }
    });
  }

  // 9. Botón Favoritos en las tarjetas
  let favButtons = document.querySelectorAll(".favorite-btn");
  favButtons.forEach(function (btn) {
    btn.style.cursor = "pointer";
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      let esFav = this.classList.contains("fa-regular");
      this.classList.toggle("fa-regular", !esFav);
      this.classList.toggle("fa-solid", esFav);
      this.style.color = esFav ? "#e63946" : "";

      if (window.SenabellaToast) {
        window.SenabellaToast(esFav ? "Agregado a tus favoritos" : "Eliminado de favoritos", esFav ? "fa-heart" : "fa-heart-crack");
      }
    });
  });

});
