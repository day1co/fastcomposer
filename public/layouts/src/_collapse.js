/* eslint-disable prefer-arrow-callback, func-names, no-param-reassign, no-alert, no-console */
(function(w, d) {
  d.querySelectorAll('.collapse').forEach(function(collapse) {
    const checkbox = collapse.querySelector('input[type=checkbox]');
    const targets = (collapse.closest('.collapse-container') || d).querySelectorAll(collapse.dataset.collapseTarget);

    function showTargets(checkbox, targets) {
      // TODO: animation
      if (checkbox.checked) {
        targets.forEach(function(target) {
          target.style.display = 'block';
        });
      } else {
        targets.forEach(function(target) {
          target.style.display = 'none';
        });
      }
    }
    if (checkbox && targets) {
      checkbox.addEventListener('change', function () { showTargets(checkbox, targets); }, false);
      showTargets(checkbox, targets);
    }
  });
})(window, document);
