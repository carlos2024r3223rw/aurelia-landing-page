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
      emailMsg.textContent = '¡Listo! Revisa tu correo — tu guía y cupón de 25% están en camino.';
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

  // ---------- LANGUAGE TOGGLE & i18n ----------
  // La página siempre inicia en español (como está en el HTML).
  // Solo se traduce cuando el usuario hace clic en los botones ES o EN.
  const langButtons = document.querySelectorAll('.lang-toggle__btn');
  let currentLang = 'es'; // Idioma actual por defecto

  function updateLanguage(lang) {
    if (!translations || !translations[lang]) return;
    
    // Update active button state
    langButtons.forEach(btn => {
      if (btn.getAttribute('data-lang') === lang) {
        btn.classList.add('is-active');
      } else {
        btn.classList.remove('is-active');
      }
    });

    // Update texts in DOM
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[lang][key]) {
        el.innerHTML = translations[lang][key];
      }
    });

    // Update HTML lang attribute
    document.documentElement.lang = lang;
    currentLang = lang;
  }

  // NO auto-traducir al cargar. La página inicia en español.
  // Solo limpiar cualquier preferencia guardada previamente.
  localStorage.removeItem('aurelia-lang');

  // Add click listeners to buttons — solo traduce al hacer clic
  langButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const lang = this.getAttribute('data-lang');
      updateLanguage(lang);
    });
  });

  // ============================================
  // PASARELA DE PAGO FICTICIA (MOCK GATEWAY)
  // ============================================
  const checkoutModal = document.getElementById('checkoutModal');
  const checkoutOverlay = document.getElementById('checkoutOverlay');
  const checkoutClose = document.getElementById('checkoutClose');
  const mainBuyBtn = document.getElementById('mainBuyBtn');
  const stickyBuyBtn = document.getElementById('stickyBuyBtn');

  const stepForm = document.getElementById('checkoutStepForm');
  const stepProcessing = document.getElementById('checkoutStepProcessing');
  const stepSuccess = document.getElementById('checkoutStepSuccess');

  const fakeForm = document.getElementById('fakeCheckoutForm');
  const demoAutofillBtn = document.getElementById('demoAutofillBtn');

  // Form Fields
  const custNameInput = document.getElementById('custName');
  const custEmailInput = document.getElementById('custEmail');
  const custPhoneInput = document.getElementById('custPhone');
  const custAddressInput = document.getElementById('custAddress');
  const custDeptSelect = document.getElementById('custDept');

  // Virtual Card elements
  const cardNumberInput = document.getElementById('cardNumber');
  const cardExpInput = document.getElementById('cardExp');
  const cardCvvInput = document.getElementById('cardCvv');
  const previewCardNum = document.getElementById('previewCardNum');
  const previewCardName = document.getElementById('previewCardName');
  const previewCardExp = document.getElementById('previewCardExp');
  const cardBrandLogo = document.getElementById('cardBrandLogo');
  const inputCardIcon = document.getElementById('inputCardIcon');

  // Tabs
  const paymentTabs = document.querySelectorAll('.payment-tab');
  const tabPanels = {
    card: document.getElementById('tabCard'),
    paypal: document.getElementById('tabPaypal'),
    transfer: document.getElementById('tabTransfer')
  };
  let selectedPaymentMethod = 'card';

  // Processing elements
  const processingStatusText = document.getElementById('processingStatusText');
  const processingBar = document.getElementById('processingBar');

  // Success & Receipt elements
  const successCustomerName = document.getElementById('successCustomerName');
  const receiptOrderId = document.getElementById('receiptOrderId');
  const receiptDate = document.getElementById('receiptDate');
  const receiptPaymentMethod = document.getElementById('receiptPaymentMethod');
  const receiptAddress = document.getElementById('receiptAddress');
  const downloadReceiptBtn = document.getElementById('downloadReceiptBtn');
  const successFinishBtn = document.getElementById('successFinishBtn');

  // Current order state
  let currentOrderData = null;

  function openCheckout() {
    if (!checkoutModal) return;
    checkoutModal.classList.add('is-active');
    checkoutModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeCheckout() {
    if (!checkoutModal) return;
    checkoutModal.classList.remove('is-active');
    checkoutModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    stopConfetti();
    
    // Si ya completó la compra, resetear al formulario para la próxima
    setTimeout(function () {
      if (stepSuccess && stepSuccess.classList.contains('checkout-step--active')) {
        resetCheckoutToForm();
      }
    }, 400);
  }

  function resetCheckoutToForm() {
    if (stepForm) stepForm.classList.add('checkout-step--active');
    if (stepProcessing) stepProcessing.classList.remove('checkout-step--active');
    if (stepSuccess) stepSuccess.classList.remove('checkout-step--active');
    if (processingBar) processingBar.style.width = '0%';
  }

  // Open triggers
  if (mainBuyBtn) {
    mainBuyBtn.addEventListener('click', function (e) {
      e.preventDefault();
      openCheckout();
    });
  }

  if (stickyBuyBtn) {
    stickyBuyBtn.addEventListener('click', function (e) {
      e.preventDefault();
      openCheckout();
    });
  }

  // Close triggers
  if (checkoutClose) checkoutClose.addEventListener('click', closeCheckout);
  if (checkoutOverlay) checkoutOverlay.addEventListener('click', closeCheckout);

  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && checkoutModal && checkoutModal.classList.contains('is-active')) {
      closeCheckout();
    }
  });

  // ---------- PAYMENT METHOD TABS ----------
  paymentTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var target = this.getAttribute('data-tab');
      selectedPaymentMethod = target;

      paymentTabs.forEach(function (t) {
        t.classList.remove('payment-tab--active');
        t.setAttribute('aria-selected', 'false');
      });
      this.classList.add('payment-tab--active');
      this.setAttribute('aria-selected', 'true');

      Object.keys(tabPanels).forEach(function (key) {
        if (tabPanels[key]) {
          tabPanels[key].classList.toggle('tab-panel--active', key === target);
        }
      });
    });
  });

  // ---------- VIRTUAL CARD LIVE INTERACTION ----------
  function detectCardBrand(number) {
    var clean = number.replace(/\D/g, '');
    if (/^4/.test(clean)) return { name: 'VISA', icon: '' };
    if (/^(5[1-5]|2[2-7])/.test(clean)) return { name: 'MASTERCARD', icon: '' };
    if (/^3[47]/.test(clean)) return { name: 'AMEX', icon: '' };
    return { name: 'VISA', icon: '' };
  }

  if (cardNumberInput) {
    cardNumberInput.addEventListener('input', function (e) {
      var val = e.target.value.replace(/\D/g, '').substring(0, 16);
      var formatted = val.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
      e.target.value = formatted;

      var brand = detectCardBrand(val);
      if (cardBrandLogo) cardBrandLogo.textContent = brand.name;
      if (inputCardIcon) inputCardIcon.textContent = brand.icon;

      if (previewCardNum) {
        if (formatted.length > 0) {
          var padded = formatted.padEnd(19, '•');
          previewCardNum.textContent = padded;
        } else {
          previewCardNum.textContent = '•••• •••• •••• 4242';
        }
      }
    });
  }

  if (custNameInput) {
    custNameInput.addEventListener('input', function (e) {
      var name = e.target.value.trim().toUpperCase();
      if (previewCardName) {
        previewCardName.textContent = name || 'SOFÍA HENRÍQUEZ';
      }
    });
  }

  if (cardExpInput) {
    cardExpInput.addEventListener('input', function (e) {
      var val = e.target.value.replace(/\D/g, '').substring(0, 4);
      if (val.length >= 3) {
        val = val.substring(0, 2) + '/' + val.substring(2);
      }
      e.target.value = val;
      if (previewCardExp) {
        previewCardExp.textContent = val || '12/28';
      }
    });
  }

  if (cardCvvInput) {
    cardCvvInput.addEventListener('input', function (e) {
      e.target.value = e.target.value.replace(/\D/g, '').substring(0, 4);
    });
  }

  // ---------- DEMO AUTO-FILL BUTTON ----------
  if (demoAutofillBtn) {
    demoAutofillBtn.addEventListener('click', function () {
      if (custNameInput) custNameInput.value = 'Sofía Henríquez';
      if (custEmailInput) custEmailInput.value = 'sofia.henriquez@aureliaskincare.com';
      if (custPhoneInput) custPhoneInput.value = '+503 7845-9214';
      if (custAddressInput) custAddressInput.value = 'Colonia Escalón, Calle El Mirador #142';
      if (custDeptSelect) custDeptSelect.value = 'San Salvador';

      if (cardNumberInput) cardNumberInput.value = '4242 4242 4242 4242';
      if (cardExpInput) cardExpInput.value = '12/28';
      if (cardCvvInput) cardCvvInput.value = '842';

      if (previewCardNum) previewCardNum.textContent = '4242 4242 4242 4242';
      if (previewCardName) previewCardName.textContent = 'SOFÍA HENRÍQUEZ';
      if (previewCardExp) previewCardExp.textContent = '12/28';
      if (cardBrandLogo) cardBrandLogo.textContent = 'VISA';

      // Visual feedback
      demoAutofillBtn.style.transform = 'scale(0.96)';
      setTimeout(function () {
        demoAutofillBtn.style.transform = '';
      }, 150);
    });
  }

  // ---------- PROCESS PAYMENT SIMULATION ----------
  if (fakeForm) {
    fakeForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Gather customer data (with fallbacks if submitted blank in demo)
      var name = (custNameInput && custNameInput.value.trim()) || 'Sofía Henríquez';
      var email = (custEmailInput && custEmailInput.value.trim()) || 'sofia.henriquez@aureliaskincare.com';
      var phone = (custPhoneInput && custPhoneInput.value.trim()) || '+503 7845-9214';
      var address = (custAddressInput && custAddressInput.value.trim()) || 'Col. Escalón, Calle El Mirador #142';
      var dept = (custDeptSelect && custDeptSelect.value) || 'San Salvador';
      
      var cardNum = (cardNumberInput && cardNumberInput.value.trim()) || '4242 4242 4242 4242';
      var last4 = cardNum.replace(/\D/g, '').slice(-4) || '4242';
      var brand = detectCardBrand(cardNum).name;

      var randomNum = Math.floor(100000 + Math.random() * 900000);
      var orderId = '#AUR-' + randomNum;
      var now = new Date();
      var formattedDate = now.toLocaleDateString(currentLang === 'en' ? 'en-US' : 'es-SV', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      var methodDisplay = '';
      if (selectedPaymentMethod === 'paypal') {
        methodDisplay = currentLang === 'en' ? 'PayPal (aurelia.buyer@demo.com)' : 'PayPal Express (aurelia.buyer@demo.com)';
      } else if (selectedPaymentMethod === 'transfer') {
        methodDisplay = currentLang === 'en' ? 'Bank Transfer (Banco Agrícola)' : 'Transferencia Banco Agrícola (Cta #120-49281-0)';
      } else {
        methodDisplay = (currentLang === 'en' ? 'Card ' : 'Tarjeta ') + brand + ' (•••• ' + last4 + ')';
      }

      currentOrderData = {
        orderId: orderId,
        date: formattedDate,
        name: name,
        email: email,
        phone: phone,
        address: address + ', ' + dept,
        method: methodDisplay,
        total: '$68.80 USD'
      };

      // Transition to Step 2: Processing
      stepForm.classList.remove('checkout-step--active');
      stepProcessing.classList.add('checkout-step--active');

      var isEn = currentLang === 'en';
      var stages = [
        { pct: '25%', text: isEn ? 'Connecting with secure banking gateway...' : 'Conectando con la pasarela bancaria segura...' },
        { pct: '55%', text: isEn ? 'Verifying 3D Secure authorization...' : 'Validando encriptación y 3D Secure...' },
        { pct: '85%', text: isEn ? 'Authorizing transaction...' : 'Autorizando cargo por $68.80 USD...' },
        { pct: '100%', text: isEn ? 'Approved! Generating order receipt...' : '¡Aprobado! Generando orden y comprobante...' }
      ];

      var stepTime = 550;
      stages.forEach(function (stage, idx) {
        setTimeout(function () {
          if (processingBar) processingBar.style.width = stage.pct;
          if (processingStatusText) processingStatusText.textContent = stage.text;
        }, idx * stepTime);
      });

      // Complete checkout after stages
      setTimeout(function () {
        stepProcessing.classList.remove('checkout-step--active');
        stepSuccess.classList.add('checkout-step--active');

        // Populate receipt
        if (successCustomerName) successCustomerName.textContent = name.split(' ')[0];
        if (receiptOrderId) receiptOrderId.textContent = orderId;
        if (receiptDate) receiptDate.textContent = formattedDate;
        if (receiptPaymentMethod) receiptPaymentMethod.textContent = methodDisplay;
        if (receiptAddress) receiptAddress.textContent = address + ', ' + dept;

        // Launch celebratory confetti
        launchConfetti();
      }, stages.length * stepTime + 400);
    });
  }

  // ---------- ORDER DATA FALLBACK HELPER ----------
  function getCompleteOrderData() {
    if (currentOrderData && currentOrderData.orderId) {
      return currentOrderData;
    }
    var orderIdEl = document.getElementById('receiptOrderId');
    var dateEl = document.getElementById('receiptDate');
    var methodEl = document.getElementById('receiptPaymentMethod');
    var addressEl = document.getElementById('receiptAddress');
    var nameEl = document.getElementById('successCustomerName');

    var randomNum = Math.floor(100000 + Math.random() * 900000);
    var now = new Date();
    var fallbackDate = now.toLocaleDateString(currentLang === 'en' ? 'en-US' : 'es-SV', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    return {
      orderId: (orderIdEl && orderIdEl.textContent.trim()) || ('#AUR-' + randomNum),
      date: (dateEl && dateEl.textContent.trim() !== 'Hoy') ? dateEl.textContent.trim() : fallbackDate,
      name: (nameEl && nameEl.textContent.trim()) || (currentLang === 'en' ? 'Valued Customer' : 'Sofía Martínez'),
      email: 'sofia.martinez@ejemplo.com',
      phone: '+503 7890-1234',
      address: (addressEl && addressEl.textContent.trim()) || 'Colonia Escalón, Calle El Mirador #142, San Salvador',
      method: (methodEl && methodEl.textContent.trim()) || 'Transferencia Banco Agrícola (Cta #120-49281-0)',
      total: '$68.80 USD'
    };
  }

  // ---------- DOWNLOAD RECEIPT TXT ----------
  if (downloadReceiptBtn) {
    downloadReceiptBtn.addEventListener('click', function () {
      var data = getCompleteOrderData();
      var isEn = currentLang === 'en';
      var txnId = 'TXN-' + Math.random().toString(36).substring(2, 10).toUpperCase();
      var authCode = 'AUTH-' + Math.floor(100000 + Math.random() * 900000);
      var trackingCode = 'SV-EXP-' + Math.floor(100000 + Math.random() * 900000);
      var cleanOrderId = data.orderId.replace(/[^a-zA-Z0-9_-]/g, '');

      var receiptText = isEn ? [
        '========================================================================',
        '                   AURELIA 24K BOTANICAL SKINCARE                       ',
        '              OFFICIAL PAYMENT RECEIPT — DEMO CHECKOUT                  ',
        '========================================================================',
        '',
        'TRANSACTION SUMMARY',
        '------------------------------------------------------------------------',
        'Order Number:            ' + data.orderId,
        'Date & Time:             ' + data.date,
        'Payment Status:          PAID & AUTHORIZED (DEMO SIMULATION)',
        'Transaction ID:          ' + txnId,
        'Authorization Code:      ' + authCode + ' (3D-Secure Verified)',
        'Security Encryption:     256-bit SSL / SHA-256 Validated',
        '',
        'CUSTOMER & DELIVERY DETAILS',
        '------------------------------------------------------------------------',
        'Customer Name:           ' + data.name,
        'Email Address:           ' + data.email,
        'Phone Number:            ' + data.phone,
        'Shipping Destination:    ' + data.address,
        'Country:                 El Salvador',
        'Courier Service:         DHL Express Priority / Tracking: ' + trackingCode,
        'Estimated Delivery:      24 to 48 business hours',
        '',
        'PURCHASE BREAKDOWN',
        '------------------------------------------------------------------------',
        '1x Aurelia 24K Gold Serum (30ml) ......................... $86.00 USD',
        '   Promo Discount (Code: AURELIA20 - 20% OFF) ............ -$17.20 USD',
        '   Insured Express Shipping .............................. FREE ($0.00)',
        '------------------------------------------------------------------------',
        'TOTAL CHARGED:                                            $68.80 USD',
        'PAYMENT METHOD:                                           ' + data.method,
        '========================================================================',
        '',
        'WARRANTY & CUSTOMER SUPPORT',
        '------------------------------------------------------------------------',
        '* 30-Day Money-Back Guarantee: 100% satisfaction or full refund.',
        '* Customer Support: hola@aureliaskincare.com | +503 2264-9000',
        '* Aurelia Laboratories — Luxury Skincare Div. San Salvador, SV.',
        '',
        'Note: This is a simulated transaction receipt generated for demonstration',
        'purposes. No real monetary charges were made.',
        '',
        'Thank you for joining the Aurelia 24K golden skincare ritual!',
        '========================================================================'
      ].join('\r\n') : [
        '========================================================================',
        '                   AURELIA 24K BOTANICAL SKINCARE                       ',
        '            COMPROBANTE OFICIAL DE PAGO — PASARELA DEMO                 ',
        '========================================================================',
        '',
        'RESUMEN DE LA TRANSACCIÓN',
        '------------------------------------------------------------------------',
        'Número de Pedido:        ' + data.orderId,
        'Fecha y Hora:            ' + data.date,
        'Estado del Pago:         PAGADO Y AUTORIZADO (TRANSACCIÓN DEMO EXITOSA)',
        'ID de Transacción:       ' + txnId,
        'Código de Autorización:  ' + authCode + ' (3D-Secure Verificado)',
        'Seguridad Bancaria:      Encriptación SSL 256-bit / SHA-256 Validado',
        '',
        'DATOS DEL CLIENTE Y ENVÍO',
        '------------------------------------------------------------------------',
        'Nombre del Titular:      ' + data.name,
        'Correo Electrónico:      ' + data.email,
        'Teléfono de Contacto:    ' + data.phone,
        'Dirección de Entrega:    ' + data.address,
        'País:                    El Salvador',
        'Servicio de Envíos:      DHL Express El Salvador / Guía: ' + trackingCode,
        'Tiempo Estimado:         24 a 48 horas hábiles',
        '',
        'DESGLOSE DE COMPRA',
        '------------------------------------------------------------------------',
        '1x Sérum Aurelia 24K (30ml) ............................. $86.00 USD',
        '   Descuento Promocional (Código: AURELIA20 - 20% OFF) ... -$17.20 USD',
        '   Envío Nacional Prioritario Asegurado .................. GRATIS ($0.00)',
        '------------------------------------------------------------------------',
        'TOTAL ABONADO:                                            $68.80 USD',
        'MÉTODO DE PAGO:                                           ' + data.method,
        '========================================================================',
        '',
        'GARANTÍA Y ATENCIÓN AL CLIENTE',
        '------------------------------------------------------------------------',
        '* Garantía Aurelia: 30 días de satisfacción total o devolución íntegra.',
        '* Soporte y Asistencia: hola@aureliaskincare.com | +503 2264-9000',
        '* Aurelia Laboratories — Luxury Skincare Div. San Salvador, El Salvador.',
        '',
        'Nota: Este documento es un comprobante de transacción simulada generado para',
        'fines demostrativos. No se efectuó ningún débito monetario real.',
        '',
        '¡Gracias por formar parte del ritual dorado Aurelia!',
        '========================================================================'
      ].join('\r\n');

      var blob = new Blob(['\uFEFF' + receiptText], { type: 'text/plain;charset=utf-8' });
      var url = URL.createObjectURL(blob);
      var link = document.createElement('a');
      link.href = url;
      link.download = (isEn ? 'Aurelia_Payment_Receipt_' : 'Comprobante_Pago_Aurelia_') + cleanOrderId + '.txt';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(function () {
        URL.revokeObjectURL(url);
      }, 3000);

      var textEl = document.getElementById('downloadReceiptText');
      var originalText = textEl ? textEl.innerHTML : downloadReceiptBtn.innerHTML;
      downloadReceiptBtn.classList.add('is-downloaded');
      if (textEl) {
        textEl.textContent = isEn ? '✓ Downloaded!' : '✓ ¡Comprobante Descargado!';
      }
      setTimeout(function () {
        downloadReceiptBtn.classList.remove('is-downloaded');
        if (textEl) {
          textEl.innerHTML = originalText;
        }
      }, 3000);
    });
  }

  // ---------- PRINT / PDF RECEIPT ----------
  var printReceiptBtn = document.getElementById('printReceiptBtn');
  if (printReceiptBtn) {
    printReceiptBtn.addEventListener('click', function () {
      var data = getCompleteOrderData();
      var isEn = currentLang === 'en';
      var txnId = 'TXN-' + Math.random().toString(36).substring(2, 10).toUpperCase();
      var authCode = 'AUTH-' + Math.floor(100000 + Math.random() * 900000);
      var trackingCode = 'SV-EXP-' + Math.floor(100000 + Math.random() * 900000);

      var printWin = window.open('', '_blank', 'width=800,height=900');
      if (!printWin) {
        alert(isEn ? 'Please allow popups to view and print the receipt.' : 'Por favor habilita las ventanas emergentes para ver e imprimir el comprobante.');
        return;
      }

      var html = '<!DOCTYPE html>' +
        '<html>' +
        '<head>' +
        '<meta charset="utf-8">' +
        '<title>' + (isEn ? 'Official Payment Receipt - ' : 'Comprobante Oficial de Pago - ') + data.orderId + '</title>' +
        '<link rel="preconnect" href="https://fonts.googleapis.com">' +
        '<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Plus+Jakarta+Sans:wght@400;600;700&display=swap" rel="stylesheet">' +
        '<style>' +
        'body { font-family: "Plus Jakarta Sans", sans-serif; margin: 0; padding: 32px; background: #FAF8F5; color: #2C2622; line-height: 1.5; }' +
        '.voucher { max-width: 680px; margin: 0 auto; background: #FFFFFF; border: 2px solid #D4A84B; border-radius: 12px; padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); position: relative; }' +
        '.header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #EFE8DC; padding-bottom: 24px; margin-bottom: 24px; }' +
        '.logo { font-family: "Cinzel", serif; font-size: 26px; font-weight: 700; color: #B38628; letter-spacing: 0.1em; }' +
        '.badge-paid { background: #E8F5E9; color: #2E7D32; border: 1px solid #A5D6A7; font-weight: 700; font-size: 12px; padding: 6px 14px; border-radius: 20px; display: inline-block; letter-spacing: 0.08em; }' +
        '.meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 28px; }' +
        '.meta-card { background: #FAF8F5; padding: 16px; border-radius: 8px; border: 1px solid #EFE8DC; font-size: 13px; }' +
        '.meta-card strong { display: block; font-size: 11px; text-transform: uppercase; color: #8C7B70; margin-bottom: 6px; letter-spacing: 0.05em; }' +
        '.table { width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px; }' +
        '.table th { text-align: left; padding: 10px; background: #FAF8F5; border-bottom: 2px solid #EFE8DC; color: #5A4E46; font-size: 12px; text-transform: uppercase; }' +
        '.table td { padding: 12px 10px; border-bottom: 1px solid #EFE8DC; }' +
        '.table .num { text-align: right; }' +
        '.total-row { font-size: 17px; font-weight: 700; color: #B38628; }' +
        '.footer { margin-top: 30px; padding-top: 20px; border-top: 1px dashed #D4A84B; font-size: 12px; color: #8C7B70; text-align: center; }' +
        '.print-bar { text-align: center; margin-bottom: 20px; }' +
        '.print-btn { background: #D4A84B; color: #000; border: none; padding: 12px 28px; font-weight: 700; border-radius: 6px; cursor: pointer; font-size: 14px; }' +
        '@media print { .print-bar { display: none; } body { padding: 0; background: #fff; } .voucher { box-shadow: none; border-color: #333; } }' +
        '</style>' +
        '</head>' +
        '<body>' +
        '<div class="print-bar">' +
        '<button class="print-btn" onclick="window.print()">' + (isEn ? '🖨️ Print / Save as PDF' : '🖨️ Imprimir / Guardar como PDF') + '</button>' +
        '</div>' +
        '<div class="voucher">' +
        '<div class="header">' +
        '<div><div class="logo">AURELIA 24K</div><div style="font-size:12px;color:#8C7B70;margin-top:4px;">Botanical Luxury Skincare S.A. de C.V.</div></div>' +
        '<div style="text-align:right;"><span class="badge-paid">✓ ' + (isEn ? 'PAYMENT APPROVED' : 'PAGO APROBADO') + '</span><div style="font-size:12px;color:#8C7B70;margin-top:6px;">' + (isEn ? 'DEMO SIMULATION' : 'SIMULACIÓN DEMO') + '</div></div>' +
        '</div>' +
        '<div class="meta-grid">' +
        '<div class="meta-card"><strong>' + (isEn ? 'Order & Transaction' : 'Pedido y Transacción') + '</strong><div><b>' + data.orderId + '</b></div><div>' + data.date + '</div><div>ID: ' + txnId + '</div><div>Auth: ' + authCode + ' (3DS)</div></div>' +
        '<div class="meta-card"><strong>' + (isEn ? 'Customer & Shipping' : 'Cliente y Envío') + '</strong><div><b>' + data.name + '</b></div><div>' + data.email + '</div><div>' + data.address + '</div><div>' + (isEn ? 'Tracking: ' : 'Guía: ') + trackingCode + '</div></div>' +
        '</div>' +
        '<table class="table">' +
        '<thead><tr><th>' + (isEn ? 'Description' : 'Descripción') + '</th><th>' + (isEn ? 'Qty' : 'Cant') + '</th><th class="num">' + (isEn ? 'Amount' : 'Importe') + '</th></tr></thead>' +
        '<tbody>' +
        '<tr><td><b>Sérum Aurelia 24K (30ml)</b><br><small style="color:#8C7B70">' + (isEn ? 'Pure 24K Gold & Hyaluronic Acid' : 'Micropartículas de Oro 24K + Ácido Hialurónico') + '</small></td><td>1</td><td class="num">$86.00 USD</td></tr>' +
        '<tr style="color:#2E7D32;"><td>' + (isEn ? 'Promo Discount (AURELIA20)' : 'Descuento Promocional (AURELIA20)') + '</td><td>-</td><td class="num">-$17.20 USD</td></tr>' +
        '<tr style="color:#2E7D32;"><td>' + (isEn ? 'Insured Express Shipping' : 'Envío Express Asegurado') + '</td><td>-</td><td class="num">' + (isEn ? 'FREE' : 'GRATIS') + '</td></tr>' +
        '<tr class="total-row"><td colspan="2">' + (isEn ? 'TOTAL CHARGED (' : 'TOTAL ABONADO (') + data.method + ')</td><td class="num">' + data.total + '</td></tr>' +
        '</tbody>' +
        '</table>' +
        '<div class="footer">' +
        '<p><b>' + (isEn ? '30-Day Total Satisfaction Guarantee' : 'Garantía Aurelia: 30 Días de Satisfacción Total') + '</b><br>' +
        (isEn ? 'Customer Care: hola@aureliaskincare.com | San Salvador, El Salvador' : 'Atención al Cliente: hola@aureliaskincare.com | San Salvador, El Salvador') + '<br>' +
        '<small>' + (isEn ? 'Demonstration voucher generated by Aurelia Skincare interactive checkout.' : 'Comprobante de demostración generado por la pasarela interactiva de Aurelia Skincare.') + '</small></p>' +
        '</div>' +
        '</div>' +
        '</body>' +
        '</html>';

      printWin.document.open();
      printWin.document.write(html);
      printWin.document.close();
    });
  }

  if (successFinishBtn) {
    successFinishBtn.addEventListener('click', closeCheckout);
  }

  // ---------- CONFETTI ANIMATION (CANVAS) ----------
  var confettiCanvas = document.getElementById('confettiCanvas');
  var confettiCtx = confettiCanvas ? confettiCanvas.getContext('2d') : null;
  var confettiParticles = [];
  var confettiAnimId = null;
  var confettiRunning = false;
  var confettiStartTime = 0;
  var CONFETTI_DURATION_MS = 2300; // Complete duration 2.3 seconds (vanishes within 2-3s)

  function resizeConfetti() {
    if (!confettiCanvas) return;
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeConfetti);

  function launchConfetti() {
    if (!confettiCanvas || !confettiCtx) return;
    stopConfetti();
    resizeConfetti();
    confettiParticles = [];
    confettiStartTime = Date.now();

    var colors = ['#D4A84B', '#F0D068', '#C49A3C', '#FFF3D6', '#FFFFFF', '#81C784'];
    var originX = window.innerWidth * 0.5;
    // Launch from checkmark area, bursting outwards to sides so particles do not cover the title
    var originY = window.innerHeight * 0.24;

    for (var i = 0; i < 75; i++) {
      var angle = (Math.random() * Math.PI) - (Math.PI * 0.5);
      var speed = Math.random() * 10 + 5;
      var vx = Math.cos(angle) * speed * (Math.random() > 0.5 ? 1.3 : -1.3);
      var vy = -Math.abs(Math.sin(angle) * speed) - 2.5;

      confettiParticles.push({
        x: originX + (Math.random() - 0.5) * 60,
        y: originY + (Math.random() - 0.5) * 30,
        vx: vx,
        vy: vy,
        size: Math.random() * 7 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 12,
        opacity: 1
      });
    }

    confettiRunning = true;
    animateConfetti();

    setTimeout(function () {
      stopConfetti();
    }, CONFETTI_DURATION_MS);
  }

  function animateConfetti() {
    if (!confettiRunning || !confettiCtx) return;
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    var elapsed = Date.now() - confettiStartTime;
    if (elapsed >= CONFETTI_DURATION_MS) {
      stopConfetti();
      return;
    }

    // Global fade factor: particles stay vivid for ~1.2s then fade swiftly to 0 by 2.3s
    var globalFade = 1;
    if (elapsed > 1200) {
      globalFade = Math.max(0, 1 - (elapsed - 1200) / (CONFETTI_DURATION_MS - 1200));
    }

    confettiParticles.forEach(function (p) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.32; // Gravity
      p.vx *= 0.96; // Air resistance
      p.rotation += p.rotSpeed;

      var currentAlpha = p.opacity * globalFade;

      if (currentAlpha > 0.01) {
        confettiCtx.save();
        confettiCtx.translate(p.x, p.y);
        confettiCtx.rotate((p.rotation * Math.PI) / 180);
        confettiCtx.globalAlpha = Math.max(currentAlpha, 0);
        confettiCtx.fillStyle = p.color;
        confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.35);
        confettiCtx.restore();
      }
    });

    confettiParticles = confettiParticles.filter(function (p) {
      return p.y < window.innerHeight + 40 && globalFade > 0;
    });

    if (confettiParticles.length > 0 && confettiRunning && globalFade > 0) {
      confettiAnimId = requestAnimationFrame(animateConfetti);
    } else {
      stopConfetti();
    }
  }

  function stopConfetti() {
    confettiRunning = false;
    if (confettiAnimId) {
      cancelAnimationFrame(confettiAnimId);
      confettiAnimId = null;
    }
    if (confettiCtx && confettiCanvas) {
      confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
  }

})();
