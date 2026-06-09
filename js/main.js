// main.js — Navegación, animaciones y utilidades

// NAV scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// Mobile nav toggle (dropdown)
const navMenuBtn = document.getElementById('navMenuBtn');
const navMenuPanel = document.getElementById('navMenuPanel');
if (navMenuBtn && navMenuPanel) {
  navMenuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    navMenuPanel.classList.toggle('open');
  });
  navMenuPanel.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navMenuPanel.classList.remove('open'));
  });
  document.addEventListener('click', (e) => {
    if (!navMenuPanel.contains(e.target) && e.target !== navMenuBtn) {
      navMenuPanel.classList.remove('open');
    }
  });
}

// Fade-in on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// Contact form
function validateField(id, errId, checkFn) {
  const el = document.getElementById(id);
  const err = document.getElementById(errId);
  const valid = checkFn(el.value.trim());
  el.classList.toggle('input-error', !valid);
  err.classList.toggle('visible', !valid);
  // Re-check on input to remove error as user types
  el.addEventListener('input', () => {
    const ok = checkFn(el.value.trim());
    el.classList.toggle('input-error', !ok);
    err.classList.toggle('visible', !ok);
  }, { once: true });
  return valid;
}

function handleForm(e) {
  e.preventDefault();

  const isEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const notEmpty = v => v.length > 0;

  const ok = [
    validateField('nombre',  'err-nombre',  notEmpty),
    validateField('telefono','err-telefono', notEmpty),
    validateField('email',   'err-email',    isEmail),
    validateField('interes', 'err-interes',  notEmpty),
    validateField('mensaje', 'err-mensaje',  notEmpty),
  ].every(Boolean);

  if (!ok) return;

  const btn = e.target.querySelector('button[type="submit"]');
  const originalText = btn.textContent;
  btn.textContent = 'Enviando...';
  btn.disabled = true;

  const templateParams = {
    nombre:   document.getElementById("nombre").value,
    telefono: document.getElementById("telefono").value,
    email:    document.getElementById("email").value,
    servicio: document.getElementById("interes").value,
    mensaje:  document.getElementById("mensaje").value,
  };

  emailjs.send("service_eoa40cj", "template_AutoBerlin", templateParams)
    .then(() => {
      // Guardar en pedidos de stock si eligió esa opción
      const interes = document.getElementById('interes').value;
      if (interes === 'stock_alert') {
        const alertData = {
          nombre: templateParams.nombre,
          telefono: templateParams.telefono,
          email: templateParams.email,
          interes: 'Alerta de stock',
          mensaje: templateParams.mensaje,
          ts: new Date().toISOString(),
          status: 'pending'
        };

        // Siempre guardar en localStorage
        const localAlerts = JSON.parse(localStorage.getItem('ab_pending_stock_alerts') || '[]');
        const cleanedAlerts = localAlerts.filter(a => !['demo1','demo2'].includes(a.id));
        cleanedAlerts.unshift(alertData);
        localStorage.setItem('ab_pending_stock_alerts', JSON.stringify(cleanedAlerts));

        // Intentar también en Firebase
        if (typeof db !== 'undefined') {
          db.collection('stock_alerts').add(alertData)
            .then(() => console.log('Alerta de stock guardada en Firebase.'))
            .catch(err => console.warn('Firebase: alerta guardada solo en local.', err));
        }
      }

      btn.textContent = '✓ Enviado — Te contactamos pronto';
      btn.style.background = '#25D366';
      btn.style.color = '#fff';
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.style.color = '';
        btn.disabled = false;
        e.target.reset();
      }, 4000);
    })
    .catch((error) => {
      console.error("EmailJS Error:", error);
      alert("Hubo un error al enviar la consulta. Por favor, intentá de nuevo.");
      btn.textContent = originalText;
      btn.disabled = false;
    });
}

function onInteresChange(select) {
  const textarea = document.getElementById('mensaje');
  if (select.value === 'stock_alert') {
    textarea.placeholder = 'Describí el auto que buscás (marca, modelo, color, año...)';
  } else {
    textarea.placeholder = 'Contanos qué necesitás...';
  }
}
