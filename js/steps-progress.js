/**
 * Прогресс-линия этапов: заливка растёт при скролле через секцию #roadmap.
 * Лёгкий расчёт без библиотек; при prefers-reduced-motion — сразу 100%.
 */
(function () {
  var section = document.getElementById("roadmap");
  var fill = document.getElementById("steps-line-fill");
  if (!section || !fill) return;

  function update() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      fill.style.transform = "scaleY(1)";
      return;
    }

    var rect = section.getBoundingClientRect();
    var vh = window.innerHeight || 1;
    var h = rect.height || 1;

    // Начинаем наполнять, когда верх секции входит в нижнюю треть экрана;
    // заканчиваем, когда низ секции уходит выше верхней трети.
    var triggerStart = vh * 0.72;
    var triggerEnd = vh * 0.28;
    var traveled = triggerStart - rect.top;
    var total = h + (triggerStart - triggerEnd);
    var p = traveled / total;
    p = Math.max(0, Math.min(1, p));

    fill.style.transform = "scaleY(" + p + ")";
  }

  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update, { passive: true });
  update();
})();
