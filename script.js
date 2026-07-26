 // Nav scroll state
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 40);
  });

  // Mobile menu
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  navToggle.addEventListener('click', () => navLinks.classList.toggle('is-open'));
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('is-open')));

  // Reveal on scroll
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('is-visible'); });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // Newsletter (demo, sin backend)
  const form = document.getElementById('newsForm');
  const msg = document.getElementById('newsMsg');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('newsEmail').value.trim();
    if (email) {
      msg.textContent = 'Gracias — revisa tu correo para tu código de 15%.';
      form.reset();
    }
  });