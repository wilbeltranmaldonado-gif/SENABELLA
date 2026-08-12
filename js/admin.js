// ==========================================
// PANEL DE ADMINISTRACIÓN - SENABELLA
// ==========================================

document.addEventListener("DOMContentLoaded", function () {
  
  const cuerpoTabla = document.getElementById("cuerpo-tabla-ordenes");
  const modal = document.getElementById("modal-comprobante");
  const btnCerrarModal = document.getElementById("btn-cerrar-modal");
  const imgComprobante = document.getElementById("imagen-comprobante");
  const tituloModal = document.getElementById("modal-titulo-orden");

  function cargarOrdenes() {
    let ordenes = [];
    try {
      ordenes = JSON.parse(localStorage.getItem("senabella_admin_orders")) || [];
    } catch(e) {}

    cuerpoTabla.innerHTML = "";

    if (ordenes.length === 0) {
      cuerpoTabla.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 30px;">No hay órdenes registradas aún.</td></tr>`;
      return;
    }

    ordenes.forEach((orden, index) => {
      // Determinar clase del badge según estado
      let claseBadge = "estado-pendiente";
      if (orden.estado.includes("Aprobado")) claseBadge = "estado-aprobado";
      if (orden.estado.includes("Rechazado")) claseBadge = "estado-rechazado";

      // Formatear método de pago
      let metodoPagoTxt = orden.metodoPago === 'nequi' ? 'Nequi' : 
                          orden.metodoPago === 'banco' ? 'Transferencia' : 'Contra Entrega';

      const tr = document.createElement("tr");
      
      let tdHtml = `
        <td><strong>${orden.numero}</strong></td>
        <td>${orden.fecha}</td>
        <td><strong>${orden.total}</strong></td>
        <td>${metodoPagoTxt}</td>
        <td><span class="badge-estado ${claseBadge}">${orden.estado}</span></td>
        <td class="acciones-td">
      `;

      // Si tiene comprobante guardado (Base64) se puede ver, si no, no se muestra el botón
      if (orden.comprobante) {
        tdHtml += `<button class="btn-admin btn-ver-comprobante" data-index="${index}"><i class="fa-solid fa-eye"></i> Ver</button>`;
      } else {
        tdHtml += `<button class="btn-admin btn-ver-comprobante" style="visibility:hidden;"><i class="fa-solid fa-eye"></i></button>`;
      }

      // Mostrar botones de Aprobar/Rechazar si está pendiente
      if (orden.estado.includes("Pendiente")) {
        tdHtml += `
          <button class="btn-admin btn-aprobar" data-index="${index}"><i class="fa-solid fa-check"></i></button>
          <button class="btn-admin btn-rechazar" data-index="${index}"><i class="fa-solid fa-xmark"></i></button>
        `;
      }

      tdHtml += `</td>`;
      tr.innerHTML = tdHtml;
      cuerpoTabla.appendChild(tr);
    });

    // Vincular Eventos
    vincularEventos(ordenes);
  }

  function vincularEventos(ordenes) {
    // Botones de Ver Comprobante
    document.querySelectorAll(".btn-ver-comprobante").forEach(btn => {
      btn.addEventListener("click", function() {
        const index = this.getAttribute("data-index");
        const orden = ordenes[index];
        if (orden && orden.comprobante) {
          tituloModal.textContent = "Comprobante - " + orden.numero;
          imgComprobante.src = orden.comprobante;
          modal.classList.add("activo");
        }
      });
    });

    // Botones de Aprobar
    document.querySelectorAll(".btn-aprobar").forEach(btn => {
      btn.addEventListener("click", function() {
        if (confirm("¿Estás seguro de APROBAR esta orden? Se autorizará el envío.")) {
          const index = this.getAttribute("data-index");
          ordenes[index].estado = "Aprobado (Envío Autorizado)";
          guardarYRecargar(ordenes);
        }
      });
    });

    // Botones de Rechazar
    document.querySelectorAll(".btn-rechazar").forEach(btn => {
      btn.addEventListener("click", function() {
        if (confirm("¿Estás seguro de RECHAZAR esta orden? Se cancelará el envío.")) {
          const index = this.getAttribute("data-index");
          ordenes[index].estado = "Rechazado (Pago Inválido)";
          guardarYRecargar(ordenes);
        }
      });
    });
  }

  function guardarYRecargar(ordenes) {
    localStorage.setItem("senabella_admin_orders", JSON.stringify(ordenes));
    cargarOrdenes();
  }

  // Cerrar Modal
  if (btnCerrarModal) {
    btnCerrarModal.addEventListener("click", () => {
      modal.classList.remove("activo");
      imgComprobante.src = "";
    });
  }

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("activo");
        imgComprobante.src = "";
      }
    });
  }

  // Cargar inicialmente
  cargarOrdenes();
});
