(() => {
  const link = document.querySelector('[data-whatsapp-support]');
  if (link) {
    const configured = (window.OpoSanCVSupport && window.OpoSanCVSupport.whatsapp) || '';
    const number = (link.getAttribute('data-number') || configured || '').replace(/\D/g,'');
    const page = document.body.getAttribute('data-page-label') || 'OpoSanCV';
    if (!number) {
      link.hidden = true;
    } else {
      const text = encodeURIComponent('Hola, necesito ayuda con ' + page + '.');
      link.href = 'https://wa.me/' + number + '?text=' + text;
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