// ==========================================
// VALIDACIONES EN TIEMPO REAL
// ==========================================

const inputNombre = document.querySelector("#nombre");
const inputTelefono = document.querySelector("#telefono");
const inputEmail = document.querySelector("#email");
const inputMensaje = document.querySelector("#mensaje");

// Solo letras, espacios y tildes en el campo nombre
inputNombre.addEventListener("input", function () {
    this.value = this.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/g, "");
});

// Solo números, +, espacios y guiones en el campo teléfono
inputTelefono.addEventListener("input", function () {
    this.value = this.value.replace(/[^0-9+\s\-]/g, "");
});


// ==========================================
// FORMULARIO DE CONTACTO (VALIDACIÓN EXTRA)
// ==========================================

const formulario = document.querySelector("#formulario-contacto");
const mensajeExito = document.querySelector("#mensaje-exito");
const botonEnviar = document.querySelector("#btn-enviar");

// Validar correo con Regex
const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    // Validaciones lógicas antes del envío
    if (inputNombre.value.trim().length < 3) {
        alert("El nombre debe tener al menos 3 caracteres.");
        inputNombre.focus();
        return;
    }

    if (!validarEmail(inputEmail.value.trim())) {
        alert("Por favor ingresa un correo electrónico válido.");
        inputEmail.focus();
        return;
    }

    if (inputTelefono.value.trim().length > 0 && inputTelefono.value.trim().length < 7) {
        alert("El número de teléfono parece ser muy corto.");
        inputTelefono.focus();
        return;
    }

    if (inputMensaje.value.trim().length < 10) {
        alert("El mensaje es muy corto. Por favor detalla un poco más tu consulta.");
        inputMensaje.focus();
        return;
    }

    // Deshabilitar botón y mostrar cargando
    botonEnviar.disabled = true;
    botonEnviar.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';

    // Simular envío a base de datos (1.5 segundos)
    setTimeout(function () {
        formulario.style.display = "none";
        mensajeExito.classList.add("mostrar");

        // Restaurar estado del formulario después de 5 segundos
        setTimeout(function () {
            formulario.reset();
            formulario.style.display = "block";
            mensajeExito.classList.remove("mostrar");

            botonEnviar.disabled = false;
            botonEnviar.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Enviar mensaje';
        }, 5000);
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


// ==========================================
// INTERACTIVIDAD EN CANALES DE CONTACTO
// ==========================================

const canalEmail = document.querySelector("#canal-email");
const canalTelefono = document.querySelector("#canal-telefono");

// Función para copiar texto al portapapeles
const copiarAlPortapapeles = (texto, tipo) => {
    navigator.clipboard.writeText(texto).then(() => {
        alert(`¡${tipo} copiado al portapapeles: ${texto}!`);
    }).catch(() => {
        console.error("Error al copiar al portapapeles.");
    });
};

if (canalEmail) {
    canalEmail.addEventListener("click", (e) => {
        // Evita interferir si se hace clic explícito en el <a> (que abre el cliente de correo)
        if (e.target.tagName !== "A" && e.target.closest("a") === null) {
            copiarAlPortapapeles("soporte@senabella.com", "Correo");
        }
    });
}

if (canalTelefono) {
    canalTelefono.addEventListener("click", (e) => {
        if (e.target.tagName !== "A" && e.target.closest("a") === null) {
            copiarAlPortapapeles("(601) 345 6789", "Teléfono");
        }
    });
}
