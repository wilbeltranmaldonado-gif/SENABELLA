document.addEventListener('DOMContentLoaded', () => {
  // Correo autorizado como administrador. Cualquier otro correo válido
  // ingresa como cliente normal.
  const CORREO_ADMIN = 'admin@senabella.com';

  // --- Elementos del Formulario de Login ---
  const formulario = document.getElementById('formularioLogin');
  const correoInput = document.getElementById('correoLogin');
  const contrasenaInput = document.getElementById('contrasenaLogin');
  const mensajeError = document.getElementById('mensajeError');
  const mensajeExito = document.getElementById('mensajeExito');

  // --- Elementos de Modo Oscuro ---
  const btnModoOscuro = document.getElementById('btnModoOscuro') || document.querySelector('.boton-modo-oscuro');

  // ==========================================
  // 1. LÓGICA DE MODO OSCURO
  // ==========================================
  const actualizarBotonModoOscuro = (isDark) => {
    if (!btnModoOscuro) return;
    const icono = btnModoOscuro.querySelector('i');
    const texto = btnModoOscuro.querySelector('span');

    if (isDark) {
      if (icono) icono.className = 'fa-solid fa-sun';
      if (texto) texto.textContent = 'Modo Claro';
    } else {
      if (icono) icono.className = 'fa-solid fa-moon';
      if (texto) texto.textContent = 'Modo Oscuro';
    }
  };

  // Verificar preferencia guardada
  if (localStorage.getItem('modo-oscuro') === 'activo') {
    document.body.classList.add('modo-oscuro');
    actualizarBotonModoOscuro(true);
  }

  if (btnModoOscuro) {
    btnModoOscuro.addEventListener('click', () => {
      document.body.classList.toggle('modo-oscuro');
      const esOscuro = document.body.classList.contains('modo-oscuro');
      localStorage.setItem('modo-oscuro', esOscuro ? 'activo' : 'inactivo');
      actualizarBotonModoOscuro(esOscuro);
    });
  }

  // ==========================================
  // 2. MOSTRAR / OCULTAR CONTRASEÑA
  // ==========================================
  const togglePassButtons = document.querySelectorAll('.btn-toggle-pass');
  togglePassButtons.forEach((boton) => {
    boton.addEventListener('click', () => {
      const targetId = boton.getAttribute('data-target');
      const input = document.getElementById(targetId);
      const icono = boton.querySelector('i');

      if (!input) return;

      if (input.type === 'password') {
        input.type = 'text';
        if (icono) icono.className = 'fa-solid fa-eye-slash';
      } else {
        input.type = 'password';
        if (icono) icono.className = 'fa-solid fa-eye';
      }
    });
  });

  // ==========================================
  // 3. PROCESO DE INICIO DE SESIÓN
  // ==========================================
  if (formulario) {
    formulario.addEventListener('submit', (evento) => {
      evento.preventDefault();
      ocultarMensajes();

      const correo = correoInput ? correoInput.value.trim() : '';
      const contrasena = contrasenaInput ? contrasenaInput.value : '';

      // Validar campos vacíos
      if (correo === '') {
        mostrarError('Por favor, ingresa tu correo electrónico.');
        if (correoInput) correoInput.focus();
        return;
      }

      if (!correoInput.checkValidity()) {
        mostrarError('Por favor, ingresa un correo electrónico válido.');
        if (correoInput) correoInput.focus();
        return;
      }

      if (contrasena === '') {
        mostrarError('Por favor, ingresa tu contraseña.');
        if (contrasenaInput) contrasenaInput.focus();
        return;
      }

      // Obtener datos guardados de usuario registrado
      let usuarioGuardado = null;
      try {
        usuarioGuardado = JSON.parse(localStorage.getItem('senabella_usuario') || 'null');
      } catch (e) {
        console.error('Error al obtener usuario guardado:', e);
      }

      // Validar según el correo si quien ingresa es administrador o cliente
      const rol = correo.toLowerCase() === CORREO_ADMIN ? 'administrador' : 'cliente';

      // Si hay un usuario previamente registrado
      if (usuarioGuardado && usuarioGuardado.correo) {
        if (usuarioGuardado.correo.toLowerCase() === correo.toLowerCase()) {
          iniciarSesionExitoso(usuarioGuardado.nombre || 'Usuario', rol);
        } else {
          // Si ingresa un correo distinto, se actualiza la cuenta activa
          const nuevoUsuario = {
            nombre: correo.split('@')[0],
            correo: correo
          };
          localStorage.setItem('senabella_usuario', JSON.stringify(nuevoUsuario));
          iniciarSesionExitoso(nuevoUsuario.nombre, rol);
        }
      } else {
        // Si no se ha registrado previamente, crea sesión directa con ese correo
        const nuevoUsuario = {
          nombre: correo.split('@')[0],
          correo: correo
        };
        localStorage.setItem('senabella_usuario', JSON.stringify(nuevoUsuario));
        iniciarSesionExitoso(nuevoUsuario.nombre, rol);
      }
    });
  }

  function iniciarSesionExitoso(nombre, rol) {
    localStorage.setItem('senabella_sesion', 'activa');
    localStorage.setItem('senabella_rol', rol);

    if (rol === 'administrador') {
      mostrarExito(`¡Bienvenido, ${nombre}! Redirigiendo al panel de administración...`);
      setTimeout(() => {
        window.location.href = 'administrador.html';
      }, 1200);
    } else {
      mostrarExito(`¡Bienvenido de nuevo, ${nombre}! Redirigiendo a tu perfil...`);
      setTimeout(() => {
        window.location.href = 'usuario.html';
      }, 1200);
    }
  }

  // ==========================================
  // FUNCIONES DE ALERTA DE MENSAJES
  // ==========================================
  function mostrarError(texto) {
    if (!mensajeError) return;
    mensajeError.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> <span>${texto}</span>`;
    mensajeError.style.display = 'flex';
  }

  function mostrarExito(texto) {
    if (!mensajeExito) return;
    mensajeExito.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${texto}</span>`;
    mensajeExito.style.display = 'flex';
  }

  function ocultarMensajes() {
    if (mensajeError) mensajeError.style.display = 'none';
    if (mensajeExito) mensajeExito.style.display = 'none';
  }
});
