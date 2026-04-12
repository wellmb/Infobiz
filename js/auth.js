/**
 * Gate: проверка пароля → редирект на landing.html
 *
 * Пароль задаётся в js/gate-config.js (скопируйте из gate-config.example.js).
 * Файл gate-config.js не должен попадать в git с реальным секретом — см. .gitignore.
 *
 * Безопасность (аудит для статического шаблона):
 * - Нет сервера: пароль сравнивается в браузере, исходник доступен при желании.
 * - sessionStorage можно выставить вручную — это «мягкий» гейт для UX, не DRM.
 * - Нет XSS-вставок из API: курсы подставляются через textContent в rates.js.
 * - Рекомендуется HTTPS на хостинге; мета-теги nosniff / CSP — в разметке страниц.
 */
(function () {
  var gate = typeof window !== "undefined" ? window.__CRYPTO_INSIDERS_GATE__ : null;
  var DEFAULT_SESSION_KEY = "site_landing_unlocked";

  var CORRECT_PASSWORD =
    gate && typeof gate.password === "string" ? gate.password : "";
  var SESSION_KEY =
    gate && typeof gate.sessionKey === "string" && gate.sessionKey.length
      ? gate.sessionKey
      : DEFAULT_SESSION_KEY;

  var LANDING_PAGE = "landing.html";
  var EXIT_REDIRECT_FALLBACK_MS = 650;

  var form = document.getElementById("auth-form");
  var input = document.getElementById("password");
  var errBox = document.getElementById("auth-error");
  var gateRoot = document.getElementById("gate-root");

  if (!form || !input) return;

  function clearErrorState() {
    input.classList.remove("auth-input--error", "shake");
    if (errBox) errBox.hidden = true;
  }

  input.addEventListener("input", clearErrorState);

  function redirectToLanding() {
    window.location.href = LANDING_PAGE;
  }

  function playExitAndRedirect() {
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch (ignore) {}

    if (!gateRoot || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      redirectToLanding();
      return;
    }

    var done = false;
    function finish() {
      if (done) return;
      done = true;
      redirectToLanding();
    }

    gateRoot.classList.add("gate--exit");

    gateRoot.addEventListener(
      "transitionend",
      function (e) {
        if (e.propertyName === "opacity") finish();
      },
      { once: true }
    );

    window.setTimeout(finish, EXIT_REDIRECT_FALLBACK_MS);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    clearErrorState();

    var configured = CORRECT_PASSWORD.length > 0;
    if (!configured) {
      if (errBox) {
        errBox.textContent =
          "Пароль не настроен: скопируйте js/gate-config.example.js в js/gate-config.js и задайте password.";
        errBox.hidden = false;
      }
      return;
    }

    if (input.value === CORRECT_PASSWORD) {
      playExitAndRedirect();
      return;
    }

    if (errBox) {
      errBox.textContent = "Неверный пароль";
      errBox.hidden = false;
    }
    input.classList.add("auth-input--error");
    void input.offsetWidth;
    input.classList.add("shake");
    input.focus();

    window.setTimeout(function () {
      input.classList.remove("shake");
    }, 500);
  });
})();
