/* IDA · versión 2 (estructura inspirada en gdconf.com)
   - Usa el mismo contenido que la web actual: ../data/ediciones.js y los textos de ../js/i18n.js.
   - Textos propios de esta versión: v2/i18n.js (inglés de los [data-i18n] y strings de los renderers).
   - El idioma se guarda en la misma clave que la web actual (ida-lang).
*/
(function () {
  'use strict';

  var D = window.IDA_DATA;
  var I = window.IDA_I18N || { ui: { es: {}, en: {} } };
  var V = window.IDA_V2 || { en: {}, ui: { es: {}, en: {} } };
  var body = document.body;
  var lang = pickLang();
  var cur = D.editions[0];
  var IMG = '../img/';

  document.documentElement.classList.add('js');

  // ---------------------------------------------------------------- helpers
  function pickLang() {
    var q = new URLSearchParams(location.search).get('lang');
    if (q === 'en' || q === 'es') return q;
    try { var s = localStorage.getItem('ida-lang'); if (s === 'en' || s === 'es') return s; } catch (e) {}
    return 'es';
  }
  function T(o) { return o == null ? '' : (typeof o === 'string' ? o : (o[lang] != null ? o[lang] : o.es)); }
  // Strings de renderers: primero los de v2, después los de la web actual
  function U(k, vars) {
    var s = [V.ui[lang], V.ui.es, I.ui[lang], I.ui.es].reduce(function (f, d) { return f != null ? f : (d && d[k] != null ? d[k] : null); }, null);
    if (s == null) s = k;
    if (vars) Object.keys(vars).forEach(function (v) { s = s.split('{' + v + '}').join(vars[v]); });
    return s;
  }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function num(n) { return Number(n).toLocaleString(lang === 'en' ? 'en-US' : 'es-AR'); }
  function numK(n) { return n < 1000 ? num(n) : (Math.round(n / 100) / 10).toLocaleString(lang === 'en' ? 'en-US' : 'es-AR') + 'k'; }
  function ph(extra) { return '<span class="ph">' + esc(U('ph')) + (extra ? ' · ' + esc(extra) : '') + '</span>'; }
  function photo(name, sizes) {
    return '<img src="' + IMG + 'photos/' + name + '-800.jpg" srcset="' + IMG + 'photos/' + name + '-800.jpg 800w, ' + IMG + 'photos/' + name + '.jpg 1600w" sizes="' + (sizes || '(max-width: 760px) 100vw, 25vw') + '" alt="" loading="lazy" decoding="async" width="800" height="533">';
  }
  function venueName(e) { return D.venues[e.venue] ? D.venues[e.venue].name : ''; }
  function ext(href) { return /^https?:/.test(href) ? ' target="_blank" rel="noopener"' : ''; }

  var ICON = {
    instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 7.2A4.8 4.8 0 1 0 12 16.8 4.8 4.8 0 0 0 12 7.2zm0 7.9a3.1 3.1 0 1 1 0-6.2 3.1 3.1 0 0 1 0 6.2zM17 5.8a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2zM21.9 7.1c-.1-1.6-.4-3-1.6-4.2S17.6 1.4 16 1.3C14.3 1.2 9.7 1.2 8 1.3c-1.6.1-3 .4-4.2 1.6S2.3 5.5 2.2 7.1c-.1 1.7-.1 6.3 0 8 .1 1.6.4 3 1.6 4.2s2.6 1.5 4.2 1.6c1.7.1 6.3.1 8 0 1.6-.1 3-.4 4.2-1.6s1.5-2.6 1.6-4.2c.1-1.7.1-6.3 0-8zm-2.1 9.8a3.3 3.3 0 0 1-1.8 1.8c-1.3.5-4.3.4-5.7.4s-4.4.1-5.7-.4a3.3 3.3 0 0 1-1.8-1.8c-.5-1.3-.4-4.3-.4-5.7s-.1-4.4.4-5.7A3.3 3.3 0 0 1 6.6 3.7c1.3-.5 4.3-.4 5.7-.4s4.4-.1 5.7.4a3.3 3.3 0 0 1 1.8 1.8c.5 1.3.4 4.3.4 5.7s.1 4.4-.4 5.7z"/></svg>',
    x: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.4l-5.8-7.58-6.64 7.58H.47l8.6-9.83L0 1.15h7.6l5.24 6.93zm-1.29 19.5h2.04L6.49 3.24H4.3z"/></svg>',
    facebook: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 21.9v-7.5h2.6l.4-3.1h-3v-2c0-.9.3-1.5 1.5-1.5h1.6V5.1c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.3H7.8v3.1h2.6v7.5z"/></svg>',
    youtube: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.81zM9.55 15.57V8.43L15.82 12z"/></svg>'
  };

  // ---------------------------------------------------------------- renderers
  var R = {};

  // Barra de info de la próxima edición (como la de la web original): fecha, horario, sede, entrada
  // Íconos de línea de Lucide (lucide.dev, licencia ISC)
  var INFO_ICON = {
    date: '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
    hours: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    venue: '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
    free: '<path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/>'
  };
  R.infobar = function (el) {
    var n = D.next, v = n.venue && D.venues[n.venue];
    var items = [['date', '<span class="ib-yr">IDA ' + n.year + ' · </span>' + esc(T(n.dateLabel))]];
    items.push(['hours', n.hours ? esc(n.hours) : esc(U('info.hoursTbc'))]);
    items.push(['venue', v ? '<a href="' + v.map + '" target="_blank" rel="noopener">' + esc(v.name) + (v.address ? '<span class="infobar__addr"> (' + esc(v.address) + ')</span>' : '') + '</a>' : esc(U('info.venueTbc'))]);
    items.push(['free', esc(U('info.free'))]);
    el.innerHTML = items.map(function (i) {
      return '<span class="infobar__' + i[0] + '"><svg viewBox="0 0 24 24" aria-hidden="true">' + INFO_ICON[i[0]] + '</svg><span>' + i[1] + '</span></span>';
    }).join('');
  };

  R.stats = function (el) {
    var tot = 0; D.editions.forEach(function (e) { tot += e.stats.attendees || 0; });
    var items = [
      [cur.stats.attendees, '+', U('stat.attendees') + ' ' + cur.year],
      [cur.stats.games, '', U('stat.games')],
      [cur.stats.talks, '', U('stat.talks')],
      [cur.stats.speakers, '', U('stat.speakers')],
      [tot, '+', U('v2.stat.total', { n: D.editions.length }), 1]
    ];
    el.innerHTML = '<div class="stats">' + items.map(function (i) {
      return '<div class="stat"><b data-count="' + i[0] + '" data-prefix="' + i[1] + '"' + (i[3] ? ' data-k="1"' : '') + '>' + i[1] + (i[3] ? numK(i[0]) : num(i[0])) + '</b><span>' + esc(i[2]) + '</span></div>';
    }).join('') + '</div>';
    countUp(el);
  };

  // Anuncio del momento (como el "Housing is now open" de GDC): estado de la convocatoria de juegos
  R.announce = function (el) {
    var g = D.next.calls.games, open = g.open && g.url, k = open ? 'open' : 'soon';
    el.innerHTML = '<div><h2 class="display display--ink">' + esc(U('v2.ann.' + k + '.title', { y: D.next.year })) + '</h2><p>' + esc(U('v2.ann.' + k + '.text')) + '</p></div>' +
      '<a class="pill" href="' + (open ? g.url : '#newsletter') + '"' + ext(open ? g.url : '') + '>' + esc(U('v2.ann.' + k + '.cta')) + '</a>';
  };

  // 4 caminos (como "Find Your Path")
  R.paths = function (el) {
    var c = D.next.calls, y = D.next.year;
    function card(key, img, statusKey, href, ctaKey) {
      return '<article class="path">' + photo(img) +
        '<span class="chip">' + esc(U(statusKey)) + '</span>' +
        '<h3>' + esc(U('call.' + key + '.title')) + '</h3><p>' + esc(U('call.' + key + '.text', { y: y })) + '</p>' +
        '<a class="u-link" href="' + href + '"' + ext(href) + '>' + esc(U(ctaKey)) + '</a></article>';
    }
    function call(key, img) {
      var o = c[key].open && c[key].url;
      return card(key, img, o ? 'call.open' : 'call.closed', o ? c[key].url : '#newsletter', o ? 'call.' + key + '.cta' : 'call.notify');
    }
    el.innerHTML = '<div class="paths">' + call('games', 'g26-02') + call('talks', 'g26-04') +
      card('team', 'g24-01', 'call.always', '#newsletter', 'call.team.cta') +
      card('sponsor', 'g25-01', 'call.always', '#ser-sponsor', 'call.sponsor.cta') + '</div>';
  };

  // Ganadores en círculos (como "Festival Speakers")
  R.winners = function (el) {
    var aw = cur.awards || [];
    if (!aw.length) { el.innerHTML = '<p>' + esc(U('aw.none')) + '</p>'; return; }
    var feat = aw.filter(function (a) { return a.featured; });
    if (feat.length) aw = feat;
    el.innerHTML = '<div class="winners' + (aw.length === 3 ? ' winners--3' : '') + '">' + aw.map(function (a) {
      var pic = a.cover ? '<img src="' + IMG + 'games/' + a.cover + '" alt="" loading="lazy">' :
        a.img ? '<img src="' + IMG + 'photos/' + a.img + '-800.jpg" alt="" loading="lazy">' : '<img class="is-ph" src="' + IMG + 'logos/ida.png" alt="">';
      return '<article class="winner"><div class="winner__pic">' + pic + '</div>' +
        '<p class="winner__cat">' + esc(T(a.cat)) + '</p><h3>' + esc(a.game) + '</h3><p>' + esc(a.studio) + '</p></article>';
    }).join('') + '</div>' +
      '<div class="winners__foot">' + (cur.placeholder && cur.placeholder.awards ? ph(U('v2.aw.ph')) : '') +
      '<a class="u-link" href="../premios.html">' + esc(U('v2.aw.all')) + '</a></div>';
  };

  // 3 videos (como "Why Attend?")
  R.videos = function (el) {
    var withVideo = D.editions.filter(function (e) { return e.video && !(e.placeholder && e.placeholder.video); });
    var cards = [];
    if (cur.placeholder && cur.placeholder.video || !cur.video) {
      cards.push('<div class="vcard vcard--soon">' + photo('g26-05') + '<span class="vcard__play" aria-hidden="true"></span><span class="vcard__label">' + esc(U('video.soon', { y: cur.year })) + '</span>' + ph(U('ph.video')) + '</div>');
    }
    withVideo.slice(0, 2).forEach(function (e) {
      cards.push('<button class="vcard" type="button" data-yt="' + e.video + '" aria-label="' + esc(U('video.play', { y: e.year })) + '"><img src="https://i.ytimg.com/vi/' + e.video + '/hqdefault.jpg" alt="" loading="lazy"><span class="vcard__play" aria-hidden="true"></span><span class="vcard__label">' + esc(U('v2.vid.after', { y: e.year })) + '</span></button>');
    });
    cards.push('<a class="vcard" href="' + D.links.youtube + '" target="_blank" rel="noopener">' + photo('g24-02') + '<span class="vcard__play" aria-hidden="true"></span><span class="vcard__label">' + esc(U('video.playlist')) + '</span></a>');
    el.innerHTML = '<div class="vcards">' + cards.slice(0, 3).join('') + '</div>';
  };

  // 4 fotos (como "The Power of Community")
  R.photos = function (el) {
    // la primera foto ya está en el hero
    var list = (cur.photos || []).filter(function (p) { return p !== 'g26-01'; }).slice(0, 4);
    el.innerHTML = '<div class="photos">' + list.map(function (p) { return '<div>' + photo(p) + '</div>'; }).join('') + '</div>' +
      (cur.placeholder && cur.placeholder.photos ? '<p class="note">' + ph(U('ph.photos')) + '</p>' : '');
  };

  R.past = function (el) {
    el.innerHTML = '<h3>' + esc(U('v2.past.title')) + '</h3><div class="past__list">' + D.editions.slice(1).map(function (e) {
      return '<a class="past__item" href="../ediciones.html#ed-' + e.year + '"><b>IDA ' + e.year + '</b><span>' + esc(T(e.ord)) + ' · ' + esc(T(e.date)) + ' · ' + esc(venueName(e)) + '</span><i>' +
        '+' + num(e.stats.attendees) + ' ' + esc(U('stat.short.attendees')) + ' · ' + e.stats.games + ' ' + esc(U('stat.short.games')) + '</i></a>';
    }).join('') + '</div>';
  };

  // Sponsors sobre negro (como "Thank you to our Diamond Partners")
  function logo(id) {
    var o = D.orgs[id]; if (!o) return '';
    var img = '<img src="' + IMG + 'logos/' + o.logo + '" alt="' + esc(o.name) + '" title="' + esc(o.name) + '" loading="lazy">';
    var c = (o.tile ? 'is-tile' : '') + (o.mono ? ' is-mono' : '');
    return o.url ? '<a class="' + c.trim() + '" href="' + o.url + '" target="_blank" rel="noopener">' + img + '</a>' : '<span class="' + c.trim() + '">' + img + '</span>';
  }
  R.partners = function (el) {
    var s = cur.sponsors;
    // Cada grupo puede venir en niveles ([[más aporte], [resto]]): el primero va más grande
    el.innerHTML = [['presenta', 'logos--lg'], ['apoyo', ''], ['acompanan', '']].map(function (g) {
      var list = s[g[0]] || [];
      var t = list.length && Array.isArray(list[0]) ? list : (list.length ? [list] : []);
      return t.length ? '<div class="pgroup"><span class="pgroup__label">' + esc(U('sp.' + g[0])) + '</span><div class="tiers">' + t.map(function (ids, i) {
        var c = g[1] || (t.length > 1 && i === 0 ? 'logos--lg' : '');
        return '<div class="logos logos--even ' + c + '" style="--cols:' + (ids.length > 4 ? Math.ceil(ids.length / 2) : ids.length) + '">' + ids.map(logo).join('') + '</div>';
      }).join('') + '</div></div>' : '';
    }).join('') + '<a class="pill pill--white" href="#ser-sponsor">' + esc(U('v2.sp.join', { y: D.next.year })) + '</a>';
  };

  R.info = function (el) {
    var n = D.next, v = n.venue && D.venues[n.venue];
    el.innerHTML = '<dl class="facts">' +
      '<div><dt>' + esc(U('info.when')) + '</dt><dd>' + esc(T(n.dateLabel)) + (n.hours ? ', ' + esc(n.hours) : '') + '</dd></div>' +
      '<div><dt>' + esc(U('info.where')) + '</dt><dd>' + (v ? esc(v.name) + ' · ' + esc(v.address) : esc(U('info.venueTbc'))) + '</dd></div>' +
      '<div><dt>' + esc(U('info.cost')) + '</dt><dd>' + esc(U('info.free')) + '</dd></div>' +
      '</dl><p class="note">' + esc(U('info.past', { v: venueName(cur) })) + '</p>';
  };

  R.socials = function (el) {
    el.innerHTML = '<div class="socials">' + ['x', 'instagram', 'facebook', 'youtube'].map(function (k) {
      return '<a href="' + D.links[k] + '" target="_blank" rel="noopener" aria-label="' + k + '">' + ICON[k] + '</a>';
    }).join('') + '</div>';
  };

  R.year = function (el) { el.textContent = cur.year; };
  R.nextYear = function (el) { el.textContent = D.next.year; };
  R.thisYear = function (el) { el.textContent = new Date().getFullYear(); };

  function renderAll() {
    document.querySelectorAll('[data-render]').forEach(function (el) { var fn = R[el.dataset.render]; if (fn) fn(el); });
  }

  // ---------------------------------------------------------------- idioma
  var ES = {}, ESA = {};
  function captureES() {
    document.querySelectorAll('[data-i18n]').forEach(function (el) { ES[el.dataset.i18n] = el.innerHTML; });
    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      el.dataset.i18nAttr.split(';').forEach(function (p) { var a = p.split(':'); ESA[a[1]] = el.getAttribute(a[0]); });
    });
  }
  function applyLang() {
    document.documentElement.lang = lang === 'en' ? 'en' : 'es-AR';
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var k = el.dataset.i18n, v = lang === 'en' ? V.en[k] : ES[k];
      if (v != null) el.innerHTML = v;
    });
    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      el.dataset.i18nAttr.split(';').forEach(function (p) {
        var a = p.split(':'), v = lang === 'en' ? V.en[a[1]] : ESA[a[1]];
        if (v != null) el.setAttribute(a[0], v);
      });
    });
    var t = body.dataset['title' + (lang === 'en' ? 'En' : 'Es')]; if (t) document.title = t;
    document.querySelectorAll('.lang button').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.lang === lang ? 'true' : 'false'); });
    renderAll();
  }
  function setLang(l) {
    lang = l;
    try { localStorage.setItem('ida-lang', l); } catch (e) {}
    applyLang();
  }

  // ---------------------------------------------------------------- comportamiento
  // Cuenta de 0 al valor cuando la banda entra en pantalla. Corre también con "reducir movimiento":
  // solo cambian los dígitos, no hay desplazamiento.
  function countUp(root) {
    if (!('IntersectionObserver' in window)) return;
    root.querySelectorAll('[data-count]').forEach(function (el) {
      var to = +el.dataset.count, pre = el.dataset.prefix || '';
      function show(v) { el.textContent = pre + (el.dataset.k ? numK(v) : num(v)); }
      show(0);
      var io = new IntersectionObserver(function (es) {
        if (!es[0].isIntersecting) return;
        io.disconnect();
        var t0 = performance.now() + 250;
        (function step(t) {
          var p = Math.max(0, Math.min(1, (t - t0) / 2200));
          show(Math.round(to * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(step);
        })(performance.now());
      }, { threshold: 0.6 });
      io.observe(el);
    });
  }

  function initNav() {
    var burger = document.querySelector('.burger');
    burger.addEventListener('click', function () {
      var open = !body.classList.contains('menu-open');
      body.classList.toggle('menu-open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.getElementById('nav').addEventListener('click', function (e) {
      if (e.target.closest('a')) { body.classList.remove('menu-open'); burger.setAttribute('aria-expanded', 'false'); }
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && body.classList.contains('menu-open')) burger.click(); });
    document.querySelectorAll('.lang button').forEach(function (b) { b.addEventListener('click', function () { setLang(b.dataset.lang); }); });
  }

  // Video liviano: el iframe de YouTube carga recién al hacer click
  function initVideo() {
    document.addEventListener('click', function (e) {
      var b = e.target.closest('[data-yt]'); if (!b) return;
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + b.dataset.yt + '?autoplay=1&rel=0';
      f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      f.title = b.getAttribute('aria-label');
      f.className = 'vcard vcard--frame';
      b.replaceWith(f);
    });
  }

  // Formularios → mismo endpoint que la web actual (data/ediciones.js)
  function initForms() {
    document.addEventListener('submit', function (e) {
      var form = e.target.closest('form[data-form]'); if (!form) return;
      e.preventDefault();
      var status = form.querySelector('.form-status');
      function say(k, cls) { status.textContent = U(k); status.className = 'form-status ' + (cls || ''); }
      if (!form.checkValidity()) { say('form.invalid', 'is-err'); form.reportValidity(); return; }
      var fd = new FormData(form);
      if (fd.get('_gotcha')) return;
      fd.append('form', form.dataset.form);
      fd.append('lang', lang);
      fd.append('_subject', 'IDA web · ' + form.dataset.form);
      var endpoint = D.config.formEndpoint;
      if (!endpoint || endpoint.indexOf('REEMPLAZAR') > -1) { say('form.demo', 'is-err'); return; }
      var btn = form.querySelector('[type="submit"]');
      btn.disabled = true; say('form.sending');
      fetch(endpoint, { method: 'POST', body: fd, headers: { Accept: 'application/json' } })
        .then(function (r) { if (!r.ok) throw new Error(r.status); form.reset(); say('form.ok', 'is-ok'); })
        .catch(function () { say('form.err', 'is-err'); })
        .then(function () { btn.disabled = false; });
    });
  }

  // ---------------------------------------------------------------- boot
  captureES();
  initNav();
  initVideo();
  initForms();
  applyLang();
})();
