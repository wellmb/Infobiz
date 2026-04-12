/**
 * Gate: проверка пароля → редирект на landing.html
 *
 * ========== НАСТРОЙКИ ==========
 */
var CORRECT_PASSWORD = "PASSWORD";

/** Ключ sessionStorage (должен совпадать с inline-скриптом в landing.html) */
var SESSION_KEY = "site_landing_unlocked";

var LANDING_PAGE = "landing.html";

/** Таймаут редиректа, если transitionend не сработал (мс) */
var EXIT_REDIRECT_FALLBACK_MS = 650;
// =================================

(function () {
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

    if (input.value === CORRECT_PASSWORD) {
      playExitAndRedirect();
      return;
    }

    if (errBox) errBox.hidden = false;
    input.classList.add("auth-input--error");
    void input.offsetWidth;
    input.classList.add("shake");
    input.focus();

    window.setTimeout(function () {
      input.classList.remove("shake");
    }, 500);
  });
})();
