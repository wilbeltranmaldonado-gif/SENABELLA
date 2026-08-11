// Función para actualizar los datos de la vista con el producto guardado
function actualizarDetalleProducto() {
    let productoGuardado = localStorage.getItem("productoSeleccionado");
    if (!productoGuardado) return;

    let producto = JSON.parse(productoGuardado);

    let imagenPrincipal = document.querySelector(".imagen-producto > img");
    let miniaturas = document.querySelectorAll(".mini-miniaturas img");
    let tituloEl = document.querySelector(".info-producto h1");
    let categoriaEl = document.querySelector(".info-producto .categoria");
    let descripcionEl = document.querySelector(".info-producto .descripcion");
    let precioActualEl = document.querySelector(".precio-actual");
    let precioAntiguoEl = document.querySelector(".precio-antiguo");

    if (tituloEl && producto.titulo) tituloEl.textContent = producto.titulo;
    if (categoriaEl && producto.marca) categoriaEl.textContent = producto.marca;
    if (descripcionEl && producto.descripcion) descripcionEl.textContent = producto.descripcion;

    if (imagenPrincipal && producto.imagen) {
        imagenPrincipal.src = producto.imagen;
        imagenPrincipal.alt = producto.titulo || "Producto";

        miniaturas.forEach(function (miniatura) {
            miniatura.src = producto.imagen;
        });
    }

    if (precioActualEl && producto.precioActual) precioActualEl.textContent = producto.precioActual;
    if (precioAntiguoEl && producto.precioAntiguo) precioAntiguoEl.textContent = producto.precioAntiguo;
}

// Intentar actualizar inmediatamente por si los elementos DOM ya existen
actualizarDetalleProducto();

document.addEventListener("DOMContentLoaded", function () {
    // Asegurar actualización completa al estar listo el DOM
    actualizarDetalleProducto();

    let imagenPrincipal = document.querySelector(".imagen-producto > img");
    let miniaturas = document.querySelectorAll(".mini-miniaturas img");

    // Cambiar imagen al hacer clic en miniaturas
    if (miniaturas.length > 0) {
        miniaturas.forEach(function (miniatura) {
            miniatura.addEventListener("click", function () {
                if (imagenPrincipal) {
                    imagenPrincipal.src = miniatura.src;
                    imagenPrincipal.alt = miniatura.alt;
                }
            });
        });
    }

    // Funcionalidad para los botones (Agregar al carrito y Comprar ahora)
    let btnAgregarCarrito = document.querySelector(".btn-primario");
    let btnComprarAhora = document.querySelector(".btn-secundario");

    function obtenerDatosActualesProducto() {
        let titulo = document.querySelector(".info-producto h1")?.textContent.trim() || "Producto Senabella";
        let marca = document.querySelector(".info-producto .categoria")?.textContent.trim() || "SENABELLA";
        let precioText = document.querySelector(".precio-actual")?.textContent.trim() || "$ 0";
        let img = document.querySelector(".imagen-producto > img")?.src || "";

        return {
            nombre: titulo,
            marca: marca,
            color: "Estándar",
            precioText: precioText,
            img: img,
            cantidad: 1
        };
    }

    if (btnAgregarCarrito) {
        btnAgregarCarrito.addEventListener("click", function () {
            let prod = obtenerDatosActualesProducto();

            if (window.SenabellaCart) {
                window.SenabellaCart.agregarProducto(prod);
            }

            // Crear notificación elegante personalizada si no existe el helper
            let contenedorToast = document.getElementById("contenedor-toast");
            if (!contenedorToast) {
                contenedorToast = document.createElement("div");
                contenedorToast.id = "contenedor-toast";
                document.body.appendChild(contenedorToast);
            }

            let toast = document.createElement("div");
            toast.className = "toast-senabella toast-exito";
            toast.innerHTML =
                '<i class="fa-solid fa-circle-check"></i>' +
                '<span>¡<strong>' + prod.marca + '</strong> se agregó al carrito!</span>' +
                '<button class="toast-cerrar"><i class="fa-solid fa-xmark"></i></button>';

            contenedorToast.appendChild(toast);
            setTimeout(function () { toast.classList.add("toast-visible"); }, 10);

            toast.querySelector(".toast-cerrar").addEventListener("click", function () {
                toast.classList.remove("toast-visible");
                setTimeout(function () { toast.remove(); }, 300);
            });

            setTimeout(function () {
                toast.classList.remove("toast-visible");
                setTimeout(function () { toast.remove(); }, 300);
            }, 3500);
        });
    }

    if (btnComprarAhora) {
        btnComprarAhora.addEventListener("click", function () {
            let prod = obtenerDatosActualesProducto();

            if (window.SenabellaCart) {
                window.SenabellaCart.agregarProducto(prod);
            }

            // Redirigir directamente al carrito para finalizar la compra
            window.location.href = "carrito.html";
        });
    }
});
