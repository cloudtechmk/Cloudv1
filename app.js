(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var body = document.body;

  /* SHOP: all shop links point straight to https://shop.cloudtech.mk (set in index.html). */
  var bgm = /[?&]bg=(white|blue|black)/.exec(location.search); if (bgm) document.documentElement.setAttribute('data-bg', bgm[1]);

  /* loader: 000 → 100, then the curtain lifts and the house lights up */
  var num = document.getElementById('loadNum'), bar = document.getElementById('loadBar');
  var ready = function () {
    if (body.classList.contains('is-ready')) return;
    body.classList.add('is-ready');
    setTimeout(function () { body.classList.remove('is-loading'); var l = document.getElementById('loader'); if (l) l.style.display = 'none'; }, 1200);
    setTimeout(function () { body.classList.add('lights-on'); }, 700);
    var st = document.getElementById('busState'); if (st) st.textContent = 'ONLINE';
  };
  if (reduce) ready();
  else {
    var t0 = performance.now(), DUR = 1700, loaded = false;
    window.addEventListener('load', function () { loaded = true; });
    (function tick(now) {
      var p = Math.min(1, (now - t0) / DUR);
      if (!loaded && document.readyState !== 'complete') p = Math.min(p, 0.9);
      var e = 1 - Math.pow(1 - p, 3), v = Math.round(e * 100);
      num.textContent = ('00' + v).slice(-3); bar.style.width = v + '%';
      if (p < 1) requestAnimationFrame(tick); else setTimeout(ready, 180);
    })(t0);
    setTimeout(ready, 5000); /* never block the visitor */
  }

  /* nav background on scroll */
  var nav = document.getElementById('nav');
  var onScroll = function () { nav.classList.toggle('is-scrolled', window.scrollY > 30); };
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* full-screen menu */
  var btn = document.getElementById('menuBtn'), menu = document.getElementById('menu');
  var setMenu = function (open) {
    body.classList.toggle('menu-open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    menu.setAttribute('aria-hidden', open ? 'false' : 'true');
    body.style.overflow = open ? 'hidden' : '';
  };
  btn.addEventListener('click', function () { setMenu(!body.classList.contains('menu-open')); });
  menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  /* live Skopje clock in the HUD */
  var clock = document.getElementById('clock');
  if (clock) {
    var fmt;
    try { fmt = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Europe/Skopje' }); }
    catch (e) { fmt = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }); }
    var upd = function () { clock.textContent = fmt.format(new Date()); };
    upd(); setInterval(upd, 1000);
  }

  /* reveal on scroll (hero items are revealed by the loader) */
  var items = [].slice.call(document.querySelectorAll('.rv')).filter(function (el) { return !el.closest('.hero'); });
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) {
      var sib = el.parentElement ? [].indexOf.call(el.parentElement.children, el) : 0;
      el.style.transitionDelay = Math.min(sib, 4) * 70 + 'ms'; io.observe(el);
    });
  } else items.forEach(function (el) { el.classList.add('is-in'); });

  /* pinned copy: the photo scrolls up, the text stays still and the next section slides over it */
  var pins = [
    { sec: document.getElementById('hero'), els: document.querySelectorAll('#hero .hud, #hero .hero__mid, #hero .badge, #hero .giant'), mode: 'out' },
    { sec: document.querySelector('.bleed'), els: document.querySelectorAll('.bleed__copy'), mode: 'in' }
  ].filter(function (p) { return p.sec && p.els.length; });
  if (pins.length && !reduce && 'translate' in document.body.style) {
    var praf = 0, dock = document.querySelector('.dock');
    var dockH = function () { return dock && getComputedStyle(dock).display !== 'none' ? dock.offsetHeight + 16 : 0; };
    var pin = function () {
      praf = 0;
      pins.forEach(function (p) {
        var r = p.sec.getBoundingClientRect();
        if (r.bottom < -50 || r.top > window.innerHeight) return;
        var y = p.mode === 'out' ? Math.max(0, -r.top) : Math.min(0, window.innerHeight - dockH() - r.bottom);
        p.els.forEach(function (el) { el.style.translate = '0 ' + y + 'px'; });
      });
    };
    window.addEventListener('scroll', function () { if (!praf) praf = requestAnimationFrame(pin); }, { passive: true });
    window.addEventListener('resize', pin); pin();
  }

  /* 3D KNX badge: tilts toward the pointer, light follows */
  var hero = document.getElementById('hero'), badge = document.getElementById('badge');
  if (badge && !reduce) {
    var card = badge.querySelector('.badge__card');
    var tilt = function (x, y) {
      card.style.setProperty('--by', (x * 26) + 'deg'); card.style.setProperty('--bx', (-y * 20) + 'deg');
      card.style.setProperty('--sx', (50 + x * 60) + '%'); card.style.setProperty('--sy', (50 + y * 60) + '%');
    };
    if (window.matchMedia('(hover: hover)').matches) {
      hero.addEventListener('pointermove', function (e) {
        var r = badge.getBoundingClientRect();
        var x = (e.clientX - (r.left + r.width / 2)) / window.innerWidth * 1.6;
        var y = (e.clientY - (r.top + r.height / 2)) / window.innerHeight * 1.6;
        tilt(Math.max(-1, Math.min(1, x)), Math.max(-1, Math.min(1, y)));
      });
      hero.addEventListener('pointerleave', function () { tilt(-0.5, -0.3); });
    } else {
      var s0 = performance.now();
      (function idle(now) { var t = (now - s0) / 1000; tilt(Math.sin(t * 0.6) * 0.6, Math.cos(t * 0.45) * 0.4); requestAnimationFrame(idle); })(s0);
    }
  }

  /* sliders: arrow buttons + drag with the mouse */
  var slider = function (trackId, prevId, nextId) {
    var tr = document.getElementById(trackId); if (!tr) return;
    var step = function (d) {
      var c = tr.firstElementChild, w = c ? c.getBoundingClientRect().width + 16 : 400;
      tr.scrollBy({ left: d * w, behavior: reduce ? 'auto' : 'smooth' });
    };
    var p = document.getElementById(prevId), n = document.getElementById(nextId);
    if (p) p.addEventListener('click', function () { step(-1); });
    if (n) n.addEventListener('click', function () { step(1); });
    var down = false, sx = 0, sl = 0, moved = false;
    tr.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse') return;
      down = true; moved = false; sx = e.clientX; sl = tr.scrollLeft; tr.style.scrollSnapType = 'none'; tr.style.cursor = 'grabbing';
    });
    window.addEventListener('pointermove', function (e) {
      if (!down) return; var dx = e.clientX - sx; if (Math.abs(dx) > 4) moved = true; tr.scrollLeft = sl - dx;
    });
    window.addEventListener('pointerup', function () {
      if (!down) return; down = false; tr.style.cursor = ''; tr.style.scrollSnapType = '';
    });
    tr.addEventListener('click', function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
    tr.addEventListener('dragstart', function (e) { e.preventDefault(); });
  };
  /* giant footer wordmark always spans the full width */
  var word = document.querySelector('.foot__word');
  if (word) {
    var fit = function () {
      word.style.fontSize = '100px';
      var w = word.scrollWidth || 1;
      word.style.fontSize = (100 * word.parentElement.clientWidth / w * 0.98) + 'px';
    };
    fit(); window.addEventListener('resize', fit);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
  }

  slider('svTrack', 'svPrev', 'svNext');
  slider('evTrack', 'evPrev', 'evNext');
})();
