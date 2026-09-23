(function () {
  'use strict';
  var dialog = document.getElementById('media-dialog');
  var content = document.getElementById('media-dialog-content');
  var trigger = null;
  var previousOverflow = '';
  if (dialog && content) {
    document.querySelectorAll('.media-trigger').forEach(function (button) {
      button.addEventListener('click', function () {
        var template = document.getElementById(button.dataset.media);
        if (!template || dialog.open) return;
        trigger = button;
        previousOverflow = document.body.style.overflow;
        document.getElementById('media-dialog-title').textContent = button.dataset.title;
        content.replaceChildren(template.content.cloneNode(true));
        dialog.classList.toggle('media-dialog-social', !!content.querySelector('.social-frame'));
        dialog.showModal();
        document.body.style.overflow = 'hidden';
        content.querySelectorAll('iframe[data-src]').forEach(function (frame) {
          frame.src = frame.dataset.src;
          frame.removeAttribute('data-src');
        });
      });
    });
    document.getElementById('media-dialog-close').addEventListener('click', function () { dialog.close(); });
    dialog.addEventListener('click', function (event) {
      var bounds = dialog.getBoundingClientRect();
      if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
    });
    dialog.addEventListener('close', function () {
      content.replaceChildren(); // Unload the player so audio stops immediately.
      document.body.style.overflow = previousOverflow;
      if (trigger) trigger.focus({ preventScroll: true });
    });
    // Keep the shared command palette from opening underneath a modal.
    window.addEventListener('keydown', function (event) {
      if (dialog.open && (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    }, true);
  }
  var links = Array.from(document.querySelectorAll('.section-nav a'));
  var targets = links.map(function (link) { return document.querySelector(link.hash); });
  var pending = false;
  function updateNavigation() {
    var active = 0;
    targets.forEach(function (target, i) {
      if (target && target.getBoundingClientRect().top <= 150) active = i;
    });
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4) active = links.length - 1;
    links.forEach(function (link, i) {
      if (i === active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    pending = false;
  }
  window.addEventListener('scroll', function () {
    if (!pending) { pending = true; requestAnimationFrame(updateNavigation); }
  }, { passive: true });
  window.addEventListener('resize', updateNavigation);
  updateNavigation();
})();
