/**
 * Редирект на вход, если в этой вкладке не пройден гейт.
 * Читает sessionKey из window.__CRYPTO_INSIDERS_GATE__ (js/gate-config.js), иначе — значение по умолчанию.
 */
(function () {
  var gate = typeof window !== "undefined" ? window.__CRYPTO_INSIDERS_GATE__ : null;
  var DEFAULT_KEY = "site_landing_unlocked";
  var sessionKey =
    gate && typeof gate.sessionKey === "string" && gate.sessionKey.length ? gate.sessionKey : DEFAULT_KEY;

  try {
    if (sessionStorage.getItem(sessionKey) !== "1") {
      location.replace("index.html");
    }
  } catch (e) {
    location.replace("index.html");
  }
})();
