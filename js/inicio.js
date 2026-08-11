document.addEventListener("DOMContentLoaded", function () {

  // 1. Barra de progreso para el carrusel
  let carrusel = document.querySelector("#bannerCarousel");
  if (carrusel) {
    let barra = document.createElement("div");
    barra.style.position = "absolute";
    barra.style.bottom = "0";
    barra.style.left = "0";
    barra.style.height = "4px";
    barra.style.width = "0%";
    barra.style.backgroundColor = "#84b814";
    barra.style.zIndex = "5";
    barra.style.transition = "width 5s linear";

    carrusel.style.position = "relative";
    carrusel.appendChild(barra);

    setTimeout(function () {
      barra.style.width = "100%";
    }, 100);

    carrusel.addEventListener("slide.bs.carousel", function () {
      barra.style.transition = "none";
      barra.style.width = "0%";
      setTimeout(function () {
        barra.style.transition = "width 5s linear";
        barra.style.width = "100%";
      }, 50);
    });
  }

  // 2. Sistema de Notificaciones Toast
  let contenedorToast = document.createElement("div");
  contenedorToast.id = "contenedor-toast";
  document.body.appendChild(contenedorToast);

  function mostrarToast(mensaje, icono, tipo) {
    let toast = document.createElement("div");
    toast.className = "toast-senabella toast-" + (tipo || "exito");
    toast.innerHTML = `
      <i class="fa-solid ${icono || 'fa-circle-check'}"></i>
      <span>${mensaje}</span>
      <button class="toast-cerrar"><i class="fa-solid fa-xmark"></i></button>
    `;

    contenedorToast.appendChild(toast);

    setTimeout(function () {
      toast.classList.add("toast-visible");
    }, 10);

    toast.querySelector(".toast-cerrar").addEventListener("click", function () {
      toast.classList.remove("toast-visible");
      setTimeout(function () { toast.remove(); }, 300);
    });

    setTimeout(function () {
      toast.classList.remove("toast-visible");
      setTimeout(function () { toast.remove(); }, 300);
    }, 3500);
  }
  window.SenabellaToast = mostrarToast;

  // 3. Categorías Clickeables
  let categorias = document.querySelectorAll(".categorias-inicio .col > div");
  for (let i = 0; i < categorias.length; i++) {
    categorias[i].addEventListener("click", function () {
      let nombre = categorias[i].getAttribute("data-categoria");
      let yaActiva = categorias[i].classList.contains("categoria-activa");

      for (let j = 0; j < categorias.length; j++) {
        categorias[j].classList.remove("categoria-activa");
      }

      if (!yaActiva) {
        categorias[i].classList.add("categoria-activa");
        filtrarPorCategoria(nombre);
        mostrarToast("Filtrando por: " + nombre.toUpperCase(), "fa-filter", "info");
      } else {
        filtrarPorCategoria("");
      }
    });
  }

  function filtrarPorCategoria(cat) {
    let cols = document.querySelectorAll(".productos-grid .col");
    for (let i = 0; i < cols.length; i++) {
      let card = cols[i].querySelector(".card");
      let catData = cols[i].getAttribute("data-categoria") || "";

      if (!cat || catData.indexOf(cat) !== -1) {
        cols[i].style.display = "";
        card.style.opacity = "1";
        card.style.transform = "scale(1)";
      } else {
        card.style.opacity = "0.3";
        card.style.transform = "scale(0.95)";
      }
    }
  }

  // 4. Botones de Acción en Tarjetas (Carrito y Favorito)
  let tarjetas = document.querySelectorAll(".productos-grid .card");
  for (let i = 0; i < tarjetas.length; i++) {
    let card = tarjetas[i];
    let acciones = document.createElement("div");
    acciones.className = "acciones-producto";

    let btnCarrito = document.createElement("button");
    btnCarrito.className = "btn-agregar-carrito";
    btnCarrito.innerHTML = '<i class="fa-solid fa-cart-plus"></i> Agregar';
    btnCarrito.addEventListener("click", function (e) {
      e.stopPropagation();
      let nombre = card.querySelector(".card-title").textContent.trim();
      let precio = card.querySelector(".card-text").textContent.trim();

      btnCarrito.innerHTML = '<i class="fa-solid fa-check"></i> Agregado';
      btnCarrito.classList.add("btn-agregado");
      setTimeout(function () {
        btnCarrito.innerHTML = '<i class="fa-solid fa-cart-plus"></i> Agregar';
        btnCarrito.classList.remove("btn-agregado");
      }, 1500);

      let contador = document.querySelector(".contador-carrito");
      if (contador) {
        let num = (parseInt(contador.textContent.trim()) || 0) + 1;
        contador.textContent = " " + num + " ";
        contador.classList.add("contador-animado");
        setTimeout(function () {
          contador.classList.remove("contador-animado");
        }, 400);
      }
      mostrarToast(nombre + " agregado al carrito - " + precio, "fa-cart-shopping", "exito");
    });

    let btnFav = document.createElement("button");
    btnFav.className = "btn-favorito";
    btnFav.innerHTML = '<i class="fa-regular fa-heart"></i>';
    btnFav.addEventListener("click", function (e) {
      e.stopPropagation();
      let ic = btnFav.querySelector("i");
      let esFav = ic.classList.contains("fa-regular");

      ic.classList.toggle("fa-regular", !esFav);
      ic.classList.toggle("fa-solid", esFav);
      btnFav.classList.toggle("favorito-activo", esFav);
      mostrarToast(esFav ? "Agregado a favoritos" : "Eliminado de favoritos", esFav ? "fa-heart" : "fa-heart-crack", esFav ? "exito" : "info");
    });

    acciones.appendChild(btnCarrito);
    acciones.appendChild(btnFav);
    card.querySelector(".card-body").appendChild(acciones);

    card.addEventListener("click", function () {
      abrirVistaRapida(card);
    });
  }

  // 5. Modal de Vista Rápida
  let modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.innerHTML = `
    <div class="modal-contenido">
      <button class="modal-cerrar"><i class="fa-solid fa-xmark"></i></button>
      <div class="modal-cuerpo">
        <div class="modal-imagen"></div>
        <div class="modal-info">
          <h2 class="modal-nombre"></h2>
          <p class="modal-precio"></p>
          <div class="modal-rating">
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star-half-stroke"></i>
            <span class="modal-rating-text">4.5 (128 reseñas)</span>
          </div>
          <p class="modal-descripcion">Producto de alta calidad disponible en Senabella. Envío gratis a todo Colombia.</p>
          <div class="modal-cantidad">
            <label>Cantidad:</label>
            <div class="modal-selector-cantidad">
              <button class="modal-btn-menos">−</button>
              <span class="modal-num-cantidad">1</span>
              <button class="modal-btn-mas">+</button>
            </div>
          </div>
          <div class="modal-acciones">
            <button class="modal-btn-carrito"><i class="fa-solid fa-cart-plus"></i> Agregar al carrito</button>
            <button class="modal-btn-comprar"><i class="fa-solid fa-bolt"></i> Comprar ahora</button>
          </div>
          <div class="modal-beneficios">
            <div><i class="fa-solid fa-truck-fast"></i> Envío gratis</div>
            <div><i class="fa-solid fa-shield-halved"></i> Compra protegida</div>
            <div><i class="fa-solid fa-rotate-left"></i> Devolución gratis</div>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  let numCant = modal.querySelector(".modal-num-cantidad");
  modal.querySelector(".modal-cerrar").addEventListener("click", cerrarModal);
  modal.addEventListener("click", function (e) {
    if (e.target === modal) cerrarModal();
  });

  modal.querySelector(".modal-btn-menos").addEventListener("click", function () {
    let n = parseInt(numCant.textContent) || 1;
    if (n > 1) numCant.textContent = n - 1;
  });

  modal.querySelector(".modal-btn-mas").addEventListener("click", function () {
    let n = parseInt(numCant.textContent) || 1;
    if (n < 20) numCant.textContent = n + 1;
  });

  modal.querySelector(".modal-btn-carrito").addEventListener("click", function () {
    let nombre = modal.querySelector(".modal-nombre").textContent;
    let cant = parseInt(numCant.textContent) || 1;
    let contador = document.querySelector(".contador-carrito");
    if (contador) {
      let num = (parseInt(contador.textContent.trim()) || 0) + cant;
      contador.textContent = " " + num + " ";
    }
    mostrarToast(cant + "x " + nombre + " agregado(s)", "fa-cart-shopping", "exito");
    cerrarModal();
  });

  modal.querySelector(".modal-btn-comprar").addEventListener("click", function () {
    mostrarToast("Redirigiendo al checkout", "fa-bolt", "info");
    cerrarModal();
  });

  function abrirVistaRapida(card) {
    let img = card.querySelector("img");
    modal.querySelector(".modal-imagen").innerHTML = '<img src="' + img.src + '" alt="' + img.alt + '">';
    modal.querySelector(".modal-nombre").textContent = card.querySelector(".card-title").textContent.trim();
    modal.querySelector(".modal-precio").textContent = card.querySelector(".card-text").textContent.trim();
    numCant.textContent = "1";
    modal.classList.add("modal-visible");
    document.body.style.overflow = "hidden";
  }

  function cerrarModal() {
    modal.classList.remove("modal-visible");
    document.body.style.overflow = "";
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") cerrarModal();
  });

  // 6. Animación al Hacer Scroll
  let animados = document.querySelectorAll(".productos-grid .col, .promos-grid .col");
  for (let i = 0; i < animados.length; i++) {
    animados[i].classList.add("elemento-animado");
    animados[i].style.transitionDelay = (i * 0.06) + "s";
  }

  function verificarScroll() {
    let els = document.querySelectorAll(".seccion-animada, .elemento-animado");
    for (let i = 0; i < els.length; i++) {
      if (els[i].getBoundingClientRect().top < window.innerHeight * 0.88) {
        els[i].classList.add("animado");
      }
    }
  }
  window.addEventListener("scroll", verificarScroll);
  verificarScroll();

  // 7. Búsqueda en el Header
  let inputBusq = document.querySelector(".entrada-busqueda");
  let btnBusq = document.querySelector(".boton-busqueda");
  if (inputBusq && btnBusq) {
    function buscar() {
      let t = inputBusq.value.trim().toLowerCase();
      let cols = document.querySelectorAll(".productos-grid .col");

      if (!t) {
        for (let i = 0; i < cols.length; i++) cols[i].style.display = "";
        return;
      }

      let enc = 0;
      for (let i = 0; i < cols.length; i++) {
        if (cols[i].textContent.toLowerCase().indexOf(t) !== -1) {
          cols[i].style.display = "";
          enc++;
        } else {
          cols[i].style.display = "none";
        }
      }
      mostrarToast(enc ? enc + " producto(s) encontrado(s)" : "Sin resultados para: " + t, "fa-magnifying-glass", enc ? "info" : "advertencia");
      let grid = document.querySelector(".productos-grid");
      if (grid) grid.scrollIntoView({ behavior: "smooth" });
    }

    btnBusq.addEventListener("click", buscar);
    inputBusq.addEventListener("keydown", function (e) {
      if (e.key === "Enter") buscar();
    });
    inputBusq.addEventListener("input", function () {
      if (!inputBusq.value.trim()) {
        let c = document.querySelectorAll(".productos-grid .col");
        for (let i = 0; i < c.length; i++) c[i].style.display = "";
      }
    });
  }

  // 8. Lightbox para Promociones
  let lightbox = document.createElement("div");
  lightbox.className = "lightbox-overlay";
  lightbox.innerHTML = `
    <div class="lightbox-contenido">
      <button class="lightbox-cerrar"><i class="fa-solid fa-xmark"></i></button>
      <img src="" alt="" class="lightbox-img">
    </div>
  `;
  document.body.appendChild(lightbox);

  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox || e.target.closest(".lightbox-cerrar")) {
      lightbox.classList.remove("lightbox-visible");
    }
  });

  let promoImgs = document.querySelectorAll(".promos-grid img");
  for (let i = 0; i < promoImgs.length; i++) {
    promoImgs[i].addEventListener("click", function () {
      lightbox.querySelector(".lightbox-img").src = promoImgs[i].src;
      lightbox.classList.add("lightbox-visible");
    });
  }

  // 9. Botón Volver Arriba
  let btnUp = document.createElement("button");
  btnUp.id = "btn-volver-arriba";
  btnUp.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
  document.body.appendChild(btnUp);

  window.addEventListener("scroll", function () {
    btnUp.classList.toggle("btn-arriba-visible", window.scrollY > 400);
  });
  btnUp.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

});