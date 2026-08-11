// ==========================================
// ANIMACIONES AL HACER SCROLL
// ==========================================

const secciones = document.querySelectorAll(
  ".parejas-info-cards, .parejas-galeria, .parejas-cta"
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
