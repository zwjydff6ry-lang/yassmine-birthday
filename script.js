/* ==========================================================
   For Yassmine — script.js
   Vanilla JS. No dependencies.
   ========================================================== */
(function () {
  'use strict';

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var body = document.body;

  /* ---------- Loader + entrance ---------- */
  var loader = document.getElementById('loader');
  var revealed = false;

  function reveal() {
    if (revealed) return;
    revealed = true;
    body.classList.add('ready');
    loader.classList.add('gone');
    setTimeout(function () { loader.style.display = 'none'; }, 900);
  }

  var minWait = new Promise(function (res) { setTimeout(res, reduced ? 0 : 900); });
  var fontsReady = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
  Promise.all([minWait, fontsReady]).then(reveal).catch(reveal);
  setTimeout(reveal, 3000); // safety net

  /* ---------- Floating stars ---------- */
  (function stars() {
    var canvas = document.getElementById('stars');
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = 0, h = 0, list = [], raf = null;

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var count = Math.max(22, Math.min(60, Math.floor((w * h) / 14000)));
      list = [];
      for (var i = 0; i < count; i++) {
        list.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 0.6 + Math.random() * 1.5,
          speed: 0.6 + Math.random() * 1.4,
          phase: Math.random() * Math.PI * 2,
          vy: 0.01 + Math.random() * 0.05,
          spark: Math.random() < 0.18
        });
      }
    }

    function draw(t) {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < list.length; i++) {
        var s = list[i];
        var a = 0.18 + 0.5 * (0.5 + 0.5 * Math.sin(t * 0.001 * s.speed + s.phase));
        ctx.fillStyle = 'rgba(184,147,74,' + a.toFixed(3) + ')';
        if (s.spark) {
          var L = s.r * 3.2;
          ctx.beginPath();
          ctx.moveTo(s.x, s.y - L);
          ctx.quadraticCurveTo(s.x, s.y, s.x + L, s.y);
          ctx.quadraticCurveTo(s.x, s.y, s.x, s.y + L);
          ctx.quadraticCurveTo(s.x, s.y, s.x - L, s.y);
          ctx.quadraticCurveTo(s.x, s.y, s.x, s.y - L);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fill();
        }
        if (!reduced) {
          s.y -= s.vy;
          if (s.y < -6) { s.y = h + 6; s.x = Math.random() * w; }
        }
      }
    }

    function loop(t) {
      draw(t);
      raf = requestAnimationFrame(loop);
    }

    function start() {
      if (reduced) { draw(0); return; }
      if (!raf) raf = requestAnimationFrame(loop);
    }
    function stop() {
      if (raf) { cancelAnimationFrame(raf); raf = null; }
    }

    resize();
    start();
    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () { resize(); if (reduced) draw(0); }, 150);
    });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop(); else start();
    });
  })();

  /* ---------- Landing -> App ---------- */
  var landing = document.getElementById('landing');
  var app = document.getElementById('app');
  var beginBtn = document.getElementById('beginBtn');

  var panels = {
    letter: document.getElementById('panel-letter'),
    song: document.getElementById('panel-song'),
    movie: document.getElementById('panel-movie')
  };
  var order = ['letter', 'song', 'movie'];
  var current = 'letter';

  beginBtn.addEventListener('click', function () {
    beginBtn.disabled = true;
    landing.classList.add('out');
    setTimeout(function () {
      landing.hidden = true;
      app.hidden = false;
      app.classList.add('enter');
      body.setAttribute('data-view', 'app');
      panels.letter.hidden = false;
      void panels.letter.offsetWidth;
      panels.letter.classList.add('is-active');
      window.scrollTo(0, 0);
    }, reduced ? 0 : 650);
  });

  /* ---------- Tabs ---------- */
  var nav = document.getElementById('nav');
  var tabs = Array.prototype.slice.call(nav.querySelectorAll('[role="tab"]'));
  var switchTimer = null;

  function showTab(name) {
    if (name === current) return;
    var prev = panels[current];
    var next = panels[name];

    tabs.forEach(function (t) {
      var sel = t.getAttribute('data-tab') === name;
      t.setAttribute('aria-selected', sel ? 'true' : 'false');
      t.tabIndex = sel ? 0 : -1;
    });
    nav.style.setProperty('--idx', order.indexOf(name));
    body.setAttribute('data-tab', name);

    clearTimeout(switchTimer);
    order.forEach(function (key) {
      var p = panels[key];
      if (p !== prev && p !== next) {
        p.hidden = true;
        p.classList.remove('is-active', 'is-leaving');
      }
    });

    prev.classList.remove('is-active');
    prev.classList.add('is-leaving');
    current = name;

    switchTimer = setTimeout(function () {
      prev.hidden = true;
      prev.classList.remove('is-leaving');
      next.hidden = false;
      void next.offsetWidth;
      next.classList.add('is-active');
      window.scrollTo(0, 0);
    }, reduced ? 0 : 260);
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { showTab(tab.getAttribute('data-tab')); });
    tab.addEventListener('keydown', function (e) {
      var n = null;
      if (e.key === 'ArrowRight') n = (i + 1) % tabs.length;
      else if (e.key === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
      if (n !== null) {
        e.preventDefault();
        tabs[n].focus();
        showTab(tabs[n].getAttribute('data-tab'));
      }
    });
  });

  /* ---------- Envelope ---------- */
  var openBtn = document.getElementById('openBtn');
  var envelope = document.getElementById('envelope');
  var envStage = document.getElementById('envStage');
  var letter = document.getElementById('letter');
  var opened = false;

  function openLetter() {
    if (opened) return;
    opened = true;
    openBtn.disabled = true;
    envelope.classList.add('open');

    var openTime = reduced ? 50 : 2300;
    var fadeTime = reduced ? 0 : 700;

    setTimeout(function () {
      envStage.classList.add('done');
      setTimeout(function () {
        envStage.hidden = true;
        letter.hidden = false;
        window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
        void letter.offsetWidth;
        letter.classList.add('show');
      }, fadeTime);
    }, openTime);
  }
  openBtn.addEventListener('click', openLetter);

  /* ---------- Movie poster: use assets/images/poster.jpg if it exists ---------- */
  (function poster() {
    var img = document.getElementById('posterImg');
    if (!img) return;
    var probe = new Image();
    probe.onload = function () {
      if (probe.naturalWidth > 0) img.src = 'assets/images/poster.jpg';
    };
    probe.src = 'assets/images/poster.jpg';
  })();
})();
