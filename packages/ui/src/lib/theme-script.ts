// Sets data-theme from the saved choice or the OS, and follows OS changes.
export const themeScript = `(function () {
  var root = document.documentElement;
  var media = window.matchMedia("(prefers-color-scheme: dark)");
  function apply() {
    var saved = null;
    try { saved = localStorage.getItem("mon-theme"); } catch (e) {}
    root.dataset.theme =
      saved === "light" || saved === "dark" ? saved : media.matches ? "dark" : "light";
  }
  apply();
  media.addEventListener("change", apply);
})();`;
