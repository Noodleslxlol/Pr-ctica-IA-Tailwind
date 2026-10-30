/* =========================================================
   DevSpace Portfolio — interacción con JavaScript puro
   1. Menú hamburguesa
   2. Modo oscuro
   3. Acordeón de preguntas frecuentes
   4. Filtro de proyectos
   5. Validación del formulario + toast
   ========================================================= */

/* ---------- 1. MENÚ HAMBURGUESA ---------- */
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const iconOpen = document.getElementById('icon-open');
const iconClose = document.getElementById('icon-close');

function setMenu(abierto) {
  mobileMenu.classList.toggle('hidden', !abierto);
  iconOpen.classList.toggle('hidden', abierto);
  iconClose.classList.toggle('hidden', !abierto);
  menuToggle.setAttribute('aria-expanded', String(abierto));
  menuToggle.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
}

menuToggle.addEventListener('click', () => {
  const abierto = menuToggle.getAttribute('aria-expanded') === 'true';
  setMenu(!abierto);
});

// Cerrar al elegir un enlace
document.querySelectorAll('.mobile-link').forEach((link) => {
  link.addEventListener('click', () => setMenu(false));
});

// Cerrar con la tecla Escape y devolver el foco al botón
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    menuToggle.focus();
  }
});

// Si la pantalla crece hasta md (768 px), el menú móvil se cierra
window.matchMedia('(min-width: 48rem)').addEventListener('change', (e) => {
  if (e.matches) setMenu(false);
});

/* ---------- 2. MODO OSCURO ---------- */
const themeToggle = document.getElementById('theme-toggle');
const root = document.documentElement;

function syncThemeButton() {
  const oscuro = root.classList.contains('dark');
  themeToggle.setAttribute('aria-pressed', String(oscuro));
  themeToggle.setAttribute('aria-label', oscuro ? 'Activar modo claro' : 'Activar modo oscuro');
}

themeToggle.addEventListener('click', () => {
  const oscuro = root.classList.toggle('dark');
  try {
    localStorage.setItem('tema', oscuro ? 'dark' : 'light');
  } catch (e) {
    /* Si el navegador bloquea localStorage, el tema solo dura esta visita */
  }
  syncThemeButton();
});

syncThemeButton();

/* ---------- 3. ACORDEÓN ---------- */
document.querySelectorAll('.accordion-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const abierto = btn.getAttribute('aria-expanded') === 'true';
    const panel = document.getElementById(btn.getAttribute('aria-controls'));
    btn.setAttribute('aria-expanded', String(!abierto));
    panel.classList.toggle('hidden', abierto);
    btn.querySelector('.accordion-icon').classList.toggle('rotate-180', !abierto);
  });
});

/* ---------- 4. FILTRO DE PROYECTOS ---------- */
// Clases completas (Tailwind solo genera clases que aparecen escritas enteras)
const FILTRO_ACTIVO = ['bg-accent-strong', 'text-white', 'dark:bg-accent', 'dark:text-ink'];
const FILTRO_INACTIVO = ['bg-white', 'text-accent-strong', 'hover:bg-cyan-50', 'dark:bg-ink', 'dark:text-accent', 'dark:hover:bg-slate-900'];

const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const categoria = btn.dataset.filter;

    filterButtons.forEach((b) => {
      const activo = b === btn;
      b.setAttribute('aria-pressed', String(activo));
      FILTRO_ACTIVO.forEach((c) => b.classList.toggle(c, activo));
      FILTRO_INACTIVO.forEach((c) => b.classList.toggle(c, !activo));
    });

    projectCards.forEach((card) => {
      const visible = categoria === 'todos' || card.dataset.category === categoria;
      card.classList.toggle('hidden', !visible);
    });
  });
});

/* ---------- 5. FORMULARIO + TOAST ---------- */
const form = document.getElementById('contact-form');
const toast = document.getElementById('toast');
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Reglas de validación por campo: devuelven el mensaje de error o '' si es válido
const reglas = {
  nombre: (v) => (v.trim() === '' ? 'Escribe tu nombre.' : v.trim().length < 2 ? 'El nombre debe tener al menos 2 caracteres.' : ''),
  correo: (v) => (v.trim() === '' ? 'Escribe tu correo electrónico.' : !EMAIL_REGEX.test(v.trim()) ? 'Escribe un correo válido, por ejemplo nombre@ejemplo.com.' : ''),
  asunto: (v) => (v === '' ? 'Selecciona un asunto.' : ''),
  mensaje: (v) => (v.trim() === '' ? 'Escribe un mensaje.' : v.trim().length < 10 ? 'El mensaje debe tener al menos 10 caracteres.' : ''),
};

const CAMPO_ERROR = ['border-error-strong', 'dark:border-error'];

function validarCampo(campo) {
  const mensaje = reglas[campo.name](campo.value);
  const error = document.getElementById(`${campo.id}-error`);
  error.textContent = mensaje;
  error.classList.toggle('hidden', mensaje === '');
  campo.setAttribute('aria-invalid', String(mensaje !== ''));
  CAMPO_ERROR.forEach((c) => campo.classList.toggle(c, mensaje !== ''));
  return mensaje === '';
}

// Validación en vivo: después de salir del campo y mientras se corrige
form.querySelectorAll('input, select, textarea').forEach((campo) => {
  campo.addEventListener('blur', () => validarCampo(campo));
  campo.addEventListener('input', () => {
    if (campo.getAttribute('aria-invalid') === 'true') validarCampo(campo);
  });
});

let toastTimer;
function mostrarToast(texto) {
  toast.textContent = texto;
  toast.classList.remove('opacity-0', 'translate-y-4');
  toast.classList.add('opacity-100', 'translate-y-0');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('opacity-100', 'translate-y-0');
    toast.classList.add('opacity-0', 'translate-y-4');
  }, 4000);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const campos = [...form.querySelectorAll('input, select, textarea')];
  const resultados = campos.map(validarCampo);
  const primerInvalido = campos[resultados.indexOf(false)];

  if (primerInvalido) {
    primerInvalido.focus();
    return;
  }

  // Demostración frontend: no se envía nada a ningún servidor
  form.reset();
  campos.forEach((c) => c.removeAttribute('aria-invalid'));
  mostrarToast('¡Gracias! Tu mensaje pasó la validación. (Demostración: no se envió ningún correo).');
});

/* ---------- Año del pie de página ---------- */
document.getElementById('year').textContent = new Date().getFullYear();
