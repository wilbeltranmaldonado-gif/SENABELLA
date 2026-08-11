// ==========================================
// LÓGICA DE SOPORTE
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    const inputBusqueda = document.querySelector("#busqueda-soporte");
    const btnBuscar = document.querySelector("#btn-buscar");

    // Simular búsqueda
    const realizarBusqueda = () => {
        const query = inputBusqueda.value.trim();
        if (query.length > 0) {
            btnBuscar.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
            btnBuscar.disabled = true;

            setTimeout(() => {
                alert(`Mostrando resultados de ayuda para: "${query}"`);
                btnBuscar.innerHTML = 'Buscar';
                btnBuscar.disabled = false;
            }, 1000);
        } else {
            inputBusqueda.focus();
        }
    };

    btnBuscar.addEventListener("click", realizarBusqueda);

    inputBusqueda.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            realizarBusqueda();
        }
    });

});
