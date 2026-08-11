
// ==========================================
// HEADER
// ==========================================

const headerHTML = `
    <header class="contenido_principal">

        <div class="logo">
            <a href="inicio.html">
                <img src="../recursos/logo.png"
                     alt="Senabella"
                     width="130"
                     height="50">
            </a>
        </div>

        <div class="contenedor-busqueda">
            <input
                type="text"
                class="entrada-busqueda"
                placeholder="Buscar en Senabella.com"
            >

            <button class="boton-busqueda">
                <i class="fa-solid fa-magnifying-glass"></i>
            </button>
        </div>

        <button id="theme-toggle" class="btn btn-outline-secondary">
            <i class="fa-solid fa-moon"></i>
            Modo oscuro
        </button>

        <div class="acciones-usuario">

            <div class="cuenta-usuario">
                <div class="texto-usuario texto-usuario-bold">
                    <a href="usuario.html">Mi cuenta</a>
                </div>
            </div>

            <a href="#">
                <i class="fa-regular fa-heart icono-corazon"></i>
            </a>

            <a href="carrito.html" class="icono-carrito">
                <i class="fa-solid fa-cart-shopping"></i>
                <p class="contador-carrito"> 0 </p>
            </a>

        </div>

    </header>

    <div class="sub-navegacion">

        <div class="boton-ubicacion">
            <i class="fa-solid fa-location-dot"></i>
            Ingresa tu ubicación
        </div>

        <div class="enlaces-navegacion">

            <a href="inicio.html">
                Vende en Senabella.com
            </a>

            
        <!-- TARJETAS Y CUENTAS -->

        <div class="menu-desplegable">

            <button class="boton-desplegable" id="boton-tarjetas">
                Tarjetas y cuentas
                <i class="fa-solid fa-chevron-down"></i>
            </button>

            <div class="contenido-desplegable" id="menu-tarjetas">

                <a href="catalogo.html">
                    Tarjetas
                </a>

                <a href="cuentas.html">
                    Cuentas
                </a>


            </div>

        </div>

            <a href="parejas.html">
                Parejas
            </a>


             <!-- AYUDA -->

        <div class="menu-desplegable">

            <button class="boton-desplegable" id="boton-ayuda">
                Ayuda
                <i class="fa-solid fa-chevron-down"></i>
            </button>

            <div class="contenido-desplegable" id="menu-ayuda">

                <a href="preguntas.html">
                    Preguntas frecuentes
                </a>

                <a href="contacto.html">
                    Contáctanos
                </a>

                <a href="soporte.html">
                    Soporte
                </a>

            </div>

        </div>


    </div>
`;

// Agregar el header a la página
document.body.insertAdjacentHTML("afterbegin", headerHTML);


// ==========================================
// MODO OSCURO
// ==========================================

const botonModo = document.querySelector("#theme-toggle");

// Revisar si ya había un modo guardado
const modoGuardado = localStorage.getItem("modoOscuro");

if (modoGuardado === "activado") {

    document.body.classList.add("modo-oscuro");

    botonModo.innerHTML =
        '<i class="fa-solid fa-sun"></i> Modo claro';
}


// Cambiar modo
botonModo.addEventListener("click", function () {

    document.body.classList.toggle("modo-oscuro");

    if (document.body.classList.contains("modo-oscuro")) {

        botonModo.innerHTML =
            '<i class="fa-solid fa-sun"></i> Modo claro';

        localStorage.setItem(
            "modoOscuro",
            "activado"
        );

    } else {

        botonModo.innerHTML =
            '<i class="fa-solid fa-moon"></i> Modo oscuro';

        localStorage.setItem(
            "modoOscuro",
            "desactivado"
        );
    }

});


// ==========================================
// UBICACIÓN
// ==========================================

const botonUbicacion =
    document.querySelector(".boton-ubicacion");

// Revisar si existe una ubicación guardada
const ubicacionGuardada =
    localStorage.getItem("ubicacion");

if (ubicacionGuardada) {

    botonUbicacion.innerHTML =
        '<i class="fa-solid fa-location-dot"></i> ' +
        ubicacionGuardada;
}


// Cambiar ubicación
botonUbicacion.addEventListener("click", function () {

    const ciudad = prompt("¿Cuál es tu ciudad?");

    if (ciudad !== null && ciudad.trim() !== "") {

        const ciudadLimpia = ciudad.trim();

        botonUbicacion.innerHTML =
            '<i class="fa-solid fa-location-dot"></i> ' +
            ciudadLimpia;

        localStorage.setItem(
            "ubicacion",
            ciudadLimpia
        );
    }

});

// ==========================================
// MENÚ TARJETAS Y CUENTAS
// ==========================================

const botonTarjetas = document.querySelector("#boton-tarjetas");
const menuTarjetas = document.querySelector("#menu-tarjetas");

botonTarjetas.addEventListener("click", function () {

    menuTarjetas.classList.toggle("mostrar");

});


// ==========================================
// MENÚ AYUDA
// ==========================================

const botonAyuda = document.querySelector("#boton-ayuda");
const menuAyuda = document.querySelector("#menu-ayuda");

botonAyuda.addEventListener("click", function () {

    menuAyuda.classList.toggle("mostrar");

});