(() => {
  'use strict';

  const MEASUREMENT_ID = 'G-2X25XMDGD5';
  const STORAGE_KEY = 'oposancv_analytics_consent';
  const banner = document.getElementById('cookie-banner');
  let analyticsLoaded = false;

  function getChoice() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (_) {
      return null;
    }
  }

  function setChoice(value) {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch (_) {}
  }

  function showBanner() {
    if (banner) banner.hidden = false;
  }

  function hideBanner() {
    if (banner) banner.hidden = true;
  }

  function deleteAnalyticsCookies() {
    const cookieNames = document.cookie
      .split(';')
      .map((part) => part.split('=')[0].trim())
      .filter((name) => name === '_ga' || name.startsWith('_ga_'));

    for (const name of cookieNames) {
      document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
      document.cookie = `${name}=; Max-Age=0; path=/; domain=.oposancv.es; SameSite=Lax`;
      document.cookie = `${name}=; Max-Age=0; path=/; domain=www.oposancv.es; SameSite=Lax`;
    }
  }

  function attachCtaTracking() {
    document.querySelectorAll('a[href^="https://app.oposancv.es"]').forEach((link) => {
      if (link.dataset.analyticsBound === 'true') return;
      link.dataset.analyticsBound = 'true';

      link.addEventListener('click', () => {
        if (typeof window.gtag !== 'function') return;

        window.gtag('event', 'app_cta_click', {
          link_text: (link.textContent || '').trim(),
          link_url: link.href,
          page_location: window.location.href
        });
      });
    });
  }

  function loadAnalytics() {
    if (analyticsLoaded) {
      window[`ga-disable-${MEASUREMENT_ID}`] = false;
      return;
    }

    analyticsLoaded = true;
    window[`ga-disable-${MEASUREMENT_ID}`] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(){ window.dataLayer.push(arguments); };

    window.gtag('js', new Date());
    window.gtag('config', MEASUREMENT_ID);

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(MEASUREMENT_ID)}`;
    script.onload = attachCtaTracking;
    document.head.appendChild(script);
  }

  function acceptAnalytics() {
    setChoice('accepted');
    hideBanner();
    loadAnalytics();
  }

  function rejectAnalytics() {
    setChoice('rejected');
    window[`ga-disable-${MEASUREMENT_ID}`] = true;
    deleteAnalyticsCookies();
    hideBanner();
  }

  document.querySelectorAll('[data-cookie-accept]').forEach((button) => {
    button.addEventListener('click', acceptAnalytics);
  });

  document.querySelectorAll('[data-cookie-reject]').forEach((button) => {
    button.addEventListener('click', rejectAnalytics);
  });

  document.querySelectorAll('[data-cookie-settings]').forEach((button) => {
    button.addEventListener('click', showBanner);
  });

  const choice = getChoice();

  if (choice === 'accepted') {
    loadAnalytics();
  } else if (choice === 'rejected') {
    window[`ga-disable-${MEASUREMENT_ID}`] = true;
  } else {
    showBanner();
  }
})();
