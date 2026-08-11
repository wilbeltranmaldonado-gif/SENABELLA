/* =========================================================================
   SENABELLA · usuario.js  (requiere common.js cargado antes)
   - Cambia la sección "activa" del menú lateral con transición
   - Los botones "Editar" convierten el valor en un campo editable
   - Guardado simulado con feedback (toast)
   ========================================================================= */

(function () {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* --- Navegación lateral tipo pestañas --- */
  function setupMenuLateral() {
    const items = $$(".barra-lateral .elemento-menu");
    const tarjeta = $(".tarjeta-contenido");
    if (!items.length || !tarjeta) return;

    items.forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        items.forEach((i) => i.classList.remove("activo"));
        item.classList.add("activo");

        const etiqueta = $("span", item)?.textContent ?? "Sección";

        tarjeta.style.transition = "opacity .2s ease, transform .2s ease";
        tarjeta.style.opacity = "0";
        tarjeta.style.transform = "translateY(6px)";

        setTimeout(() => {
          const titulo = $(".titulo-seccion", tarjeta);
          if (titulo) titulo.textContent = etiqueta;
          tarjeta.style.opacity = "1";
          tarjeta.style.transform = "translateY(0)";
        }, 180);
      });
    });
  }

  /* --- Edición inline de campos con botón "Editar" --- */
  function setupEdicionInline() {
    $$(".boton-editar").forEach((boton) => {
      boton.addEventListener("click", () => {
        const grupo = boton.closest(".grupo-info");
        const valorEl = $(".valor-info", grupo);
        if (!valorEl) return;

        if (boton.dataset.editando === "true") {
          // Guardar
          const input = $("input", grupo);
          const nuevoValor = input.value.trim() || valorEl.dataset.original;
          valorEl.textContent = nuevoValor;
          boton.textContent = "Editar";
          boton.dataset.editando = "false";
          window.SenabellaToast?.("Cambios guardados correctamente", "fa-circle-check");
          return;
        }

        valorEl.dataset.original = valorEl.textContent.trim();
        const input = document.createElement("input");
        input.type = "text";
        input.value = valorEl.dataset.original;
        input.style.cssText = `
          font: inherit; padding:6px 10px; border:1px solid #84b814;
          border-radius:8px; width:100%; max-width:260px;
        `;
        valorEl.textContent = "";
        valorEl.appendChild(input);
        input.focus();
        input.select();

        boton.textContent = "Guardar";
        boton.dataset.editando = "true";

        input.addEventListener("keydown", (e) => {
          if (e.key === "Enter") boton.click();
        });
      });
    });
  }

  function init() {
    setupMenuLateral();
    setupEdicionInline();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
