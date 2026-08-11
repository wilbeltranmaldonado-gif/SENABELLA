// Busca la imagen principal
let imagenPrincipal = document.querySelector(".imagen-producto > img");

// Busca todas las miniaturas
let miniaturas = document.querySelectorAll(".mini-miniaturas img");

// Cambiar imagen al hacer clic
miniaturas.forEach(function (miniatura) {

    miniatura.addEventListener("click", function () {

        imagenPrincipal.src = miniatura.src;

        imagenPrincipal.alt = miniatura.alt;

    });

});



