/* IDA · comportamiento del sitio
   - Inyecta topbar, header y footer (compartidos por todas las páginas).
   - Idioma: el español es el HTML original de cada [data-i18n]; el inglés vive en js/i18n.js.
   - Los bloques [data-render="..."] se arman desde data/ediciones.js y se re-arman al cambiar de idioma.
*/
(function () {
  'use strict';

  var D = window.IDA_DATA;
  var I = window.IDA_I18N || { en: {}, ui: { es: {}, en: {} } };
  var body = document.body;
  var page = body.dataset.page || 'home';
  var onHome = page === 'home';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var lang = pickLang();

  document.documentElement.classList.add('js');

  // ---------------------------------------------------------------- helpers
  function pickLang() {
    var q = new URLSearchParams(location.search).get('lang');
    if (q === 'en' || q === 'es') return q;
    try { var s = localStorage.getItem('ida-lang'); if (s === 'en' || s === 'es') return s; } catch (e) {}
    return 'es';
  }
  function T(o) { return o == null ? '' : (typeof o === 'string' ? o : (o[lang] != null ? o[lang] : o.es)); }
  function U(k, vars) {
    var s = (I.ui[lang] && I.ui[lang][k] != null) ? I.ui[lang][k] : (I.ui.es[k] != null ? I.ui.es[k] : k);
    if (vars) Object.keys(vars).forEach(function (v) { s = s.split('{' + v + '}').join(vars[v]); });
    return s;
  }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function num(n) { return Number(n).toLocaleString(lang === 'en' ? 'en-US' : 'es-AR'); }
  // 6000 -> "6k", 6500 -> "6,5k" (en inglés "6.5k")
  function numK(n) { return n < 1000 ? num(n) : (Math.round(n / 100) / 10).toLocaleString(lang === 'en' ? 'en-US' : 'es-AR') + 'k'; }
  function link(hash) { return onHome ? hash : 'index.html' + hash; }
  function edition(y) { return D.editions.filter(function (e) { return e.year === +y; })[0]; }
  function yearOf(el) {
    if (el.dataset.year) return +el.dataset.year;
    return D.editions[0].year;
  }
  function ph(extra) { return '<span class="ph">' + esc(U('ph')) + (extra ? ' · ' + esc(extra) : '') + '</span>'; }
  function photo(name, sizes) {
    return '<img src="img/photos/' + name + '-800.jpg" srcset="img/photos/' + name + '-800.jpg 800w, img/photos/' + name + '.jpg 1600w" sizes="' + (sizes || '(max-width: 760px) 50vw, 25vw') + '" alt="" loading="lazy" decoding="async">';
  }

  var ICON = {
    instagram: '<svg class="stroke" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle class="dot" cx="17.4" cy="6.6" r="1.2"/></svg>',
    x: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.4l-5.8-7.58-6.64 7.58H.47l8.6-9.83L0 1.15h7.6l5.24 6.93zm-1.29 19.5h2.04L6.49 3.24H4.3z"/></svg>',
    youtube: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.81zM9.55 15.57V8.43L15.82 12z"/></svg>',
    facebook: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.1 23.69v-7.98H6.63v-3.67H9.1v-1.58c0-4.09 1.85-5.98 5.86-5.98.4 0 .96.04 1.47.1.43.05.8.12 1.14.2v3.32l-.65-.03-.73-.01c-.71 0-1.26.1-1.68.31-.3.15-.52.36-.68.62-.26.42-.37 1-.37 1.75v1.3h3.92l-.39 2.1-.29 1.56h-3.24v8.25C19.4 23.24 24 18.18 24 12.04c0-6.63-5.37-12-12-12S0 5.41 0 12.04c0 5.63 3.87 10.35 9.1 11.65z"/></svg>'
  };
  function socials(cls) {
    return '<div class="socials' + (cls ? ' ' + cls : '') + '">' + ['instagram', 'x', 'facebook', 'youtube'].map(function (k) {
      return '<a href="' + D.links[k] + '" target="_blank" rel="noopener" aria-label="' + k + '">' + ICON[k] + '</a>';
    }).join('') + '</div>';
  }

  // ---------------------------------------------------------------- layout
  function renderLayout() {
    var nav = [
      ['ediciones.html', 'nav.ediciones', 'Ediciones', 'ediciones'],
      ['premios.html', 'nav.premios', 'Premios', 'premios'],
      [link('#participa'), 'nav.participa', 'Participá', ''],
      ['sponsors.html', 'nav.sponsors', 'Sponsors', 'sponsors'],
      [link('#info'), 'nav.info', 'Información', '']
    ].map(function (n) {
      var cur = n[3] && (page === n[3] || (page === 'edicion' && n[3] === 'ediciones')) ? ' aria-current="page"' : '';
      return '<a href="' + n[0] + '" data-i18n="' + n[1] + '"' + cur + '>' + n[2] + '</a>';
    }).join('');

    var top = document.getElementById('topbar');
    if (top) top.outerHTML = '<div class="topbar" data-render="topbar"></div>';

    var head = document.getElementById('site-header');
    if (head) head.outerHTML =
      '<header class="site-header"><div class="wrap">' +
        '<a class="brand" href="index.html" aria-label="IDA, inicio"><img src="img/logos/ida.png" alt="IDA" width="95" height="33"><span>Indie Dev Argentina<small data-i18n="brand.sub">Exposición de videojuegos</small></span></a>' +
        '<nav class="nav" id="nav" aria-label="Principal" data-i18n-attr="aria-label:nav.label">' + nav + '</nav>' +
        '<div class="header-tools">' + socials() +
          '<div class="lang" role="group" aria-label="Idioma"><button type="button" data-lang="es">ES</button><button type="button" data-lang="en">EN</button></div>' +
          '<button class="burger" type="button" aria-controls="nav" aria-expanded="false" aria-label="Menú" data-i18n-attr="aria-label:nav.menu"><span></span></button>' +
        '</div>' +
      '</div></header>';

    var foot = document.getElementById('site-footer');
    if (foot) foot.outerHTML =
      '<footer class="site-footer" id="newsletter">' +
        '<div class="wrap">' +
          '<div class="newsletter">' +
            '<h3 data-i18n="foot.news">Enterate primero de IDA <span data-render="nextYear"></span></h3>' +
            '<form class="form" data-form="newsletter" novalidate>' +
              '<div class="form-inline"><label class="sr-only" for="nl-email">Email</label><input class="input" id="nl-email" type="email" name="email" required placeholder="tu@email.com" autocomplete="email">' +
              '<button class="btn btn--noarrow" type="submit" data-i18n="foot.news.btn">Suscribirme</button></div>' +
              '<p class="form-note" data-i18n="foot.news.note">Solo te escribimos cuando hay novedades de IDA: fecha, convocatorias y premios.</p>' +
              '<p class="form-status" role="status"></p>' +
            '</form>' +
          '</div>' +
          '<div class="foot-box">' +
            '<div class="footer-brand"><img class="foot-heart" src="img/deco/heart-mag.png" alt="" width="36" height="33"><img src="img/logos/ida.png" alt="IDA" width="95" height="33">' +
              '<p data-i18n="foot.tag">Construimos la escena indie argentina.<br><em>Nos vemos en IDA <span data-render="nextYear"></span>.</em></p></div>' +
            '<div class="foot-follow"><span data-i18n="foot.follow">Seguinos y enterate de todas las novedades</span>' + socials('socials--color') + '</div>' +
          '</div>' +
          '<div class="footer-bottom"><span>Copyright © ' + new Date().getFullYear() + ' Indie Dev Argentina · <span data-i18n="foot.by">Un evento de Press Over</span></span></div>' +
        '</div>' +
      '</footer>';
  }

  // ---------------------------------------------------------------- i18n
  var esText = new Map(), esAttr = new Map();
  function captureES(root) {
    (root || document).querySelectorAll('[data-i18n]').forEach(function (el) { if (!esText.has(el)) esText.set(el, el.innerHTML); });
    (root || document).querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      if (esAttr.has(el)) return;
      var o = {};
      el.dataset.i18nAttr.split(';').forEach(function (p) { var a = p.split(':')[0]; o[a] = el.getAttribute(a); });
      esAttr.set(el, o);
    });
  }
  function applyLang() {
    document.documentElement.lang = lang === 'en' ? 'en' : 'es-AR';
    esText.forEach(function (es, el) {
      var k = el.dataset.i18n;
      el.innerHTML = lang === 'en' && I.en[k] != null ? I.en[k] : es;
    });
    esAttr.forEach(function (es, el) {
      el.dataset.i18nAttr.split(';').forEach(function (p) {
        var a = p.split(':')[0], k = p.split(':')[1];
        el.setAttribute(a, lang === 'en' && I.en[k] != null ? I.en[k] : es[a]);
      });
    });
    if (body.dataset.titleEn) document.title = lang === 'en' ? body.dataset.titleEn : (body.dataset.titleEs || document.title);
    document.querySelectorAll('.lang button').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.lang === lang ? 'true' : 'false'); });
    renderAll();
  }
  function setLang(l) {
    lang = l;
    try { localStorage.setItem('ida-lang', l); } catch (e) {}
    applyLang();
  }

  // ---------------------------------------------------------------- renderers
  var R = {};

  // Íconos de línea de Lucide (lucide.dev, licencia ISC)
  var TOP_ICON = {
    date: '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
    hours: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    venue: '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
    free: '<path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/>'
  };
  R.topbar = function (el) {
    var n = D.next, v = n.venue && D.venues[n.venue];
    var items = [
      ['date', '<span class="ib-yr">IDA ' + n.year + ' · </span>' + esc(T(n.dateLabel))],
      ['hours', esc(n.hours || U('info.hoursTbc'))],
      ['venue', v ? '<a href="' + v.map + '" target="_blank" rel="noopener"><span class="ib-long">' + esc(v.name) + '</span>' + (v.short ? '<span class="ib-short">' + esc(v.short) + '</span>' : '') + '</a>' : esc(U('info.venueTbc'))],
      ['free', esc(U('info.free'))]
    ];
    el.innerHTML = '<div class="wrap">' + items.map(function (i) {
      return '<span><svg viewBox="0 0 24 24" aria-hidden="true">' + TOP_ICON[i[0]] + '</svg><span>' + i[1] + '</span></span>';
    }).join('') + '</div>';
  };

  R.next = function (el) {
    var n = D.next;
    el.innerHTML =
      '<div class="next-card__year">' + n.year + '</div>' +
      '<div class="next-card__label">' + esc(U('next.label')) + ' · ' + esc(T(n.ord)) + '</div>' +
      '<div class="next-card__date">' + esc(T(n.dateLabel)) + '</div>' +
      '<div class="countdown" hidden aria-live="off">' +
        '<div><b data-cd="d">00</b><small>' + esc(U('cd.days')) + '</small></div>' +
        '<div><b data-cd="h">00</b><small>' + esc(U('cd.hours')) + '</small></div>' +
        '<div><b data-cd="m">00</b><small>' + esc(U('cd.min')) + '</small></div>' +
      '</div>';
    startCountdown(el);
  };

  var cdTimer;
  function startCountdown(el) {
    clearInterval(cdTimer);
    var target = D.next.date ? new Date(D.next.date).getTime() : NaN;
    var box = el.querySelector('.countdown');
    if (!box || isNaN(target) || target < Date.now()) return;
    box.hidden = false;
    function tick() {
      var s = Math.max(0, Math.floor((target - Date.now()) / 1000));
      var d = Math.floor(s / 86400), h = Math.floor(s % 86400 / 3600), m = Math.floor(s % 3600 / 60);
      box.querySelector('[data-cd="d"]').textContent = String(d).padStart(2, '0');
      box.querySelector('[data-cd="h"]').textContent = String(h).padStart(2, '0');
      box.querySelector('[data-cd="m"]').textContent = String(m).padStart(2, '0');
    }
    tick(); cdTimer = setInterval(tick, 20000);
  }

  R.totals = function (el) {
    var t = { attendees: 0, games: 0, talks: 0, speakers: 0 }, prov = [];
    D.editions.forEach(function (e) {
      Object.keys(t).forEach(function (k) { t[k] += e.stats[k] || 0; });
      if (e.placeholder && e.placeholder.stats) prov.push(e.year);
    });
    var items = [
      [D.editions.length, 'stat.editions', ''], [t.attendees, 'stat.attendees', '+', 1], [t.games, 'stat.games', ''],
      [t.talks, 'stat.talks', ''], [t.speakers, 'stat.speakers', '']
    ];
    el.innerHTML = '<div class="stats">' + items.map(function (i) {
      return '<div class="stat"><span class="stat__num" data-count="' + i[0] + '" data-prefix="' + i[2] + '"' + (i[3] ? ' data-k="1"' : '') + '>' + i[2] + (i[3] ? numK(i[0]) : num(i[0])) + '</span><span class="stat__label">' + esc(U(i[1])) + '</span></div>';
    }).join('') + '</div>' +
      '<p class="stats-note">' + esc(U('stats.note', { n: D.editions.length, from: D.editions[D.editions.length - 1].year, to: D.editions[0].year })) +
      (prov.length ? ' ' + ph(U('ph.stats', { y: prov.join(', ') })) : '') + '</p>';
  };

  var MOSAIC = ['m-big', '', '', '', '', 'm-wide', '', ''];
  R.gallery = function (el) {
    var e = edition(yearOf(el)); if (!e) return;
    var max = +(el.dataset.max || 99);
    var list = e.photos.slice(0, max);
    if (!list.length) { el.innerHTML = '<p class="lead">' + esc(U('gallery.empty')) + '</p>'; return; }
    el.innerHTML = '<div class="ph-wrap">' + (e.placeholder && e.placeholder.photos ? ph(U('ph.photos')) : '') +
      '<div class="mosaic" style="grid-auto-flow:dense">' + list.map(function (p, i) {
        return '<button type="button" class="' + MOSAIC[i % MOSAIC.length] + '" data-lb="img/photos/' + p + '.jpg" aria-label="' + esc(U('gallery.open', { n: i + 1, y: e.year })) + '">' + photo(p, i === 0 ? '(max-width: 760px) 100vw, 50vw' : null) + '</button>';
      }).join('') + '</div></div>';
  };

  R.video = function (el) {
    var e = edition(yearOf(el)); if (!e) return;
    if (e.video && !(e.placeholder && e.placeholder.video)) {
      el.innerHTML = '<div class="video frame frame--blue"><button class="video__poster" type="button" data-yt="' + e.video + '" aria-label="' + esc(U('video.play', { y: e.year })) + '">' +
        '<img src="https://i.ytimg.com/vi/' + e.video + '/hqdefault.jpg" alt="" loading="lazy"><span class="video__play"></span></button></div>';
    } else {
      el.innerHTML = '<div class="video frame frame--blue"><div class="video__ph"><span class="video__play"></span><p>' + esc(U('video.soon', { y: e.year })) + '</p>' +
        '<div>' + ph(U('ph.video')) + '</div><a class="link-arrow" href="' + D.links.youtube + '" target="_blank" rel="noopener">' + esc(U('video.playlist')) + '</a></div></div>';
    }
  };

  var STAT_ICONS = { attendees: 'people', games: 'gamepad', talks: 'mic', speakers: 'person' };
  // La edición actual vive en la home; las anteriores, en el archivo
  function archiveLink(y) { return +y === D.editions[0].year ? 'index.html#edicion' : 'ediciones.html#ed-' + y; }

  // Números de una edición (banda de 4)
  R.stats = function (el) {
    var e = edition(yearOf(el)); if (!e) return;
    el.innerHTML = '<div class="stats stats--4">' + ['attendees', 'games', 'talks', 'speakers'].map(function (k) {
      var pre = k === 'attendees' ? '+' : '';
      return '<div class="stat"><i class="ico" style="--src:url(../img/icons/' + STAT_ICONS[k] + '.png)" aria-hidden="true"></i>' +
        '<span class="stat__num" data-count="' + e.stats[k] + '" data-prefix="' + pre + '">' + pre + num(e.stats[k]) + '</span><span class="stat__label">' + esc(U('stat.' + k)) + '</span></div>';
    }).join('') + '</div>' +
      ((e.statsNote || (e.placeholder && e.placeholder.stats)) ? '<p class="stats-note">' + (e.statsNote ? esc(T(e.statsNote)) : '') +
        (e.placeholder && e.placeholder.stats ? ' ' + ph(U('ph.numbers')) : '') + '</p>' : '');
  };

  // "Tercera edición · Sábado 1 de agosto · Centro Cultural de la Cooperación"
  R.edMeta = function (el) {
    var e = edition(yearOf(el)); if (!e) return;
    el.textContent = T(e.ord) + ' · ' + T(e.date) + ' · ' + D.venues[e.venue].name;
  };

  R.recapFacts = function (el) {
    var e = edition(yearOf(el)); if (!e) return;
    var v = D.venues[e.venue];
    el.innerHTML = '<h3>' + esc(T(e.ord)) + ' · ' + esc(T(e.tag)) + '</h3>' +
      '<div class="ed-card__meta"><div><img src="img/icons/where.png" alt=""><span>' + esc(v.name) + (v.address ? ' · ' + esc(v.address) : '') + '</span></div>' +
      '<div><img src="img/icons/when.png" alt=""><span>' + esc(T(e.date)) + ' · ' + esc(e.hours) + '</span></div></div>' +
      '<p style="margin:0">' + esc(T(e.summary)) + '</p>' +
      '<ul class="checklist">' + e.highlights.map(function (h) { return '<li>' + esc(T(h)) + '</li>'; }).join('') + '</ul>' +
      '<a class="link-arrow" href="ediciones.html">' + esc(U('ed.past.all')) + '</a>';
  };

  function awardCard(a, placeholder) {
    return '<article class="award"><div class="award__img">' +
      (a.cover ? '<img src="img/games/' + a.cover + '" alt="" loading="lazy">' :
        a.img ? '<img src="img/photos/' + a.img + '-800.jpg" alt="" loading="lazy">' : '<img class="ph-icon" src="img/logos/ida.png" alt="">') +
      '</div><div class="award__body"><div class="award__cat">' + esc(T(a.cat)) + '</div>' +
      '<div class="award__game">' + esc(a.game) + '</div><div class="award__studio">' + esc(a.studio) + '</div>' +
      (placeholder ? '<div style="margin-top:10px">' + ph() + '</div>' : '') + '</div></article>';
  }
  R.awards = function (el) {
    var mode = el.dataset.mode;
    var list = mode === 'all' ? D.editions.filter(function (e) { return e.awards.length; }) : [edition(yearOf(el))];
    if (mode !== 'all') {
      var e = list[0]; if (!e) return;
      var max = +(el.dataset.max || 99);
      // En la home (data-featured) van los premios marcados con `featured`; si no hay, los primeros
      var feat = el.dataset.featured ? e.awards.filter(function (a) { return a.featured; }) : [];
      var shown = (feat.length ? feat : e.awards).slice(0, max);
      el.innerHTML = e.awards.length ? '<div class="award-grid' + (el.dataset.wide ? (shown.length === 3 ? ' award-grid--3' : ' award-grid--wide') : '') + '">' + shown.map(function (a) { return awardCard(a, e.placeholder && e.placeholder.awards); }).join('') + '</div>'
        : '<p class="lead">' + esc(U('aw.none')) + '</p>';
      return;
    }
    el.innerHTML = list.map(function (e, i) {
      return '<section class="award-year" id="premios-' + e.year + '"><div class="award-year__head"><span class="year-chip' + (i === 0 ? ' year-chip--mag' : '') + '">' + e.year + '</span>' +
        '<h2 class="title-sm" style="font-family:var(--f-head)">' + esc(U('aw.year', { y: e.year })) + '</h2>' +
        '<a class="link-arrow" href="' + archiveLink(e.year) + '">' + esc(U('ed.view', { y: e.year })) + '</a></div>' +
        '<div class="award-grid award-grid--wide">' + e.awards.map(function (a) { return awardCard(a, e.placeholder && e.placeholder.awards); }).join('') + '</div></section>';
    }).join('');
  };

  function edCard(e) {
    var v = D.venues[e.venue];
    return '<article class="frame ed-card"><div class="ed-card__head"><span class="ed-card__year">' + e.year + '</span><span class="ed-card__ord">' + esc(T(e.ord)) + '</span>' +
      (e.placeholder && e.placeholder.stats ? ph() : '') + '</div>' +
      '<div class="ed-card__tag">' + esc(T(e.tag)) + '</div>' +
      '<div class="ed-card__stats">' + ['attendees', 'games', 'talks', 'speakers'].map(function (k) {
        return '<div><i class="ico" style="--src:url(../img/icons/' + STAT_ICONS[k] + '.png)" aria-hidden="true"></i><b>' + num(e.stats[k]) + '</b><span>' + esc(U('stat.short.' + k)) + '</span></div>';
      }).join('') + '</div>' +
      (e.statsNote ? '<p style="margin:-8px 0 0;font-size:.8rem;color:var(--muted)">' + esc(T(e.statsNote)) + '</p>' : '') +
      '<div class="ed-card__meta"><div><img src="img/icons/where.png" alt=""><span>' + esc(v.name) + '</span></div>' +
      '<div><img src="img/icons/when.png" alt=""><span>' + esc(T(e.date)) + ' · ' + esc(e.hours) + '</span></div></div>' +
      '<a class="link-arrow" href="' + archiveLink(e.year) + '">' + esc(U('ed.view', { y: e.year })) + '</a></article>';
  }
  // Tarjetas de las ediciones anteriores a la actual (home)
  R.pastEditions = function (el) {
    el.innerHTML = '<div class="editions">' + D.editions.slice(1).map(edCard).join('') + '</div>';
  };

  // Archivo: un acordeón por edición. El contenido pesado (galería, video) se arma al abrirlo.
  function archiveBody(e) {
    var y = ' data-year="' + e.year + '"';
    return '<div class="ed-acc__intro"><p class="lead">' + esc(T(e.summary)) + '</p>' +
        '<ul class="checklist">' + e.highlights.map(function (h) { return '<li>' + esc(T(h)) + '</li>'; }).join('') + '</ul></div>' +
      '<div data-render="stats"' + y + '></div>' +
      (e.photos.length ? '<div class="ed-acc__block"><div class="eyebrow">' + esc(U('edp.gallery')) + '</div><div data-render="gallery"' + y + '></div></div>' : '') +
      (e.games && e.games.length ? '<div class="ed-acc__block"><div class="eyebrow">' + esc(U('edp.games', { n: e.games.length })) + '</div><ul class="game-list">' +
        e.games.map(function (g) { return '<li>' + esc(g) + '</li>'; }).join('') + '</ul></div>' : '') +
      '<div class="ed-acc__block split"><div><div class="eyebrow">' + esc(U('edp.video')) + '</div><div data-render="video"' + y + '></div></div>' +
        (e.awards.length ? '<div><div class="eyebrow">' + esc(U('edp.awards')) + '</div><div data-render="awards"' + y + '></div></div>' : '') + '</div>' +
      '<div class="ed-acc__block"><div class="eyebrow">' + esc(U('edp.sponsors')) + '</div><div data-render="sponsors"' + y + '></div>' +
        (e.communities.length ? '<div class="eyebrow" style="margin-top:8px">' + esc(U('edp.communities')) + '</div><div data-render="communities"' + y + '></div>' : '') + '</div>';
  }
  function fillAccordion(d) {
    var body = d.querySelector('.ed-acc__body');
    if (body.dataset.filled) return;
    body.innerHTML = archiveBody(edition(d.dataset.year));
    body.dataset.filled = '1';
    body.querySelectorAll('[data-render]').forEach(function (x) { R[x.dataset.render](x); });
    initCounters();
  }
  R.archive = function (el) {
    var open = {};
    el.querySelectorAll('details[open]').forEach(function (d) { open[d.dataset.year] = 1; });
    el.innerHTML = D.editions.slice(1).map(function (e) {
      var v = D.venues[e.venue];
      return '<details class="ed-acc" id="ed-' + e.year + '" data-year="' + e.year + '"' + (open[e.year] ? ' open' : '') + '>' +
        '<summary><span class="ed-acc__year">' + e.year + '</span>' +
          '<span class="ed-acc__title"><b>' + esc(T(e.ord)) + '</b><span>' + esc(T(e.tag)) + '</span></span>' +
          '<span class="ed-acc__meta">' + esc(T(e.date)) + '<br>' + esc(v.name) + '</span>' +
          '<span class="ed-acc__nums">' + ['attendees', 'games', 'talks'].map(function (k) {
            return '<span><b>' + num(e.stats[k]) + '</b>' + esc(U('stat.short.' + k)) + '</span>';
          }).join('') + '</span>' +
          (e.placeholder && e.placeholder.stats ? ph() : '') +
          '<span class="ed-acc__toggle" aria-hidden="true"></span></summary>' +
        '<div class="ed-acc__body"></div></details>';
    }).join('');
    el.querySelectorAll('details[open]').forEach(fillAccordion);
  };
  function openFromHash() {
    var m = /^#ed-(\d{4})$/.exec(location.hash);
    if (m && +m[1] === D.editions[0].year) { location.replace('index.html#edicion'); return; }
    var d = m && document.getElementById('ed-' + m[1]);
    if (!d || d.tagName !== 'DETAILS') return;
    d.open = true; fillAccordion(d);
    setTimeout(function () { d.scrollIntoView({ block: 'start' }); }, 60);
  }

  R.growth = function (el) {
    var key = el.dataset.key || 'attendees';
    var list = D.editions.slice().reverse();
    var max = Math.max.apply(null, list.map(function (e) { return e.stats[key]; }));
    el.innerHTML = '<div class="growth">' + list.map(function (e) {
      return '<div class="growth__row"><b>' + e.year + '</b><div class="growth__bar"><i data-w="' + Math.round(e.stats[key] / max * 100) + '"></i></div><span>' + num(e.stats[key]) + (e.placeholder && e.placeholder.stats ? '*' : '') + '</span></div>';
    }).join('') + '</div>';
    observeOnce(el, function () { el.querySelectorAll('i[data-w]').forEach(function (i) { i.style.width = i.dataset.w + '%'; }); });
  };

  function logo(id, cls) {
    var o = D.orgs[id]; if (!o) return '';
    var img = '<img src="img/logos/' + o.logo + '" alt="' + esc(o.name) + '" title="' + esc(o.name) + '" loading="lazy">';
    var c = (o.tile ? ' is-tile' : '') + (o.mono ? ' is-mono' : '') + (cls ? ' ' + cls : '');
    return o.url ? '<a class="' + c.trim() + '" href="' + o.url + '" target="_blank" rel="noopener">' + img + '</a>' : '<span class="' + c.trim() + '">' + img + '</span>';
  }
  // Un grupo de sponsors es una lista de ids o una lista de niveles ([[más aporte], [resto]])
  function tiers(list) { return list.length && Array.isArray(list[0]) ? list : (list.length ? [list] : []); }
  function flat(list) { return [].concat.apply([], tiers(list)); }
  R.sponsors = function (el) {
    var e = edition(yearOf(el)); if (!e) return;
    var s = e.sponsors;
    function row(key, color, list, cls) {
      var t = tiers(list);
      return t.length ? '<div class="sp-row" style="--c:var(--' + color + ')"><span class="sp-row__label">' + esc(U('sp.' + key)) + '</span><div class="sp-tiers">' + t.map(function (ids, i) {
        var c = cls || (t.length > 1 && i === 0 ? 'logos--lg' : '');
        return '<div class="logos logos--even' + (c ? ' ' + c : '') + '" style="--cols:' + (ids.length > 4 ? Math.ceil(ids.length / 2) : ids.length) + '">' + ids.map(function (id) { return logo(id); }).join('') + '</div>';
      }).join('') + '</div></div>' : '';
    }
    el.innerHTML = '<div class="sp-rows">' + row('presenta', 'yellow', s.presenta, 'logos--lg') + row('apoyo', 'blue-ink', s.apoyo) + row('acompanan', 'green', s.acompanan) + '</div>';
  };

  R.communities = function (el) {
    var e = edition(yearOf(el));
    var ids = e && e.communities.length ? e.communities : [];
    el.innerHTML = ids.length ? '<div class="logos logos--sm">' + ids.map(function (id) { return logo(id); }).join('') + '</div>' : '';
    var sec = el.closest('[data-hide-empty]'); if (sec) sec.hidden = !ids.length;
  };

  R.wall = function (el) {
    var seen = {}, ids = [];
    D.editions.forEach(function (e) { ['presenta', 'apoyo', 'acompanan'].forEach(function (g) { flat(e.sponsors[g]).forEach(function (id) { if (!seen[id]) { seen[id] = 1; ids.push(id); } }); }); });
    el.innerHTML = '<div class="logos">' + ids.map(function (id) { return logo(id); }).join('') + '</div>';
  };

  // Convocatorias: un bloque de tarjetas iguales (juegos, charlas, equipo, sponsors)
  R.calls = function (el) {
    var c = D.next.calls, y = D.next.year;
    function card(key, icon, color, open, href, profile, ctaKey, statusKey) {
      var ext = /^https?:/.test(href);
      return '<article class="frame frame--' + color + ' join-card" style="--c:var(--' + (color === 'blue' ? 'blue-ink' : color) + ')">' +
        '<img class="join-card__icon" src="img/icons/' + icon + '.png" alt="">' +
        '<span class="status status--' + (open ? 'open' : 'closed') + '">' + esc(U(statusKey)) + '</span>' +
        '<h3>' + esc(U('call.' + key + '.title')) + '</h3><p>' + esc(U('call.' + key + '.text', { y: y })) + '</p>' +
        '<ul class="reqs">' + U('call.' + key + '.reqs').split('|').map(function (r) { return '<li>' + esc(r) + '</li>'; }).join('') + '</ul>' +
        '<a class="btn btn--sm' + (color === 'mag' ? '' : ' btn--' + color) + '" href="' + href + '"' + (ext ? ' target="_blank" rel="noopener"' : '') + (profile ? ' data-profile="' + profile + '"' : '') + '>' +
        esc(U(ctaKey)) + '</a></article>';
    }
    function call(key, icon, color) {
      var o = c[key].open, url = o && c[key].url;
      return card(key, icon, color, o, url || '#sumate', url ? '' : key, o ? 'call.' + key + '.cta' : 'call.notify', o ? 'call.open' : 'call.closed');
    }
    el.innerHTML = '<div class="join-cards">' + call('games', 'f-gamepad', 'mag') + call('talks', 'f-chat', 'blue') +
      card('team', 'volunteer', 'green', true, '#sumate', 'voluntarios', 'call.team.cta', 'call.always') +
      card('sponsor', 'handshake', 'yellow', true, '#ser-sponsor', '', 'call.sponsor.cta', 'call.always') + '</div>';
  };

  R.info = function (el) {
    var n = D.next, v = n.venue && D.venues[n.venue];
    el.innerHTML = '<div class="info__items">' +
      '<div class="info__item"><img src="img/icons/where.png" alt=""><b>' + esc(U('info.where')) + '</b><span>' + (v ? esc(v.name) + ' (' + esc(v.address) + ')' : esc(U('info.venueTbc'))) + '</span></div>' +
      '<div class="info__item"><img src="img/icons/when.png" alt=""><b>' + esc(U('info.when')) + '</b><span>' + esc(T(n.dateLabel)) + (n.hours ? ', ' + esc(n.hours) : '') + '</span></div>' +
      '<div class="info__item"><img src="img/icons/ticket.png" alt=""><b>' + esc(U('info.cost')) + '</b><span>' + esc(U('info.free')) + '</span></div>' +
      '</div>' +
      (v && v.embed ? '<div class="map" style="margin-top:28px"><iframe title="Mapa" src="' + v.embed + '" loading="lazy"></iframe></div>'
        : '<p class="lead" style="margin-top:28px;font-size:1rem">' + esc(U('info.past', { v: D.venues[D.editions[0].venue].name })) + '</p>');
  };

  R.year = function (el) { el.textContent = yearOf(el); };
  R.ord = function (el) { var e = edition(yearOf(el)); el.textContent = e ? T(e.ord) : ''; };
  R.nextYear = function (el) { el.textContent = D.next.year; };

  function renderAll() {
    document.querySelectorAll('[data-render]').forEach(function (el) {
      var fn = R[el.dataset.render];
      if (fn) fn(el);
    });
    initCounters();
    initReveal();
  }

  // ---------------------------------------------------------------- interacción
  function observeOnce(el, cb) {
    if (!('IntersectionObserver' in window) || reduceMotion) { cb(); return; }
    var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { io.disconnect(); cb(); } }); }, { threshold: .2 });
    io.observe(el);
  }

  function initCounters() {
    document.querySelectorAll('[data-count]:not([data-counted])').forEach(function (el) {
      el.dataset.counted = '1';
      var to = +el.dataset.count, pre = el.dataset.prefix || '';
      if (reduceMotion) return;
      el.textContent = pre + '0';
      observeOnce(el, function () {
        var t0 = performance.now(), dur = 1400;
        (function step(t) {
          var p = Math.min(1, (t - t0) / dur), v = Math.round(to * (1 - Math.pow(1 - p, 3)));
          el.textContent = pre + (el.dataset.k ? numK(v) : num(v));
          if (p < 1) requestAnimationFrame(step);
        })(t0);
      });
    });
  }

  var revealIO;
  function initReveal() {
    if (reduceMotion || !('IntersectionObserver' in window)) { document.querySelectorAll('.reveal').forEach(function (e) { e.classList.add('is-in'); }); return; }
    revealIO = revealIO || new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); revealIO.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.reveal:not(.is-in)').forEach(function (e) { revealIO.observe(e); });
  }

  function initHeader() {
    var header = document.querySelector('.site-header');
    var burger = document.querySelector('.burger');
    function onScroll() { header.classList.toggle('is-scrolled', window.scrollY > 10); }
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
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

  // Lightbox (delegado: sirve para cualquier [data-lb] dentro de un .mosaic)
  function initLightbox() {
    var lb = document.createElement('div');
    lb.className = 'lightbox'; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true');
    lb.innerHTML = '<img alt=""><button class="lb-close" type="button">✕</button><button class="lb-prev" type="button">←</button><button class="lb-next" type="button">→</button><div class="lb-count"></div>';
    body.appendChild(lb);
    var img = lb.querySelector('img'), list = [], idx = 0, opener = null;
    function show(i) {
      idx = (i + list.length) % list.length;
      img.src = list[idx];
      lb.querySelector('.lb-count').textContent = (idx + 1) + ' / ' + list.length;
    }
    function close() { lb.classList.remove('is-open'); body.style.overflow = ''; if (opener) opener.focus(); }
    document.addEventListener('click', function (e) {
      var b = e.target.closest('[data-lb]'); if (!b) return;
      var group = b.closest('.mosaic') || document;
      var btns = Array.prototype.slice.call(group.querySelectorAll('[data-lb]'));
      list = btns.map(function (x) { return x.dataset.lb; });
      opener = b;
      lb.querySelector('.lb-close').setAttribute('aria-label', U('lb.close'));
      lb.querySelector('.lb-prev').setAttribute('aria-label', U('lb.prev'));
      lb.querySelector('.lb-next').setAttribute('aria-label', U('lb.next'));
      show(btns.indexOf(b));
      lb.classList.add('is-open'); body.style.overflow = 'hidden';
      lb.querySelector('.lb-close').focus();
    });
    lb.querySelector('.lb-close').addEventListener('click', close);
    lb.querySelector('.lb-prev').addEventListener('click', function () { show(idx - 1); });
    lb.querySelector('.lb-next').addEventListener('click', function () { show(idx + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });
  }

  // Video liviano: carga el iframe de YouTube recién al hacer click
  function initVideo() {
    document.addEventListener('click', function (e) {
      var b = e.target.closest('[data-yt]'); if (!b) return;
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + b.dataset.yt + '?autoplay=1&rel=0';
      f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      f.title = b.getAttribute('aria-label');
      b.replaceWith(f);
    });
  }

  // Botones "Avisame" de convocatorias cerradas: llevan al form de comunidad con el perfil marcado
  function initProfileLinks() {
    document.addEventListener('click', function (e) {
      var a = e.target.closest('[data-profile]'); if (!a) return;
      var input = document.querySelector('.profiles input[value="' + a.dataset.profile + '"]');
      if (input) input.checked = true;
    });
  }

  // Formularios → Formspree (o el endpoint configurado en data/ediciones.js)
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
  renderLayout();
  captureES();
  initHeader();
  initLightbox();
  initVideo();
  initProfileLinks();
  initForms();
  applyLang();

  // Archivo de ediciones: llenar cada acordeón al abrirlo, y abrir el del #ed-AAAA de la URL
  document.addEventListener('toggle', function (e) {
    var d = e.target;
    if (d.classList && d.classList.contains('ed-acc') && d.open) {
      fillAccordion(d);
      if (history.replaceState) history.replaceState(null, '', '#ed-' + d.dataset.year);
    }
  }, true);
  openFromHash();
  window.addEventListener('hashchange', openFromHash);
})();
