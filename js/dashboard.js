/**
 * Личный кабинет: глоссарий (панель + оверлей), закрытие по Escape.
 */
(function () {
  var btn = document.getElementById("glossary-toggle");
  var panel = document.getElementById("glossary-panel");
  var overlay = document.getElementById("glossary-overlay");
  var closeBtn = document.getElementById("glossary-close");

  if (!btn || !panel || !overlay) return;

  function open() {
    panel.classList.add("is-open");
    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    btn.setAttribute("aria-expanded", "true");
    document.body.classList.add("glossary-open");
  }

  function close() {
    panel.classList.remove("is-open");
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
    btn.setAttribute("aria-expanded", "false");
    document.body.classList.remove("glossary-open");
  }

  function toggle() {
    if (panel.classList.contains("is-open")) close();
    else open();
  }

  btn.addEventListener("click", toggle);
  overlay.addEventListener("click", close);
  if (closeBtn) closeBtn.addEventListener("click", close);

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") close();
  });
})();
