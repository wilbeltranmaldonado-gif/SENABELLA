// ==========================================
// VALIDACIONES EN TIEMPO REAL
// ==========================================

const inputNombre = document.querySelector("#nombre");
const inputTelefono = document.querySelector("#telefono");

// Solo letras, espacios y tildes en el campo nombre
inputNombre.addEventListener("input", function () {
    this.value = this.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/g, "");
});

// Solo números, +, espacios y guiones en el campo teléfono
inputTelefono.addEventListener("input", function () {
    this.value = this.value.replace(/[^0-9+\s\-]/g, "");
});


// ==========================================
// FORMULARIO DE CONTACTO
// ==========================================

const formulario = document.querySelector("#formulario-contacto");
const mensajeExito = document.querySelector("#mensaje-exito");
const botonEnviar = document.querySelector("#btn-enviar");

formulario.addEventListener("submit", function (evento) {

    evento.preventDefault();

    // Deshabilitar botón y mostrar cargando
    botonEnviar.disabled = true;
    botonEnviar.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';

    // Simular envío (1.5 segundos)
    setTimeout(function () {

        formulario.style.display = "none";
        mensajeExito.classList.add("mostrar");

        // Restaurar botón después de 4 segundos
        setTimeout(function () {

            formulario.reset();
            formulario.style.display = "block";
            mensajeExito.classList.remove("mostrar");

            botonEnviar.disabled = false;
            botonEnviar.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Enviar mensaje';

        }, 4000);

    }, 1500);

});


// ==========================================
// PREGUNTAS FRECUENTES (ACORDEÓN)
// ==========================================

const preguntasFAQ = document.querySelectorAll(".faq-item");

preguntasFAQ.forEach(function (item) {

    item.addEventListener("click", function () {

        // Cerrar las demás
        preguntasFAQ.forEach(function (otro) {
            if (otro !== item) otro.classList.remove("activo");
        });

        // Abrir/cerrar la seleccionada
        item.classList.toggle("activo");

    });

});
