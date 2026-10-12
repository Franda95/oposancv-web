
(() => {
  'use strict';

  const ATTRIBUTION_PARAMS = [
    'utm_source','utm_medium','utm_campaign','utm_id','utm_content','utm_term',
    'fbclid','gclid','gbraid','wbraid','gad_source','gad_campaignid'
  ];

  const SERVICES = [
    { id:'gva', label:'GVA', sub:'Comunitat Valenciana' },
    { id:'sermas', label:'SERMAS', sub:'Comunidad de Madrid' },
    { id:'ibsalut', label:'IB-SALUT', sub:'Illes Balears' }
  ];

  const LANDINGS = {
    gva:{
      imagen:'/gva/imagen/',
      laboratorio:'/gva/laboratorio/'
    },
    sermas:{
      imagen:'/sermas/imagen/',
      laboratorio:'/sermas/laboratorio/'
    },
    ibsalut:{
      imagen:'/ibsalut/radiodiagnostico/',
      laboratorio:'/ibsalut/laboratorio/'
    }
  };

  const qs = new URLSearchParams(window.location.search);
  const initialService = ['gva','sermas','ibsalut'].includes(qs.get('servicio')) ? qs.get('servicio') : 'ibsalut';
  const initialCategory = ['imagen','laboratorio'].includes(qs.get('categoria')) ? qs.get('categoria') : 'imagen';
  const state = { service:initialService, category:initialCategory, picked:null };

  function safeTrack(eventName, params) {
    params = params || {};
    if (typeof window.gtag === 'function') window.gtag('event', eventName, params);
    if (typeof window.fbq === 'function') window.fbq('trackCustom', eventName, params);
  }

  function appUrl(service, category) {
    const url = new URL('https://app.oposancv.es/');
    url.searchParams.set('servicio', service);
    url.searchParams.set('categoria', category);
    url.searchParams.set('utm_source', qs.get('utm_source') || 'oposancv_web');
    url.searchParams.set('utm_medium', qs.get('utm_medium') || 'organic');
    url.searchParams.set('utm_campaign', qs.get('utm_campaign') || 'home_v3');

    for (const key of ATTRIBUTION_PARAMS) {
      const value = qs.get(key);
      if (value && !url.searchParams.has(key)) url.searchParams.set(key, value);
    }

    try {
      const consent = localStorage.getItem('oposancv_optional_cookies_consent_v2');
      if (consent === 'accepted' || consent === 'rejected') {
        url.searchParams.set('oposancv_consent', consent);
      }
    } catch (_) {}

    return url.toString();
  }

  function chip(label, sub, pressed, onClick) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'chip';
    button.setAttribute('aria-pressed', pressed ? 'true' : 'false');

    const strong = document.createElement('strong');
    strong.textContent = label;
    const small = document.createElement('small');
    small.textContent = sub;

    button.appendChild(strong);
    button.appendChild(small);
    button.addEventListener('click', onClick);
    return button;
  }

  function renderPicker() {
    const isIb = state.service === 'ibsalut';
    const servicesEl = document.getElementById('services');
    const categoriesEl = document.getElementById('categories');
    if (!servicesEl || !categoriesEl) return;

    servicesEl.innerHTML = '';
    categoriesEl.innerHTML = '';

    SERVICES.forEach((service) => {
      servicesEl.appendChild(chip(
        service.label,
        service.sub,
        state.service === service.id,
        () => {
          state.service = service.id;
          safeTrack('opposition_service_select', {service:service.id});
          renderPicker();
        }
      ));
    });

    const imageLabel = isIb ? 'Radiodiagnóstico' : 'Imagen';
    const categories = [
      {id:'imagen', label:imageLabel, sub:'Imagen para el Diagnóstico y Medicina Nuclear'},
      {id:'laboratorio', label:'Laboratorio', sub:'Técnico/a Especialista de Laboratorio'}
    ];

    categories.forEach((category) => {
      categoriesEl.appendChild(chip(
        category.label,
        category.sub,
        state.category === category.id,
        () => {
          state.category = category.id;
          safeTrack('opposition_category_select', {service:state.service,category:category.id});
          renderPicker();
        }
      ));
    });

    const serviceName = SERVICES.find((service) => service.id === state.service).label;
    const categoryLabel = state.category === 'imagen' ? imageLabel : 'Laboratorio';
    document.getElementById('panel-title').textContent = categoryLabel + ' · ' + serviceName;

    let tiles;
    let note;

    if (state.service === 'ibsalut') {
      tiles = [
        ['Plazas', state.category === 'imagen' ? '47' : '44'],
        ['Temas','40'],
        ['Preguntas','6.400'],
        ['Examen','8 nov 2026']
      ];
      note = 'Simulacro de 100 preguntas + 10 de reserva en 150 minutos, con penalización de ¼ por error.';
      if (window.__ibsalutDays >= 0) note += ' Quedan ' + window.__ibsalutDays + ' días para el examen.';
    } else if (state.service === 'sermas') {
      tiles = [
        ['Plazas', state.category === 'imagen' ? '294' : '372'],
        ['Preguntas + reserva','90 + 10'],
        ['Tiempo','100 min'],
        ['Penalización','−0,25']
      ];
      note = 'Preparación específica de SERMAS con progreso independiente y simulacro configurado para esta oposición.';
    } else {
      tiles = [
        ['Temario','Propio'],
        ['Simulacros','Específicos'],
        ['Progreso','Independiente'],
        ['Premium','Por oposición']
      ];
      note = 'Tu preparación de GVA mantiene su temario, simulacros, progreso y Premium separados del resto.';
    }

    const tilesEl = document.getElementById('tiles');
    tilesEl.innerHTML = '';
    tiles.forEach((tile) => {
      const item = document.createElement('div');
      item.className = 'tile';
      const label = document.createElement('span');
      label.textContent = tile[0];
      const value = document.createElement('strong');
      value.textContent = tile[1];
      item.appendChild(label);
      item.appendChild(value);
      tilesEl.appendChild(item);
    });

    document.getElementById('panel-note').textContent = note;

    const cta = document.getElementById('selectedCta');
    cta.href = appUrl(state.service, state.category);
    cta.onclick = () => {
      safeTrack('start_free_click', {
        service:state.service,
        category:state.category,
        placement:'selector'
      });
    };

    const info = document.getElementById('selectedInfo');
    info.href = LANDINGS[state.service][state.category];
    info.onclick = () => {
      safeTrack('opposition_info_click', {
        service:state.service,
        category:state.category
      });
    };
  }

  const TEXTS = [
    'Solo a mayores de edad',
    'Únicamente a funcionarios públicos',
    'Los españoles, en los términos del artículo 19',
    'Exclusivamente a residentes de larga duración'
  ];
  const LETTERS = ['A','B','C','D'];
  const CORRECT = 2;

  function renderQuiz() {
    const options = document.getElementById('options');
    if (!options) return;
    options.innerHTML = '';

    TEXTS.forEach((text, index) => {
      let status = 'idle';
      let tag = '';

      if (state.picked !== null) {
        if (index === CORRECT) {
          status = 'correct';
          tag = '✓ Correcta';
        } else if (index === state.picked) {
          status = 'wrong';
          tag = '✕ Tu respuesta';
        } else {
          status = 'dim';
        }
      }

      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'opt';
      button.setAttribute('data-state', status);
      button.innerHTML = '<span class="letter"></span><span class="txt"></span><span class="tag"></span>';
      button.children[0].textContent = LETTERS[index];
      button.children[1].textContent = text;
      button.children[2].textContent = tag;

      button.addEventListener('click', () => {
        if (state.picked !== null) return;
        state.picked = index;
        safeTrack('demo_question_answer', {
          correct:index === CORRECT,
          answer:LETTERS[index]
        });
        renderQuiz();
      });

      options.appendChild(button);
    });

    const answered = state.picked !== null;
    document.getElementById('feedback').hidden = !answered;
    document.getElementById('hint').hidden = answered;
    document.getElementById('feedback-title').textContent =
      state.picked === CORRECT ? '¡Correcto!' : 'Incorrecta: la respuesta es la C';
  }

  const reset = document.getElementById('reset');
  if (reset) {
    reset.addEventListener('click', () => {
      state.picked = null;
      renderQuiz();
    });
  }

  const menuBtn = document.getElementById('menuBtn');
  const mainNav = document.getElementById('mainNav');
  if (menuBtn && mainNav) {
    menuBtn.addEventListener('click', () => {
      const open = mainNav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    mainNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        menuBtn.setAttribute('aria-expanded','false');
      });
    });
  }

  const exam = new Date(2026, 10, 8, 0, 0, 0);
  const today = new Date();
  today.setHours(0,0,0,0);
  const days = Math.ceil((exam.getTime() - today.getTime()) / 86400000);
  window.__ibsalutDays = days;

  const countdown = document.getElementById('countdown');
  if (countdown) {
    countdown.textContent =
      days > 1 ? 'faltan ' + days + ' días' :
      days === 1 ? 'falta 1 día' :
      days === 0 ? 'es hoy' : 'examen celebrado';
  }

  document.querySelectorAll('[data-track]').forEach((element) => {
    element.addEventListener('click', () => {
      safeTrack(element.getAttribute('data-track'), {
        href:element.getAttribute('href') || ''
      });
    });
  });

  renderPicker();
  renderQuiz();
})();
