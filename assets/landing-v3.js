
(() => {
  'use strict';

  const qs = new URLSearchParams(window.location.search);
  const body = document.body;
  const service = body.dataset.service || 'ibsalut';
  const category = body.dataset.category || 'imagen';
  const pageLabel = body.dataset.pageLabel || 'OpoSanCV';
  const campaignDefault = 'landing_v3_' + service + '_' + category;
  const ATTRIBUTION_PARAMS = [
    'utm_source','utm_medium','utm_campaign','utm_id','utm_content','utm_term',
    'fbclid','gclid','gbraid','wbraid','gad_source','gad_campaignid'
  ];

  function safeTrack(name, params) {
    if (typeof window.gtag === 'function') window.gtag('event', name, params || {});
    if (typeof window.fbq === 'function') window.fbq('trackCustom', name, params || {});
  }

  function decorateAppLinks() {
    document.querySelectorAll('a[href^="https://app.oposancv.es"]').forEach((link) => {
      try {
        const url = new URL(link.href);
        url.searchParams.set('servicio', service);
        url.searchParams.set('categoria', category);
        if (!url.searchParams.has('utm_source')) url.searchParams.set('utm_source', qs.get('utm_source') || 'oposancv_web');
        if (!url.searchParams.has('utm_medium')) url.searchParams.set('utm_medium', qs.get('utm_medium') || 'organic');
        if (!url.searchParams.has('utm_campaign')) url.searchParams.set('utm_campaign', qs.get('utm_campaign') || campaignDefault);

        for (const key of ATTRIBUTION_PARAMS) {
          const value = qs.get(key);
          if (value) url.searchParams.set(key, value);
        }

        try {
          const consent = localStorage.getItem('oposancv_optional_cookies_consent_v2');
          if (consent === 'accepted' || consent === 'rejected') {
            url.searchParams.set('oposancv_consent', consent);
          }
        } catch (_) {}

        link.href = url.toString();

        if (link.dataset.landingBound !== 'true') {
          link.dataset.landingBound = 'true';
          link.addEventListener('click', () => {
            safeTrack('start_free_click', {
              service,
              category,
              page_label: pageLabel,
              placement: link.dataset.placement || 'landing'
            });
          });
        }
      } catch (_) {}
    });
  }

  const exam = new Date(2026, 10, 8, 0, 0, 0);
  const today = new Date();
  today.setHours(0,0,0,0);
  const days = Math.ceil((exam.getTime() - today.getTime()) / 86400000);

  document.querySelectorAll('[data-exam-countdown]').forEach((el) => {
    el.textContent = days > 1 ? 'faltan ' + days + ' días' :
      days === 1 ? 'falta 1 día' :
      days === 0 ? 'es hoy' : 'examen celebrado';
  });
  document.querySelectorAll('[data-exam-days]').forEach((el) => {
    el.textContent = days >= 0 ? String(days) : '0';
  });

  const menuBtn = document.getElementById('menuBtn');
  const mainNav = document.getElementById('mainNav');
  if (menuBtn && mainNav) {
    menuBtn.addEventListener('click', () => {
      const open = mainNav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    mainNav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
      mainNav.classList.remove('open');
      menuBtn.setAttribute('aria-expanded','false');
    }));
  }

  const QUESTION_BANK = {
    imagen: {
      q: '¿Qué técnica utiliza rayos X para obtener imágenes seccionales?',
      a: ['Ecografía','Resonancia magnética','Tomografía computarizada','Electroencefalografía'],
      c: 2,
      e: 'La tomografía computarizada utiliza rayos X y reconstrucción computacional para obtener imágenes seccionales.'
    },
    laboratorio: {
      q: '¿Qué anticoagulante se utiliza habitualmente en los tubos destinados a hemograma?',
      a: ['EDTA','Citrato para todo uso','Heparina sódica siempre','Fluoruro sin anticoagulante'],
      c: 0,
      e: 'El EDTA se utiliza habitualmente en hematología porque ayuda a preservar la morfología celular.'
    }
  };

  const demo = document.querySelector('[data-single-demo]');
  if (demo) {
    const item = QUESTION_BANK[category] || QUESTION_BANK.imagen;
    const q = demo.querySelector('[data-single-question]');
    const options = demo.querySelector('[data-single-options]');
    const feedback = demo.querySelector('[data-single-feedback]');
    const feedbackTitle = demo.querySelector('[data-single-feedback-title]');
    const feedbackText = demo.querySelector('[data-single-feedback-text]');
    let locked = false;

    q.textContent = item.q;
    options.innerHTML = '';

    item.a.forEach((label, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'single-option';
      btn.innerHTML = '<span class="letter"></span><span class="answer"></span>';
      btn.children[0].textContent = String.fromCharCode(65 + i);
      btn.children[1].textContent = label;
      btn.addEventListener('click', () => {
        if (locked) return;
        locked = true;
        const buttons = [...options.querySelectorAll('.single-option')];
        buttons.forEach((b, idx) => {
          if (idx === item.c) b.classList.add('correct');
          else if (idx === i) b.classList.add('wrong');
          else b.classList.add('dim');
          b.disabled = true;
        });

        feedbackTitle.textContent = i === item.c ? '✓ Correcta' : '✕ Incorrecta';
        feedbackText.textContent = item.e;
        feedback.hidden = false;
        safeTrack('landing_demo_answer', {
          service,
          category,
          correct: i === item.c,
          answer: String.fromCharCode(65 + i)
        });
      });
      options.appendChild(btn);
    });
  }

  document.querySelectorAll('[data-track]').forEach((el) => {
    el.addEventListener('click', () => {
      safeTrack(el.dataset.track, {
        service,
        category,
        page_label: pageLabel,
        placement: el.dataset.placement || ''
      });
    });
  });

  decorateAppLinks();
})();
