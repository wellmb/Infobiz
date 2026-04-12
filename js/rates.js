/**
 * Live-курсы BTC / ETH в шапке (CoinGecko public API, без ключа).
 * При ошибке сети/CORS остаётся «—».
 *
 * ========== НАСТРОЙКИ ==========
 * Интервал обновления (мс). 0 = только при загрузке.
 */
var RATES_REFRESH_MS = 60 * 1000;

var COINGECKO_URL =
  "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd";
// =================================

(function () {
  var elBtc = document.getElementById("rate-btc");
  var elEth = document.getElementById("rate-eth");
  if (!elBtc || !elEth) return;

  function fmt(n) {
    if (n >= 1e6) return "$" + (n / 1e6).toFixed(2) + "M";
    if (n >= 1e3) return "$" + (n / 1e3).toFixed(1) + "k";
    return "$" + Math.round(n).toLocaleString("en-US");
  }

  /** Только конечные положительные числа из ответа API (защита от мусора в JSON). */
  function safeUsd(x) {
    var n = Number(x);
    return Number.isFinite(n) && n > 0 && n < 1e12 ? n : null;
  }

  function load() {
    fetch(COINGECKO_URL, { cache: "no-store" })
      .then(function (r) {
        if (!r.ok) throw new Error("bad status");
        return r.json();
      })
      .then(function (data) {
        if (!data || typeof data !== "object") return;
        var b = data.bitcoin && safeUsd(data.bitcoin.usd);
        var e = data.ethereum && safeUsd(data.ethereum.usd);
        if (b) elBtc.textContent = fmt(b);
        if (e) elEth.textContent = fmt(e);
      })
      .catch(function () {
        elBtc.textContent = elBtc.textContent || "—";
        elEth.textContent = elEth.textContent || "—";
      });
  }

  load();
  if (RATES_REFRESH_MS > 0) {
    window.setInterval(load, RATES_REFRESH_MS);
  }
})();
