(() => {
  function applyAcquisitionPersonalization() {
    const params = new URLSearchParams(window.location.search);
    const campaign = (params.get('utm_campaign') || '').toLowerCase();
    const content = (params.get('utm_content') || '').toLowerCase();
    const source = (params.get('utm_source') || '').toLowerCase();
    const signal = [campaign, content, source].join(' ');

    const eyebrow = document.querySelector('[data-acq-eyebrow]');
    const title = document.querySelector('[data-acq-title]');
    const lead = document.querySelector('[data-acq-lead]');
    const ctas = document.querySelectorAll('[data-acq-cta]');
    const cardTitle = document.querySelector('[data-acq-card-title]');
    const cardMeta = document.querySelector('[data-acq-card-meta]');

    const presets = [
      {
        match: /(ibsalut|ib-salut).*(lab|laboratorio)|(lab|laboratorio).*(ibsalut|ib-salut)/,
        label: 'IB-SALUT · Laboratorio · Illes Balears',
        title: 'Prepárate para Laboratorio IB-SALUT antes del 8 de noviembre',
        lead: '44 plazas convocadas y una preparación específica con 40 temas, tests, simulacros y baremo. Empieza con 10 preguntas gratis al día y prueba 7 días Premium tras tus primeras 10.',
        cta: 'Empezar Laboratorio gratis',
        cardTitle: 'Laboratorio · IB-SALUT',
        cardMeta: '44 plazas · 40 temas · examen 08/11/2026',
        pageLabel: 'Laboratorio IB-SALUT'
      },
      {
        match: /(ibsalut|ib-salut).*(img|imagen|radio|radiodiagnostico)|(img|imagen|radio|radiodiagnostico).*(ibsalut|ib-salut)/,
        label: 'IB-SALUT · Radiodiagnóstico · Illes Balears',
        title: 'Prepárate para Radiodiagnóstico IB-SALUT antes del 8 de noviembre',
        lead: '47 plazas convocadas y una preparación específica con 40 temas, tests y simulacros. Empieza con 10 preguntas gratis al día y prueba 7 días Premium tras tus primeras 10.',
        cta: 'Empezar Radiodiagnóstico gratis',
        cardTitle: 'Radiodiagnóstico · IB-SALUT',
        cardMeta: '47 plazas · 40 temas · examen 08/11/2026',
        pageLabel: 'Radiodiagnóstico IB-SALUT'
      },
      {
        match: /sermas.*(lab|laboratorio)|(lab|laboratorio).*sermas/,
        label: 'SERMAS · Laboratorio · Comunidad de Madrid',
        title: 'Entrena Laboratorio SERMAS con una preparación separada para Madrid',
        lead: 'Practica por temas, haz simulacros y controla tu progreso sin mezclar reglas ni resultados con otras comunidades. Empieza gratis y prueba Premium antes de decidir.',
        cta: 'Empezar Laboratorio SERMAS',
        cardTitle: 'Laboratorio · SERMAS',
        cardMeta: 'Temario, simulacros y progreso propios',
        pageLabel: 'Laboratorio SERMAS'
      },
      {
        match: /sermas.*(img|imagen)|(img|imagen).*sermas/,
        label: 'SERMAS · Imagen · Comunidad de Madrid',
        title: 'Entrena Imagen SERMAS con una preparación separada para Madrid',
        lead: 'Practica por temas, haz simulacros y controla tu progreso sin mezclar reglas ni resultados con otras comunidades. Empieza gratis y prueba Premium antes de decidir.',
        cta: 'Empezar Imagen SERMAS',
        cardTitle: 'Imagen · SERMAS',
        cardMeta: 'Temario, simulacros y progreso propios',
        pageLabel: 'Imagen SERMAS'
      },
      {
        match: /gva.*(lab|laboratorio)|(lab|laboratorio).*gva/,
        label: 'GVA · Laboratorio · Comunitat Valenciana',
        title: 'Empieza a entrenar Laboratorio GVA hoy',
        lead: 'Tests por temas, simulacros, repaso de falladas y progreso específico de tu oposición. Empieza gratis y decide después si quieres Premium.',
        cta: 'Empezar Laboratorio GVA',
        cardTitle: 'Laboratorio · GVA',
        cardMeta: 'Preparación específica de la Generalitat Valenciana',
        pageLabel: 'Laboratorio GVA'
      },
      {
        match: /gva.*(img|imagen)|(img|imagen).*gva/,
        label: 'GVA · Imagen · Comunitat Valenciana',
        title: 'Empieza a entrenar Imagen GVA hoy',
        lead: 'Tests por temas, simulacros, repaso de falladas y progreso específico de tu oposición. Empieza gratis y decide después si quieres Premium.',
        cta: 'Empezar Imagen GVA',
        cardTitle: 'Imagen · GVA',
        cardMeta: 'Preparación específica de la Generalitat Valenciana',
        pageLabel: 'Imagen GVA'
      }
    ];

    const preset = presets.find((item) => item.match.test(signal));
    if (!preset) return;

    if (eyebrow) eyebrow.textContent = preset.label;
    if (title) title.textContent = preset.title;
    if (lead) lead.textContent = preset.lead;
    ctas.forEach((cta) => { cta.textContent = preset.cta; });
    if (cardTitle) cardTitle.textContent = preset.cardTitle;
    if (cardMeta) cardMeta.textContent = preset.cardMeta;
    document.body.setAttribute('data-page-label', preset.pageLabel);
  }

  applyAcquisitionPersonalization();

  const link = document.querySelector('[data-whatsapp-support]');
  if (link) {
    const configured = (window.OpoSanCVSupport && window.OpoSanCVSupport.whatsapp) || '';
    const number = (link.getAttribute('data-number') || configured || '').replace(/\D/g,'');
    const page = document.body.getAttribute('data-page-label') || 'OpoSanCV';
    if (!number) {
      link.hidden = true;
    } else {
      const message = encodeURIComponent('Hola, necesito ayuda con ' + page + '.');
      link.href = 'https://wa.me/' + number + '?text=' + message;
      link.hidden = false;
    }
  }

  document.querySelectorAll('[data-scroll]').forEach((el) => {
    el.addEventListener('click', (e) => {
      const target = document.querySelector(el.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({behavior:'smooth',block:'start'});
      }
    });
  });
})();