// cookie-consent.js

(function () {
  const bannerHTML = `
    <div id="cookie-banner" style="display:none; position: fixed; bottom: 0; left: 0; right: 0; background: #fff; border-top: 1px solid #ccc; padding: 1rem; z-index: 9999; box-shadow: 0 -2px 10px rgba(0,0,0,0.1); font-family: 'Open Sans', sans-serif;">
      <div style="max-width: 960px; margin: auto; display: flex; flex-direction: column; gap: 1rem; text-align: center;">
        <p style="margin: 0; color: #333; font-size: 16px;">
          We use cookies to improve your experience, analyze traffic, and personalize content. You can accept or decline optional cookies. Read our <a href="/privacy" style="color: #13547a; font-weight: bold;">Privacy Policy</a>.
        </p>
        <div style="display: flex; justify-content: center; gap: 1rem;">
          <button id="cookie-accept" style="padding: 0.6rem 1.5rem; border: none; background: #13547a; color: white; border-radius: 6px; font-weight: bold; cursor: pointer;">Accept</button>
          <button id="cookie-decline" style="padding: 0.6rem 1.5rem; border: 1px solid #ccc; background: white; color: #13547a; border-radius: 6px; font-weight: bold; cursor: pointer;">Decline</button>
        </div>
      </div>
    </div>
  `;

  const settingsButtonHTML = `
    <button id="cookie-settings-btn" style="position: fixed; bottom: 20px; left: 20px; padding: 0.6rem 1.2rem; background: #13547a; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; z-index: 9999; box-shadow: 0 2px 6px rgba(0,0,0,0.2);">
      Cookie Settings
    </button>
  `;

  function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 86400000));
    document.cookie = `${name}=${value}; expires=${d.toUTCString()}; path=/`;
  }

  function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }

  function showBanner() {
    if (!document.getElementById('cookie-banner')) {
      document.body.insertAdjacentHTML('beforeend', bannerHTML);
    }
    document.getElementById('cookie-banner').style.display = 'block';

    document.getElementById('cookie-accept').onclick = function () {
      setCookie('cookieConsent', 'accepted', 365);
      document.getElementById('cookie-banner').remove();
    };

    document.getElementById('cookie-decline').onclick = function () {
      setCookie('cookieConsent', 'declined', 365);
      document.getElementById('cookie-banner').remove();
    };
  }

  function initSettingsButton() {
    if (!document.getElementById('cookie-settings-btn')) {
      document.body.insertAdjacentHTML('beforeend', settingsButtonHTML);
      document.getElementById('cookie-settings-btn').onclick = showBanner;
    }
  }

  window.addEventListener('DOMContentLoaded', () => {
    if (!getCookie('cookieConsent')) {
      showBanner();
    }
    initSettingsButton();
  });
})();
