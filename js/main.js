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
function handleForm(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.textContent = '✓ Enviado — Te contactamos pronto';
  btn.style.background = '#25D366';
  btn.style.color = '#fff';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = 'Enviar Consulta →';
    btn.style.background = '';
    btn.style.color = '';
    btn.disabled = false;
    e.target.reset();
  }, 4000);
}
