(() => {
  'use strict';

  const GA_MEASUREMENT_ID = 'G-2X25XMDGD5';
  const META_PIXEL_ID = '1547223667072107';
  const STORAGE_KEY = 'oposancv_optional_cookies_consent_v2';
  const LEGACY_STORAGE_KEY = 'oposancv_analytics_consent';
  const ATTRIBUTION_PARAMS = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_id',
    'utm_content',
    'utm_term',
    'fbclid'
  ];
  const banner = document.getElementById('cookie-banner');

  let analyticsLoaded = false;
  let metaPixelLoaded = false;

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
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    } catch (_) {}
  }

  function updateBannerCopy() {
    if (!banner) return;

    const copy = banner.querySelector('.cookie-copy p');
    if (copy) {
      copy.innerHTML =
        'Usamos Google Analytics y Meta Pixel únicamente si lo aceptas para medir el uso de OpoSanCV ' +
        'y el rendimiento de nuestras campañas. Puedes aceptar o rechazar estas cookies opcionales con la misma facilidad. ' +
        '<a href="/politica-de-cookies/">Más información</a>.';
    }

    const rejectButton = banner.querySelector('[data-cookie-reject]');
    if (rejectButton) rejectButton.textContent = 'Rechazar opcionales';

    const acceptButton = banner.querySelector('[data-cookie-accept]');
    if (acceptButton) acceptButton.textContent = 'Aceptar analítica y publicidad';
  }

  function showBanner() {
    updateBannerCopy();
    if (banner) banner.hidden = false;
  }

  function hideBanner() {
    if (banner) banner.hidden = true;
  }

  function deleteOptionalCookies() {
    const cookieNames = document.cookie
      .split(';')
      .map((part) => part.split('=')[0].trim())
      .filter(
        (name) =>
          name === '_ga' ||
          name.startsWith('_ga_') ||
          name === '_fbp' ||
          name === '_fbc'
      );

    for (const name of cookieNames) {
      document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
      document.cookie = `${name}=; Max-Age=0; path=/; domain=.oposancv.es; SameSite=Lax`;
      document.cookie = `${name}=; Max-Age=0; path=/; domain=www.oposancv.es; SameSite=Lax`;
    }
  }

  function propagateAttributionToAppLinks() {
    const currentParams = new URLSearchParams(window.location.search);
    const attribution = new Map();

    for (const key of ATTRIBUTION_PARAMS) {
      const value = currentParams.get(key);
      if (value) attribution.set(key, value);
    }

    if (attribution.size === 0) return;

    document.querySelectorAll('a[href^="https://app.oposancv.es"]').forEach((link) => {
      try {
        const url = new URL(link.href);
        for (const [key, value] of attribution.entries()) {
          if (!url.searchParams.has(key)) {
            url.searchParams.set(key, value);
          }
        }
        link.href = url.toString();
      } catch (_) {}
    });
  }

  function attachCtaTracking() {
    document.querySelectorAll('a[href^="https://app.oposancv.es"]').forEach((link) => {
      if (link.dataset.analyticsBound === 'true') return;
      link.dataset.analyticsBound = 'true';

      link.addEventListener('click', () => {
        if (getChoice() !== 'accepted') return;

        const linkText = (link.textContent || '').trim();
        const linkUrl = link.href;

        if (typeof window.gtag === 'function') {
          window.gtag('event', 'app_cta_click', {
            link_text: linkText,
            link_url: linkUrl,
            page_location: window.location.href
          });
        }

        if (typeof window.fbq === 'function') {
          window.fbq('trackCustom', 'AppCtaClick', {
            link_text: linkText,
            link_url: linkUrl
          });
        }
      });
    });
  }

  function loadGoogleAnalytics() {
    if (analyticsLoaded) {
      window[`ga-disable-${GA_MEASUREMENT_ID}`] = false;
      return;
    }

    analyticsLoaded = true;
    window[`ga-disable-${GA_MEASUREMENT_ID}`] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(){ window.dataLayer.push(arguments); };

    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID);

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_MEASUREMENT_ID)}`;
    document.head.appendChild(script);
  }

  function loadMetaPixel() {
    if (metaPixelLoaded) {
      if (typeof window.fbq === 'function') window.fbq('consent', 'grant');
      return;
    }

    metaPixelLoaded = true;

    if (!window.fbq) {
      const fbq = function() {
        if (fbq.callMethod) {
          fbq.callMethod.apply(fbq, arguments);
        } else {
          fbq.queue.push(arguments);
        }
      };

      window.fbq = fbq;
      window._fbq = fbq;
      fbq.push = fbq;
      fbq.loaded = true;
      fbq.version = '2.0';
      fbq.queue = [];

      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://connect.facebook.net/en_US/fbevents.js';
      const firstScript = document.getElementsByTagName('script')[0];
      if (firstScript && firstScript.parentNode) {
        firstScript.parentNode.insertBefore(script, firstScript);
      } else {
        document.head.appendChild(script);
      }
    }

    window.fbq('consent', 'grant');
    window.fbq('init', META_PIXEL_ID);
    window.fbq('track', 'PageView');
  }

  function loadOptionalTracking() {
    loadGoogleAnalytics();
    loadMetaPixel();
    attachCtaTracking();
  }

  function acceptOptionalCookies() {
    setChoice('accepted');
    hideBanner();
    loadOptionalTracking();
  }

  function rejectOptionalCookies() {
    setChoice('rejected');
    window[`ga-disable-${GA_MEASUREMENT_ID}`] = true;

    if (typeof window.fbq === 'function') {
      window.fbq('consent', 'revoke');
    }

    deleteOptionalCookies();
    hideBanner();
  }

  document.querySelectorAll('[data-cookie-accept]').forEach((button) => {
    button.addEventListener('click', acceptOptionalCookies);
  });

  document.querySelectorAll('[data-cookie-reject]').forEach((button) => {
    button.addEventListener('click', rejectOptionalCookies);
  });

  document.querySelectorAll('[data-cookie-settings]').forEach((button) => {
    button.addEventListener('click', showBanner);
  });

  updateBannerCopy();
  propagateAttributionToAppLinks();

  const choice = getChoice();

  if (choice === 'accepted') {
    loadOptionalTracking();
  } else if (choice === 'rejected') {
    window[`ga-disable-${GA_MEASUREMENT_ID}`] = true;
  } else {
    showBanner();
  }
})();
