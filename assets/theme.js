/* Apply the saved theme before the page paints, then wire up the controls. */
(function () {
  'use strict';
  var root = document.documentElement;
  var preference = null;
  try { preference = localStorage.getItem('jm-theme'); } catch (error) {}
  if (preference !== 'light' && preference !== 'dark') preference = null;

  function apply(theme) {
    root.setAttribute('data-theme', theme);
    document.querySelectorAll('[data-theme-toggle]').forEach(function (button) {
      var dark = theme === 'dark';
      button.textContent = dark ? 'Light mode' : 'Dark mode';
      button.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
      button.setAttribute('aria-pressed', String(dark));
    });
  }
  apply(preference || 'light');

  document.addEventListener('DOMContentLoaded', function () {
    apply(root.getAttribute('data-theme'));
    document.querySelectorAll('[data-theme-toggle]').forEach(function (button) {
      button.hidden = false;
      button.addEventListener('click', function () {
        preference = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        try { localStorage.setItem('jm-theme', preference); } catch (error) {}
        apply(preference);
      });
    });
  });
})();
