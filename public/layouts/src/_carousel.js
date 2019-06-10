/* eslint-disable prefer-arrow-callback, func-names, no-param-reassign, no-alert, no-console */
(function(w, d) {
  d.querySelectorAll('.carousel').forEach(function(carousel) {
    const items = carousel.querySelectorAll('.carousel-item');
    const indicators = carousel.querySelectorAll('.carousel-indicator');
    const prev = carousel.querySelector('.carousel-prev');
    const next = carousel.querySelector('.carousel-next');

    function hideItem(index, effect) {
      if (effect) {
        items[index].classList.add(effect);
        setTimeout(function() {
          items[index].classList.remove(effect);
          items[index].style.display = 'none';
          indicators[index].checked = false;
        }, 500);
      } else {
        items[index].style.display = 'none';
        indicators[index].checked = false;
      }
    }

    function showItem(index, effect) {
      items[index].style.display = 'block';
      indicators[index].checked = true;
      if (effect) {
        items[index].classList.add(effect);
        setTimeout(function() {
          items[index].classList.remove(effect);
        }, 500);
      }
    }

    if (prev) {
      prev.addEventListener('click', function() {
        for (let i = 0, len = indicators.length; i < len; i += 1) {
          if (indicators[i].checked) {
            hideItem(i, 'slide-out-to-right');
            showItem((i + items.length - 1) % items.length, 'slide-in-from-left');
            break;
          }
        }
      });
    }
    if (next) {
      next.addEventListener('click', function() {
        for (let i = 0, len = indicators.length; i < len; i += 1) {
          if (indicators[i].checked) {
            hideItem(i, 'slide-out-to-left');
            showItem((i + items.length + 1) % items.length, 'slide-in-from-right');
            break;
          }
        }
      });
    }
    if (indicators) {
      indicators.forEach(function(indicator, index) {
        indicator.addEventListener('change', function() {
          items.forEach(function(item, itemIndex) {
            if (index === itemIndex) {
              showItem(itemIndex);
            } else {
              hideItem(itemIndex);
            }
          });
        });
      });
      showItem(0);
    }
  });
})(window, document);
