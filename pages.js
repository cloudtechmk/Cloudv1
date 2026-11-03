/* CloudTech — shared script for Services, Projects and project pages */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var body = document.body;
  var bgm = /[?&]bg=(white|blue|black)/.exec(location.search); if (bgm) document.documentElement.setAttribute('data-bg', bgm[1]);
  requestAnimationFrame(function () { setTimeout(function () { body.classList.add('is-ready'); }, 60); });

  var nav = document.getElementById('nav');
  var onScroll = function () { nav.classList.toggle('is-scrolled', window.scrollY > 30); };
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  var btn = document.getElementById('menuBtn'), menu = document.getElementById('menu');
  var setMenu = function (open) {
    body.classList.toggle('menu-open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    menu.setAttribute('aria-hidden', open ? 'false' : 'true');
    body.style.overflow = open ? 'hidden' : '';
  };
  btn.addEventListener('click', function () { setMenu(!body.classList.contains('menu-open')); });
  menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });

  /* progress counter 0 → n% */
  var count = function (el) {
    var to = +el.dataset.to || 0;
    if (reduce) { el.textContent = to + '%'; return; }
    var t0 = performance.now(), dur = 2200;
    (function tick(now) {
      var p = Math.min(1, (now - t0 - 300) / dur); if (p < 0) p = 0;
      el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * to) + '%';
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  };

  var items = [].slice.call(document.querySelectorAll('.rv'));
  var show = function (el) { el.classList.add('is-in'); var n = el.querySelector('.meter__num'); if (n) count(n); };
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { show(e.target); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) {
      var sib = el.parentElement ? [].indexOf.call(el.parentElement.children, el) : 0;
      el.style.transitionDelay = Math.min(sib, 4) * 70 + 'ms'; io.observe(el);
    });
  } else items.forEach(show);

  /* lightbox */
  var lb = document.getElementById('lb');
  if (lb) {
    var links = [].slice.call(document.querySelectorAll('[data-lb]')), img = lb.querySelector('img'), cur = 0;
    var open = function (i) { cur = (i + links.length) % links.length; img.src = links[cur].href; img.alt = (links[cur].querySelector('img') || {}).alt || ''; lb.hidden = false; body.style.overflow = 'hidden'; };
    var close = function () { lb.hidden = true; body.style.overflow = ''; img.removeAttribute('src'); };
    links.forEach(function (a, i) { a.addEventListener('click', function (e) { e.preventDefault(); open(i); }); });
    lb.querySelector('.lb__x').addEventListener('click', close);
    lb.querySelector('.lb__prev').addEventListener('click', function () { open(cur - 1); });
    lb.querySelector('.lb__next').addEventListener('click', function () { open(cur + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    var sx = 0;
    lb.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) { var dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) open(cur + (dx < 0 ? 1 : -1)); });
    document.addEventListener('keydown', function (e) {
      if (lb.hidden) { if (e.key === 'Escape') setMenu(false); return; }
      if (e.key === 'Escape') close(); else if (e.key === 'ArrowRight') open(cur + 1); else if (e.key === 'ArrowLeft') open(cur - 1);
    });
  } else document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  /* giant footer wordmark spans the full width */
  var word = document.querySelector('.foot__word');
  if (word) {
    var fit = function () { word.style.fontSize = '100px'; var w = word.scrollWidth || 1; word.style.fontSize = (100 * word.parentElement.clientWidth / w * 0.98) + 'px'; };
    fit(); window.addEventListener('resize', fit);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
  }
})();
