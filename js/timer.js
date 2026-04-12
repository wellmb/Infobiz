/**
 * Таймер «до закрытия набора» на landing.html
 *
 * ========== НАСТРОЙКИ ==========
 * Уникальный ключ дедлайна в sessionStorage (первая сессия = now + DURATION_MS).
 */
var TIMER_STORAGE_KEY = "crypto_gateway_deadline_v1";

/** Длительность от первого открытия лендинга в этой вкладке (мс) */
var DURATION_MS = 47 * 60 * 60 * 1000 + 59 * 60 * 1000;
// =================================

(function () {
  var elD = document.getElementById("d");
  var elH = document.getElementById("h");
  var elM = document.getElementById("m");
  var elS = document.getElementById("s");

  if (!elD || !elH || !elM || !elS) return;

  var now = Date.now();
  var end = NaN;
  try {
    end = Number(sessionStorage.getItem(TIMER_STORAGE_KEY));
  } catch (e) {
    end = NaN;
  }

  if (!end || end < now) {
    end = now + DURATION_MS;
    try {
      sessionStorage.setItem(TIMER_STORAGE_KEY, String(end));
    } catch (ignore) {}
  }

  function pad(n) {
    return n < 10 ? "0" + n : String(n);
  }

  var id = window.setInterval(tick, 1000);
  tick();

  function tick() {
    var diff = end - Date.now();
    if (diff <= 0) {
      elD.textContent = elH.textContent = elM.textContent = elS.textContent = "00";
      window.clearInterval(id);
      return;
    }
    var sec = Math.floor(diff / 1000);
    var days = Math.floor(sec / 86400);
    sec -= days * 86400;
    var hours = Math.floor(sec / 3600);
    sec -= hours * 3600;
    var mins = Math.floor(sec / 60);
    sec -= mins * 60;
    elD.textContent = pad(days);
    elH.textContent = pad(hours);
    elM.textContent = pad(mins);
    elS.textContent = pad(sec);
  }
})();
