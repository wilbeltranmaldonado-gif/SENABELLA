// ==========================================
// ANIMACIONES AL HACER SCROLL
// ==========================================

const secciones = document.querySelectorAll(
  ".parejas-info-cards, .parejas-galeria, .productos-parejas, .parejas-cta"
);

// Agregar clase inicial para ocultar
secciones.forEach(function (seccion) {
  seccion.style.opacity = "0";
  seccion.style.transform = "translateY(30px)";
  seccion.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
});

// Observer para animar cuando se ven en pantalla
const observer = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

secciones.forEach(function (seccion) {
  observer.observe(seccion);
});

// ==========================================
// SCROLL SUAVE AL HACER CLIC EN "EXPLORAR"
// ==========================================

const botonExplorar = document.querySelector(".boton-hero");

if (botonExplorar) {
  botonExplorar.addEventListener("click", function (e) {
    const destino = document.querySelector("#catalogo-parejas");
    if (destino) {
      e.preventDefault();
      destino.scrollIntoView({ behavior: "smooth" });
    }
  });
}

// ==========================================
// AGREGAR AL CARRITO
// ==========================================
document.addEventListener("DOMContentLoaded", function () {
  const botonesCarrito = document.querySelectorAll(".btn-agregar-carrito");

  botonesCarrito.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      const card = btn.closest(".card");
      if (!card) return;

      const nombre = card.querySelector(".card-title").textContent.trim();
      const precio = card.querySelector(".card-text").textContent.trim();
      const img = card.querySelector("img") ? card.querySelector("img").src : "";

      if (window.SenabellaCart) {
        window.SenabellaCart.agregarProducto({
          nombre: nombre,
          marca: "SENABELLA",
          color: "Único",
          precioText: precio,
          img: img,
          cantidad: 1
        });
      }

      // Feedback visual en el botón
      const btnOriginalText = btn.innerHTML;
      btn.innerHTML = '<i class="fa-solid fa-check"></i> Agregado';
      btn.style.background = "linear-gradient(135deg, #27ae60, #2ecc71)";
      btn.style.color = "#ffffff";

      setTimeout(function () {
        btn.innerHTML = btnOriginalText;
        btn.style.background = "";
        btn.style.color = "";
      }, 1500);

      // Si existe el sistema de Toasts (opcional)
      if (window.SenabellaToast) {
        window.SenabellaToast(nombre + " agregado al carrito", "fa-cart-shopping", "exito");
      }
    });
  });
});
