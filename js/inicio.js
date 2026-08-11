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

    
    // Reiniciar al cambiar de imagen
    carrusel.addEventListener("slide.bs.carousel", function () {
      barra.style.transition = "none";
      barra.style.width = "0%";
      setTimeout(function () {
        barra.style.transition = "width 5s linear";
        barra.style.width = "100%";
      }, 50);
    });
  }

  // 2. Efecto de inclinación / elevación en tarjetas
  let tarjetas = document.querySelectorAll(".row-cols-2 .col > div, .card");
  for (let i = 0; i < tarjetas.length; i++) {
    let tarjeta = tarjetas[i];
    tarjeta.style.transition = "transform 0.2s";

    tarjeta.addEventListener("mousemove", function () {
      tarjeta.style.transform = "translateY(-5px)";
    });

    tarjeta.addEventListener("mouseleave", function () {
      tarjeta.style.transform = "translateY(0px)";
    });
  }

  

  // 4. Mover botón "Ver catálogo" al pasar el ratón
  let botonCatalogo = document.querySelector('a[href="catalogo.html"].btn');
  if (botonCatalogo) {
    botonCatalogo.style.transition = "transform 0.25s";

    botonCatalogo.addEventListener("mouseenter", function () {
      botonCatalogo.style.transform = "translateX(4px)";
    });

    botonCatalogo.addEventListener("mouseleave", function () {
      botonCatalogo.style.transform = "translateX(0px)";
    });
  }

});