/* ============================================
   AURELIA — Landing Page de Conversión
   Archivo: script.js
   Funcionalidad ligera, sin dependencias
   ============================================ */

(function () {
  'use strict';

  // ---------- COUNTDOWN TIMER ----------
  const countdownEl = document.getElementById('countdown');
  // 3 horas desde la carga de la página
  let totalSeconds = 3 * 60 * 60;

  function updateCountdown() {
    if (totalSeconds <= 0) {
      countdownEl.textContent = '¡EXPIRADO!';
      return;
    }
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    countdownEl.textContent =
      String(h).padStart(2, '0') + ':' +
      String(m).padStart(2, '0') + ':' +
      String(s).padStart(2, '0');
    totalSeconds--;
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ---------- NAV SCROLL ----------
  const nav = document.getElementById('nav');
  const urgencyBar = document.getElementById('urgencyBar');

  function handleNavScroll() {
    const scrolled = window.scrollY > 50;
    nav.classList.toggle('is-scrolled', scrolled);
  }
  window.addEventListener('scroll', handleNavScroll, { passive: true });

  // ---------- MOBILE MENU ----------
  const burger = document.getElementById('navBurger');
  const navLinks = document.getElementById('navLinks');

  burger.addEventListener('click', function () {
    burger.classList.toggle('is-active');
    navLinks.classList.toggle('is-open');
    document.body.style.overflow = navLinks.classList.contains('is-open') ? 'hidden' : '';
  });

  // Cerrar menú al hacer clic en un enlace
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      burger.classList.remove('is-active');
      navLinks.classList.remove('is-open');
      document.body.style.overflow = '';
    });
  });

  // ---------- REVEAL ON SCROLL (Intersection Observer) ----------
  var revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll('.reveal').forEach(function (el) {
    revealObserver.observe(el);
  });

  // ---------- ANIMATED COUNTERS ----------
  var counterObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll('.stat__number').forEach(function (el) {
    counterObserver.observe(el);
  });

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-target'), 10);
    var duration = 1800;
    var start = 0;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out cubic
      var ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(ease * target);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    }
    requestAnimationFrame(step);
  }

  // ---------- FAQ ACCORDION ----------
  document.querySelectorAll('.faq__question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var faq = btn.closest('.faq');
      var isOpen = faq.classList.contains('is-open');

      // Cerrar todos los demás
      document.querySelectorAll('.faq.is-open').forEach(function (openFaq) {
        openFaq.classList.remove('is-open');
        openFaq.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
      });

      // Toggle el actual
      if (!isOpen) {
        faq.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ---------- EMAIL FORM ----------
  var emailForm = document.getElementById('emailForm');
  var emailMsg = document.getElementById('emailMsg');

  emailForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var email = document.getElementById('emailInput').value.trim();
    if (email) {
      emailMsg.textContent = '✅ ¡Listo! Revisa tu correo — tu guía y cupón de 25% están en camino.';
      emailMsg.style.color = '#A5D6A7';
      emailForm.reset();

      // Limpiar mensaje después de 8 segundos
      setTimeout(function () {
        emailMsg.textContent = '';
      }, 8000);
    }
  });

  // ---------- STICKY CTA (MOBILE) ----------
  var stickyCta = document.getElementById('stickyCta');
  var heroBuyBtn = document.getElementById('heroBuyBtn');

  if (stickyCta && heroBuyBtn) {
    var stickyObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          // Mostrar sticky cuando el botón del hero ya no es visible
          if (!entry.isIntersecting) {
            stickyCta.classList.add('is-visible');
          } else {
            stickyCta.classList.remove('is-visible');
          }
        });
      },
      { threshold: 0 }
    );
    stickyObserver.observe(heroBuyBtn);
  }

  // ---------- SIMULAR STOCK DECRECIENTE ----------
  var stockEl = document.getElementById('stockCount');
  if (stockEl) {
    var stock = parseInt(stockEl.textContent, 10);
    setInterval(function () {
      if (stock > 3) {
        stock--;
        stockEl.textContent = stock;
      }
    }, 45000); // Cada 45 segundos baja una unidad
  }

  // ---------- SMOOTH SCROLL PARA TODOS LOS ANCHOR LINKS ----------
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        var offset = 80;
        var top = targetEl.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

})();
