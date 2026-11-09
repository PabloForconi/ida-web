/* IDA · comportamiento de todas las páginas (estructura inspirada en gdconf.com)
   - Contenido: data/ediciones.js. Textos: js/textos.js (propios de cada página + inglés) y js/i18n.js (compartidos de los renderers).
   - Arma encabezado y pie (injectChrome) y cada [data-render] con su renderer R.nombre.
   - El idioma se guarda en localStorage (ida-lang) o con ?lang=en.
*/
(function () {
  'use strict';

  var D = window.IDA_DATA;
  var I = window.IDA_I18N || { ui: { es: {}, en: {} } };
  var V = window.IDA_V2 || { en: {}, ui: { es: {}, en: {} } };
  var body = document.body;
  var lang = pickLang();
  var cur = D.editions[0];
  var IMG = 'img/';

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
  function photo(name, sizes) {
    return '<img src="' + IMG + 'photos/' + name + '-800.jpg" srcset="' + IMG + 'photos/' + name + '-800.jpg 800w, ' + IMG + 'photos/' + name + '.jpg 1600w" sizes="' + (sizes || '(max-width: 760px) 100vw, 25vw') + '" alt="" loading="lazy" decoding="async" width="800" height="533">';
  }
  // Foto que abre el visor (initLightbox): el visor recorre toda la lista, no solo las que se ven
  function galLink(list, i, inner, label) {
    return '<a href="' + IMG + 'photos/' + list[i] + '.jpg" data-gal="' + list.join(',') + '" data-i="' + i + '" aria-label="' + esc(label || U('lb.open')) + '">' + inner + '</a>';
  }
  function venueName(e) { return D.venues[e.venue] ? D.venues[e.venue].name : ''; }
  function ext(href) { return /^https?:/.test(href) ? ' target="_blank" rel="noopener"' : ''; }

  var ICON = {
    instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 7.2A4.8 4.8 0 1 0 12 16.8 4.8 4.8 0 0 0 12 7.2zm0 7.9a3.1 3.1 0 1 1 0-6.2 3.1 3.1 0 0 1 0 6.2zM17 5.8a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2zM21.9 7.1c-.1-1.6-.4-3-1.6-4.2S17.6 1.4 16 1.3C14.3 1.2 9.7 1.2 8 1.3c-1.6.1-3 .4-4.2 1.6S2.3 5.5 2.2 7.1c-.1 1.7-.1 6.3 0 8 .1 1.6.4 3 1.6 4.2s2.6 1.5 4.2 1.6c1.7.1 6.3.1 8 0 1.6-.1 3-.4 4.2-1.6s1.5-2.6 1.6-4.2c.1-1.7.1-6.3 0-8zm-2.1 9.8a3.3 3.3 0 0 1-1.8 1.8c-1.3.5-4.3.4-5.7.4s-4.4.1-5.7-.4a3.3 3.3 0 0 1-1.8-1.8c-.5-1.3-.4-4.3-.4-5.7s-.1-4.4.4-5.7A3.3 3.3 0 0 1 6.6 3.7c1.3-.5 4.3-.4 5.7-.4s4.4-.1 5.7.4a3.3 3.3 0 0 1 1.8 1.8c.5 1.3.4 4.3.4 5.7s.1 4.4-.4 5.7z"/></svg>',
    x: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.4l-5.8-7.58-6.64 7.58H.47l8.6-9.83L0 1.15h7.6l5.24 6.93zm-1.29 19.5h2.04L6.49 3.24H4.3z"/></svg>',
    facebook: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 21.9v-7.5h2.6l.4-3.1h-3v-2c0-.9.3-1.5 1.5-1.5h1.6V5.1c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.3H7.8v3.1h2.6v7.5z"/></svg>',
    youtube: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.81zM9.55 15.57V8.43L15.82 12z"/></svg>'
  };

  // ---------------------------------------------------------------- encabezado y pie (iguales en todas las páginas)
  // body[data-page]: home | ediciones | premios | sponsors. Fuera de la home, las anclas apuntan a index.html.
  var PAGE = body.dataset.page || 'home';
  function homeLink(anchor) { return (PAGE === 'home' ? '' : 'index.html') + anchor; }
  function navLink(href, page, key, text) {
    return '<a href="' + href + '"' + (PAGE === page ? ' aria-current="page"' : '') + ' data-i18n="' + key + '">' + text + '</a>';
  }
  var HEART = '<svg class="foot__heart" viewBox="0 0 9 8" aria-hidden="true"><path fill="currentColor" d="M1 0h2v1H1zM6 0h2v1H6zM0 1h4v1H0zM5 1h4v1H5zM0 2h9v2H0zM1 4h7v1H1zM2 5h5v1H2zM3 6h3v1H3zM4 7h1v1H4z"/></svg>';
  function injectChrome() {
    var h = document.getElementById('v2-head');
    if (h) h.outerHTML = '<header class="masthead">' +
      '<div class="infobar"><div class="wrap infobar__in" data-render="infobar"></div></div>' +
      '<div class="navbar"><div class="wrap navbar__in">' +
        '<a class="brand" href="index.html" aria-label="IDA, inicio"><img src="' + IMG + 'logos/ida.png" alt="IDA" width="95" height="33">' +
          '<span>Indie Dev Argentina<small data-i18n="brand.sub">Exposición de videojuegos</small></span></a>' +
        '<nav class="nav" id="nav" aria-label="Principal">' +
          // Participá, Steam y FAQ son atajos a secciones de la home
          navLink(homeLink('#participa'), '', 'nav.participa', 'Participá') +
          navLink('ediciones.html', 'ediciones', 'nav.ediciones', 'Ediciones') +
          navLink('premios.html', 'premios', 'nav.premios', 'Premios') +
          navLink(homeLink('#steam'), '', 'nav.steam', 'Steam') +
          navLink('sponsors.html', 'sponsors', 'nav.sponsors', 'Sponsors') +
          navLink(homeLink('#info'), '', 'nav.faq', 'FAQ') +
        '</nav>' +
        '<div class="navbar__tools">' +
          '<a class="pill navbar__news" href="#newsletter" data-i18n="nav.news">Newsletter</a>' +
          '<div class="lang" role="group" aria-label="Idioma"><button type="button" data-lang="es">ES</button><button type="button" data-lang="en">EN</button></div>' +
          '<button class="burger" type="button" aria-expanded="false" aria-controls="nav" data-i18n-attr="aria-label:nav.menu" aria-label="Menú"><span></span></button>' +
        '</div>' +
      '</div></div></header>';
    var f = document.getElementById('v2-foot');
    // Pie: cierre tipo créditos de videojuego, con el hashtag de la próxima edición y las redes
    if (f) f.outerHTML = '<footer class="foot">' +
      '<div class="wrap foot__in">' +
        '<p class="foot__thanks" data-i18n="foot.thanks">Gracias por <span>jugar</span></p>' +
        '<div class="foot__tag"><p class="hashtag">#IDA<span data-render="nextYear"></span></p><div data-render="socials"></div></div>' +
      '</div>' +
      '<div class="wrap foot__news" id="newsletter"><div><h2 data-i18n="foot.news">Suscribite al newsletter de <span>Press Over</span></h2>' +
        '<p data-i18n="foot.news.text">Para enterarte de todas las novedades de IDA.</p></div>' +
        '<div data-render="news" data-key="news-pie"></div></div>' +
      '<div class="wrap foot__bottom"><span class="foot__brand">' + HEART + '<img src="' + IMG + 'logos/ida.png" alt="IDA" width="76" height="26"></span>' +
        '<span>© <span data-render="thisYear"></span> Indie Dev Argentina</span></div></footer>';
  }

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
    var items = [['date', esc(T(n.dateLabel) + (lang === 'en' ? ', ' : ' de ') + n.year)]];
    items.push(['hours', n.hours ? esc(n.hours) : esc(U('info.hoursTbc'))]);
    items.push(['venue', v ? '<a href="' + v.map + '" target="_blank" rel="noopener">' + '<span class="ib-long">' + esc(v.name) + '</span>' + (v.short ? '<span class="ib-short">' + esc(v.short) + '</span>' : '') + (v.address ? '<span class="infobar__addr"> (' + esc(v.address) + ')</span>' : '') + '</a>' : esc(U('info.venueTbc'))]);
    items.push(['free', esc(U('info.free'))]);
    el.innerHTML = items.map(function (i) {
      return '<span class="infobar__' + i[0] + '"><svg viewBox="0 0 24 24" aria-hidden="true">' + INFO_ICON[i[0]] + '</svg><span>' + i[1] + '</span></span>';
    }).join('');
  };

  // Banda de números de la home: solo la última edición
  R.stats = function (el) {
    var items = [
      [cur.stats.attendees, '+', U('stat.attendees')],
      [cur.stats.games, '', U('stat.games')],
      [cur.stats.talks, '', U('stat.talks')],
      [cur.stats.speakers, '', U('stat.speakers')]
    ];
    el.innerHTML = '<div class="stats stats--4">' + items.map(function (i) {
      return '<div class="stat"><b data-count="' + i[0] + '" data-prefix="' + i[1] + '"' + (i[3] ? ' data-k="1"' : '') + '>' + i[1] + (i[3] ? numK(i[0]) : num(i[0])) + '</b><span>' + esc(i[2]) + '</span></div>';
    }).join('') + '</div>';
    countUp(el);
  };

  // Newsletter: siempre el de Press Over en Substack. initNews() manda el email a Substack desde la página
  // (sin salir de la web); el action del formulario queda como respaldo si el JS no corre.
  var SUBSTACK = 'https://pressover.substack.com/';
  function newsForm(id, note) {
    return '<form class="news" id="' + id + '" action="' + SUBSTACK + 'api/v1/free?nojs=true" method="post" target="_blank" novalidate>' +
      '<input type="hidden" name="source" value="embed"><div class="form-inline"><label class="sr-only" for="' + id + '-email">Email</label>' +
      '<input class="input" id="' + id + '-email" type="email" name="email" required placeholder="tu@email.com" autocomplete="email">' +
      '<button class="pill" type="submit">' + esc(U('news.btn')) + '</button></div>' +
      '<p class="form-status news__status" role="status"></p>' +
      (note ? '<p class="news__note">' + U('news.note', { url: SUBSTACK }) + '</p>' : '') + '</form>';
  }
  R.news = function (el) { el.innerHTML = newsForm(el.dataset.key || 'news', el.dataset.mode === 'note'); };

  // Anuncio del momento (como el "Housing is now open" de GDC): estado de la convocatoria de juegos.
  // Sacado de la home en nov 2026; para volver a mostrarlo, después de la banda de números:
  // <section class="band dark"><div class="wrap announce" data-render="announce"></div></section>
  R.announce = function (el) {
    var g = D.next.calls.games, open = g.open && g.url, k = open ? 'open' : 'soon';
    el.innerHTML = '<div><h2 class="display display--ink">' + esc(U('v2.ann.' + k + '.title', { y: D.next.year })) + '</h2><p>' + esc(U('v2.ann.' + k + '.text')) + '</p></div>' +
      (open ? '<a class="pill" href="' + g.url + '"' + ext(g.url) + '>' + esc(U('v2.ann.open.cta')) + '</a>' : newsForm('newsletter', true));
  };

  // 4 caminos (como "Find Your Path")
  R.paths = function (el) {
    var c = D.next.calls, y = D.next.year;
    // Sin links al pie; solo cuando una convocatoria está abierta aparece el link para postularse
    // img: nombre de una foto (photos/<img>-800.jpg) o el <img> ya armado
    // La etiqueta es gris si la convocatoria está cerrada y verde si está abierta
    function card(key, img, statusKey, href, ctaKey) {
      return '<article class="path">' + (img.charAt(0) === '<' ? img : photo(img)) +
        '<span class="chip chip--' + (statusKey === 'call.closed' ? 'closed' : 'open') + '">' + esc(U(statusKey)) + '</span>' +
        '<h3>' + esc(U('call.' + key + '.title')) + '</h3><p>' + esc(U('call.' + key + '.text', { y: y })) + '</p>' +
        (href ? '<a class="u-link" href="' + href + '"' + ext(href) + '>' + esc(U(ctaKey)) + '</a>' : '') + '</article>';
    }
    function call(key, img) {
      var o = c[key].open && c[key].url;
      return card(key, img, o ? 'call.open' : 'call.closed', o ? c[key].url : null, 'call.' + key + '.cta');
    }
    var steamArt = '<img src="' + IMG + 'photos/steam-call.jpg" alt="" loading="lazy" decoding="async" width="800" height="600">';
    el.innerHTML = '<div class="paths">' + call('games', 'g26-15') +
      card('steam', steamArt, 'call.always') +
      call('talks', 'g26-04') +
      card('team', 'g24-01', 'call.always') + '</div>';
  };

  // Ganadores: portada del juego, categoría, juego y estudio
  // Link a la página del juego en Steam (award.steam = id de la app)
  function steamUrl(a) { return a.steam ? 'https://store.steampowered.com/app/' + a.steam + '/' : ''; }
  // La portada es el link a Steam cuando el juego tiene id
  function picLink(a, pic, cls) {
    return a.steam ? '<a class="' + cls + '" href="' + steamUrl(a) + '" target="_blank" rel="noopener" aria-label="' + esc(a.game) + ' en Steam" title="Ver ' + esc(a.game) + ' en Steam">' + pic + '</a>' : '<div class="' + cls + '">' + pic + '</div>';
  }
  // "Presentado por" + logo del sponsor del premio (award.by = id de orgs)
  function awardBy(a, cls) {
    var o = a.by && D.orgs[a.by]; if (!o || PAGE !== 'premios') return ''; // solo en la página de premios
    var img = '<img src="' + IMG + 'logos/' + o.logo + '" alt="' + esc(o.name) + '">';
    return '<p class="award-by ' + cls + '"><span>Presentado por</span>' + (o.url ? '<a href="' + o.url + '" target="_blank" rel="noopener">' + img + '</a>' : img) + '</p>';
  }
  function winnerCard(a) {
    var pic = a.cover ? '<img src="' + IMG + 'games/' + a.cover + '" alt="" loading="lazy">' :
      a.img ? '<img src="' + IMG + 'photos/' + a.img + '-800.jpg" alt="" loading="lazy">' : '<img class="is-ph" src="' + IMG + 'logos/ida.png" alt="">';
    return '<article class="winner">' + picLink(a, pic, 'winner__pic') +
      '<p class="winner__cat">' + esc(a.by ? T(a.cat).split(' · ')[0] : T(a.cat)) + '</p><h3>' + esc(a.game) + '</h3><p>' + esc(a.studio) + '</p>' + awardBy(a, 'award-by--sm') +
      '</article>';
  }
  function winnersGrid(list) {
    return '<div class="winners' + (list.length === 3 ? ' winners--3' : '') + '">' + list.map(winnerCard).join('') + '</div>';
  }
  // Premio mayor del año (award.top): portada grande + laurel con la categoría y el año; debajo, el resto
  function topWinner(a, e) {
    var cat = T(a.cat).split(' · ');
    var also = e.awards.filter(function (b) { return b !== a && b.game === a.game; }).map(function (b) { return T(b.cat); });
    var pic = a.cover ? '<img src="' + IMG + 'games/' + a.cover + '" alt="" loading="lazy">' : '<img class="is-ph" src="' + IMG + 'logos/ida.png" alt="">';
    return '<article class="topwin">' + picLink(a, pic, 'topwin__pic') + '<div class="topwin__body">' +
      '<div class="laurel"><img src="' + IMG + 'deco/laurel-color.png" alt="" width="385" height="337"><span class="laurel__txt"><b>' + esc(cat[0]) + '</b><i>' + e.year + '</i></span></div>' +
      (a.by ? awardBy(a, '') : (cat[1] ? '<p class="topwin__extra">' + esc(cat[1]) + '</p>' : '')) +
      '<h3>' + esc(a.game) + '</h3><p class="topwin__studio">' + esc(a.studio) + '</p>' +
      (also.length ? '<p class="topwin__also">También ganó: ' + esc(also.join(', ')) + '</p>' : '') +
    '</div></article>';
  }
  // Showcase con portadas (games con objetos { game, steam|url, cover }): todos los videojuegos juntos,
  // primero los ganadores (en el orden de `awards`), con una etiqueta por premio
  function hasShowcase(e) { return (e.games || []).some(function (g) { return typeof g === 'object'; }); }
  function showcaseGrid(e) {
    var list = e.games.map(function (g, i) {
      var wins = e.awards.filter(function (a) { return a.game === g.game; });
      return { g: g, wins: wins, rank: wins.length ? e.awards.indexOf(wins[0]) : 1000 + i };
    }).sort(function (a, b) { return a.rank - b.rank; });
    return '<div class="showcase">' + list.map(function (it) {
      var g = it.g, href = g.steam ? steamUrl(g) : g.url || '';
      var pic = g.cover ? '<img src="' + IMG + 'games/' + g.cover + '" alt="" loading="lazy" width="616" height="353">' : '<img class="is-ph" src="' + IMG + 'logos/ida.png" alt="">';
      var top = it.wins.some(function (a) { return a.top; });
      var cats = it.wins.map(function (a) { return T(a.cat).split(' · ')[0]; }).join(', ');
      // Etiqueta sobre la portada (abajo a la derecha); las categorías quedan en el title de la portada (al pasar el mouse)
      if (it.wins.length) pic += '<span class="sc__badge">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>Ganador</span>';
      return '<article class="sc' + (it.wins.length ? ' sc--win' : '') + (top ? ' sc--top' : '') + '">' +
        (href ? '<a class="sc__pic" href="' + href + '" target="_blank" rel="noopener" aria-label="' + esc(g.game) + (g.steam ? ' en Steam' : '') + '"' + (cats ? ' title="Ganador: ' + esc(cats) + '"' : '') + '>' + pic + '</a>' : '<div class="sc__pic">' + pic + '</div>') +
        '<h4>' + esc(g.game) + '</h4></article>';
    }).join('') + '</div>';
  }
  function awardsBlock(e) {
    var top = e.awards.filter(function (a) { return a.top; })[0];
    return top ? topWinner(top, e) + winnersGrid(e.awards.filter(function (a) { return a !== top; })) : winnersGrid(e.awards);
  }
  // Home: solo los premios marcados con `featured`
  R.winners = function (el) {
    var aw = cur.awards || [];
    if (!aw.length) { el.innerHTML = '<p>' + esc(U('aw.none')) + '</p>'; return; }
    var feat = aw.filter(function (a) { return a.featured; });
    // el botón 'Ver todos los premios' va en la fila del título (index.html)
    el.innerHTML = winnersGrid(feat.length ? feat : aw);
  };
  // Página de premios: todos los premios, edición por edición
  R.awardsAll = function (el) {
    el.innerHTML = D.editions.filter(function (e) { return e.awards.length; }).map(function (e, i) {
      return '<section class="section' + (i % 2 ? ' dark' : '') + '" id="premios-' + e.year + '"><div class="wrap">' +
        '<div class="yhead"><span class="yhead__year">' + e.year + '</span><h2 class="display">Premios IDA ' + e.year + '</h2>' +
        '<a class="u-link" href="ediciones.html#ed-' + e.year + '">Ver la edición ' + e.year + '</a></div>' +
        awardsBlock(e) + '</div></section>';
    }).join('');
  };

  // Exhibición digital en Steam (edition.steam)
  function steamStats(s) {
    return '<div class="steam__stats">' +
      '<div><b>+' + num(s.games) + '</b><span>videojuegos argentinos</span></div>' +
      (s.featured ? '<div><b>' + num(s.featured) + '</b><span>de la exhibición presencial</span></div>' : '') +
      (s.frontpage ? '<div><b>' + s.frontpage + ' h</b><span>en la portada de Steam Argentina</span></div>' : '') +
      (s.followers ? '<div><b>' + num(s.followers) + '</b><span>seguidores en Steam</span></div>' : '') + '</div>';
  }
  // Bloque completo (texto, números, botón y arte). head = lo que va arriba del texto (título de la home o etiqueta de la edición), text = el párrafo
  function steamBlock(e, head, text) {
    var s = e.steam;
    return '<div class="steam">' +
      '<div>' + head +
        '<p class="lead">' + text + '</p>' +
        steamStats(s) +
        '<a class="pill" href="' + s.url + '" target="_blank" rel="noopener">Ver el evento en Steam</a>' +
        (s.partner ? '<p class="note">Presentado por Indie Dev Argentina y ' + esc(s.partner) + ', el publisher mexicano que hizo posible el acuerdo con Valve.</p>' : '') + '</div>' +
      '<a class="steam__art' + (s.mockup ? ' steam__art--mockup' : s.shot ? ' steam__art--shot' : '') + '" href="' + s.url + '" target="_blank" rel="noopener" aria-label="Abrir el evento de IDA en Steam">' +
        (s.mockup ? '<img src="' + IMG + 'photos/' + s.mockup + '" alt="La página del evento de IDA ' + e.year + ' en Steam, con los videojuegos de la exhibición" loading="lazy" width="1096" height="1367">' :
         s.shot ? '<img src="' + IMG + 'photos/' + s.shot + '.jpg" alt="La página del evento de IDA ' + e.year + ' en Steam, con la selección de videojuegos de la exhibición presencial" loading="lazy" width="1100" height="1200">'
          : '<img src="' + IMG + 'photos/' + s.img + '.jpg" alt="Indie Dev Argentina, Video Game Exhibition ' + e.year + ', en Steam" loading="lazy" width="800" height="450">') + '</a>' +
    '</div>';
  }
  R.steam = function (el) {
    var sec = el.closest('section');
    if (!cur.steam) { if (sec) sec.hidden = true; return; }
    el.innerHTML = steamBlock(cur, '<p class="kicker">Nuevo en ' + cur.year + ' · primera exhibición digital</p><h2 class="display">IDA en Steam</h2>',
      'El primer showcase de Steam dedicado exclusivamente a videojuegos argentinos. Una exhibición oficial dentro de la tienda que reunió demos jugables, descuentos y la selección completa de proyectos presentes en la muestra física de IDA. Durante sus primeras 48 horas, el banner del evento ocupó la portada de Steam para todos los usuarios de Argentina, llevando el talento de nuestros desarrolladores a millones de jugadores.');
  };

  // 3 videos (como "Why Attend?")
  // Nombre del video de una edición: el aftermovie, salvo que la edición diga otra cosa (videoLabel)
  function videoLabel(e) { return e.videoLabel ? T(e.videoLabel) : U('v2.vid.after', { y: e.year }); }
  R.videos = function (el) {
    var withVideo = D.editions.filter(function (e) { return e.video && !(e.placeholder && e.placeholder.video); });
    var cards = [];
    if (cur.placeholder && cur.placeholder.video || !cur.video) {
      cards.push('<div class="vcard vcard--soon">' + photo('g26-05') + '<span class="vcard__play" aria-hidden="true"></span><span class="vcard__label">' + esc(U('video.soon', { y: cur.year })) + '</span></div>');
    }
    withVideo.slice(0, 2).forEach(function (e) {
      cards.push('<button class="vcard" type="button" data-yt="' + e.video + '" aria-label="' + esc(U('video.play', { y: e.year })) + '"><img src="https://i.ytimg.com/vi/' + e.video + '/hq720.jpg" alt="" loading="lazy"><span class="vcard__play" aria-hidden="true"></span><span class="vcard__label">' + esc(videoLabel(e)) + '</span></button>');
    });
    cards.push('<a class="vcard" href="' + D.links.youtube + '" target="_blank" rel="noopener">' + photo('g24-02') + '<span class="vcard__play" aria-hidden="true"></span><span class="vcard__label">' + esc(U('video.playlist')) + '</span></a>');
    el.innerHTML = '<div class="vcards">' + cards.slice(0, 3).join('') + '</div>';
  };

  // 4 fotos (como "The Power of Community")
  R.photos = function (el) {
    // la primera foto ya está en el hero
    var list = (cur.photos || []).filter(function (p) { return p !== 'g26-01'; }).slice(0, 4);
    el.innerHTML = '<div class="photos">' + list.map(function (p) { return galLink(cur.photos, cur.photos.indexOf(p), photo(p)); }).join('') + '</div>';
  };

  R.past = function (el) {
    el.innerHTML = '<h3>' + esc(U('v2.past.title')) + '</h3><div class="past__list">' + D.editions.slice(1).map(function (e) {
      return '<a class="past__item" href="ediciones.html#ed-' + e.year + '"><b>IDA ' + e.year + '</b><span>' + esc(T(e.ord)) + ' · ' + esc(T(e.date)) + ' · ' + esc(venueName(e)) + '</span><i>' +
        '+' + num(e.stats.attendees) + ' ' + esc(U('stat.short.attendees')) + ' · ' + e.stats.games + ' ' + esc(U('stat.short.games')) + '</i></a>';
    }).join('') + '</div>';
  };

  // Sponsors sobre negro (como "Thank you to our Diamond Partners")
  function logo(id) {
    var o = D.orgs[id]; if (!o) return '';
    var img = '<img src="' + IMG + 'logos/' + o.logo + '" alt="' + esc(o.name) + '" title="' + esc(o.name) + '"' + (o.scale ? ' data-scale="' + o.scale + '"' : '') + '>';
    var c = (o.tile ? 'is-tile' : '') + (o.mono ? ' is-mono' : '') + (o.wide ? ' is-wide' : '');
    return o.url ? '<a class="' + c.trim() + '" href="' + o.url + '" target="_blank" rel="noopener">' + img + '</a>' : '<span class="' + c.trim() + '">' + img + '</span>';
  }
  // Un grupo de sponsors es una lista de ids o una lista de niveles ([[más aporte], [resto]]): el primero va más grande
  function tiers(list) { return list && list.length ? (Array.isArray(list[0]) ? list : [list]) : []; }
  function logoRow(ids, cls) {
    return '<div class="logos logos--even ' + (cls || '') + '" style="--cols:' + (ids.length > 4 ? Math.ceil(ids.length / 2) : ids.length) + '">' + ids.map(logo).join('') + '</div>';
  }
  // compact: versión chica para la página de ediciones ("Presentado por" no va más grande)
  function sponsorGroups(s, compact) {
    return [['presenta', 'logos--lg'], ['apoyo', ''], ['acompanan', '']].map(function (g) {
      var t = tiers(s[g[0]]);
      return t.length ? '<div class="pgroup"><span class="pgroup__label">' + esc(U('sp.' + g[0])) + '</span><div class="tiers">' + t.map(function (ids, i) {
        return logoRow(ids, g[1] || (t.length > 1 && i === 0 ? 'logos--lg' : ''));
      }).join('') + '</div></div>' : '';
    }).join('');
  }
  // Sin botón "Quiero ser sponsor": la banda #ser-sponsor está justo arriba
  R.partners = function (el) { el.innerHTML = sponsorGroups(cur.sponsors); };
  // Página de sponsors: todos los que acompañaron alguna edición
  R.wall = function (el) {
    var seen = { pressover: 1, ocppc: 1 }, ids = []; // Press Over y Culturas Políticas organizan: no van en el muro
    D.editions.forEach(function (e) {
      ['presenta', 'apoyo', 'acompanan'].forEach(function (g) {
        [].concat.apply([], tiers(e.sponsors[g])).forEach(function (id) { if (!seen[id]) { seen[id] = 1; ids.push(id); } });
      });
    });
    // Los logos compuestos (wide) van al final, en una fila propia
    var wide = ids.filter(function (id) { return D.orgs[id] && D.orgs[id].wide; });
    ids = ids.filter(function (id) { return wide.indexOf(id) < 0; });
    // Columnas que dejen la última fila lo más llena posible (15 logos = 3 x 5)
    var cols = [6, 5, 4].reduce(function (best, c) {
      var fill = ids.length % c ? ids.length % c / c : 1;
      return fill > best.fill ? { c: c, fill: fill } : best;
    }, { c: 5, fill: -1 }).c;
    el.innerHTML = '<div class="logos logos--even" style="--cols:' + cols + '">' + ids.concat(wide).map(logo).join('') + '</div>';
  };

  R.info = function (el) {
    var n = D.next, v = n.venue && D.venues[n.venue];
    el.innerHTML = '<dl class="facts">' +
      '<div><dt>' + esc(U('info.when')) + '</dt><dd>' + esc(T(n.dateLabel)) + (n.hours ? ', ' + esc(n.hours) : '') + '</dd></div>' +
      '<div><dt>' + esc(U('info.where')) + '</dt><dd>' + (v ? esc(v.name) + ' · ' + esc(v.address) : esc(U('info.venueTbc'))) + '</dd></div>' +
      '<div><dt>' + esc(U('info.cost')) + '</dt><dd>' + esc(U('info.free')) + '</dd></div>' +
      '</dl>';
  };

  // IDA en números, acumulado de todas las ediciones (ediciones y sponsors)
  R.totals = function (el) {
    var t = { attendees: 0, games: 0, talks: 0, speakers: 0 };
    D.editions.forEach(function (e) { Object.keys(t).forEach(function (k) { t[k] += e.stats[k] || 0; }); });
    var items = [[D.editions.length, '', 'Ediciones'], [t.attendees, '+', 'Asistentes', 1], [t.games, '', 'Videojuegos'], [t.talks, '', 'Charlas'], [t.speakers, '', 'Speakers']];
    el.innerHTML = '<div class="stats">' + items.map(function (i) {
      return '<div class="stat"><b data-count="' + i[0] + '" data-prefix="' + i[1] + '"' + (i[3] ? ' data-k="1"' : '') + '>' + i[1] + (i[3] ? numK(i[0]) : num(i[0])) + '</b><span>' + esc(i[2]) + '</span></div>';
    }).join('') + '</div>';
    countUp(el);
  };

  // Barras de crecimiento por edición (data-key: attendees | games)
  R.growth = function (el) {
    var key = el.dataset.key || 'attendees';
    var list = D.editions.slice().reverse();
    var max = Math.max.apply(null, list.map(function (e) { return e.stats[key]; }));
    el.innerHTML = '<div class="growth">' + list.map(function (e) {
      return '<div class="growth__row"><b>' + e.year + '</b><div class="growth__bar"><i style="width:' + Math.round(e.stats[key] / max * 100) + '%"></i></div><span>' + num(e.stats[key]) + '</span></div>';
    }).join('') + '</div>';
  };

  // Accesos a cada año (página de ediciones)
  R.yearNav = function (el) {
    el.innerHTML = D.editions.map(function (e) { return '<a class="pill pill--ghost" href="#ed-' + e.year + '">IDA ' + e.year + '</a>'; }).join('');
  };

  // Página de ediciones: todas desplegadas, de la más nueva a la más vieja
  R.editionsAll = function (el) {
    el.innerHTML = D.editions.map(function (e, i) {
      var v = D.venues[e.venue] || {}, P = e.placeholder || {};
      var stats = ['attendees', 'games', 'talks', 'speakers'].map(function (k) {
        var pre = k === 'attendees' ? '+' : '';
        return '<div><b>' + pre + num(e.stats[k]) + '</b><span>' + esc(U('stat.' + k)) + '</span></div>';
      }).join('');
      var gallery = e.photos.length ? '<div class="ed__block"><h3 class="ed__label">Galería</h3><div class="gallery">' +
        e.photos.slice(0, 9).map(function (p, i) {
          var more = i === 8 && e.photos.length > 9 ? e.photos.length - 9 : 0; // la última muestra cuántas quedan: el visor tiene todas
          return galLink(e.photos, i, photo(p, '(max-width: 760px) 50vw, 30vw') + (more ? '<span class="gallery__more">+' + more + '</span>' : ''), more ? U('lb.more', { n: e.photos.length }) : '');
        }).join('') + '</div></div>' : '';
      var sc = hasShowcase(e);
      var games = !e.games || !e.games.length ? '' : sc ?
        '<div class="ed__block"><h3 class="ed__label">Videojuegos del showcase</h3>' + showcaseGrid(e) + '</div>' :
        '<div class="ed__block"><h3 class="ed__label">Videojuegos del showcase</h3><ul class="games">' +
        e.games.map(function (g) { return '<li>' + esc(g) + '</li>'; }).join('') + '</ul></div>';
      var video = e.video && !P.video && e.archiveVideo !== false ? '<div class="ed__block"><h3 class="ed__label">' + (e.videoLabel ? 'Video' : 'Aftermovie') + '</h3><button class="vcard ed__video" type="button" data-yt="' + e.video + '" aria-label="' + esc(U('video.play', { y: e.year })) + '">' +
        '<img src="https://i.ytimg.com/vi/' + e.video + '/hq720.jpg" alt="" loading="lazy"><span class="vcard__play" aria-hidden="true"></span><span class="vcard__label">' + esc(videoLabel(e)) + '</span></button></div>' : '';
      var awards = e.awards.length && !sc ? '<div class="ed__block"><h3 class="ed__label">Premios IDA</h3>' + awardsBlock(e) + '</div>' : '';
      return '<section class="edition dark' + (i % 2 ? ' dark--ink' : '') + '" id="ed-' + e.year + '"><div class="wrap">' +
        '<header class="ed__head"><span class="ed__year">' + e.year + '</span><div><p class="ed__ord">' + esc(T(e.ord)) + ' · ' + esc(T(e.tag)) + '</p>' +
          '<p class="ed__meta">' + esc(T(e.date)) + ' · ' + esc(e.hours) + ' · ' + esc(v.name || '') + (v.address ? ', ' + esc(v.address) : '') + '</p></div></header>' +
        '<div class="ed__intro"><p class="lead">' + esc(T(e.summary)) + '</p><ul class="topics">' + e.highlights.map(function (h) { return '<li>' + esc(T(h)) + '</li>'; }).join('') + '</ul></div>' +
        '<div class="ed__stats">' + stats + '</div>' +
        (e.statsNote ? '<p class="note">' + esc(T(e.statsNote)) + '</p>' : '') +
        (e.guests && e.guests.length ? '<div class="ed__block"><h3 class="ed__label">Speakers internacionales</h3><div class="guests">' + e.guests.map(function (g) {
          // Tarjeta de speaker: foto redonda (o iniciales), nombre, cargo, bandera y país; debajo, la charla
          var initials = g.name.split(' ').map(function (w) { return w.charAt(0); }).join('').slice(0, 2);
          return '<article class="guest"><div class="guest__head">' +
            '<div class="guest__pic">' + (g.img ? '<img src="' + IMG + 'photos/' + g.img + '.jpg" alt="' + esc(g.name) + '" loading="lazy" width="300" height="300">' : '<span aria-hidden="true">' + esc(initials) + '</span>') + '</div>' +
            '<div><p class="guest__from">' + (g.flag ? '<img src="' + IMG + 'flags/' + g.flag + '.png" alt="" width="24" height="16">' : '') + esc(T(g.from)) + '</p>' +
            '<h4>' + esc(g.name) + '</h4><p class="guest__role">' + esc(T(g.role)) + '</p></div></div>' +
            (g.talk ? '<p class="guest__talk"><span>Charla</span>«' + esc(g.talk) + '»</p>' : '') +
            (g.note ? '<p class="guest__note">' + esc(T(g.note)) + '</p>' : '') + '</article>';
        }).join('') + '</div>' + (e.guestsNote ? '<p class="note">' + esc(T(e.guestsNote)) + '</p>' : '') + '</div>' : '') +
        gallery + games +
        (e.steam ? '<div class="ed__block">' + steamBlock(e, '<h3 class="ed__label">Exhibición digital en Steam</h3><h4 class="steam__title">IDA en Steam</h4>',
          'IDA llevó la escena indie argentina a Steam con el primer showcase de la plataforma dedicado exclusivamente a videojuegos nacionales. La exhibición reunió demos jugables, descuentos y todos los proyectos seleccionados para la muestra presencial. Durante las primeras 48 horas, el evento tuvo presencia en la portada de Steam para todos los usuarios de Argentina.') + '</div>' : '') +
        video + awards +
        '<div class="ed__block sponsors-compact">' + sponsorGroups(e.sponsors, true) + '</div>' +
      '</div></section>';
    }).join('');
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
    fitLogos();
  }

  // Equilibrio óptico de los logos: todos ocupan más o menos la misma superficie, así un logo cuadrado
  // no se ve chico al lado de uno muy ancho. Deja un ancho por contexto (lo elige el CSS):
  // --lw-l escritorio, --lw-m sponsors compactos de Ediciones, --lw-s celular. [común, destacado]
  // Además se compensa el peso: un logo de trazo fino (poca tinta) va algo más grande que uno macizo.
  var LOGO_AREA = { l: [7000, 15000], m: [2600, 6000], s: [2300, 3400] };
  var INK = {};
  function inkOf(img) { // fracción de la caja que tiene tinta (0..1)
    if (INK[img.src] != null) return INK[img.src];
    var d = 0.4;
    try {
      var w = Math.min(160, img.naturalWidth), h = Math.max(1, Math.round(w * img.naturalHeight / img.naturalWidth));
      var cv = document.createElement('canvas'); cv.width = w; cv.height = h;
      var cx = cv.getContext('2d'); cx.drawImage(img, 0, 0, w, h);
      var px = cx.getImageData(0, 0, w, h).data, s = 0;
      var e = px.length - 4, r = w * 4 - 4; // fondo opaco (las cuatro esquinas): cuenta lo que se distingue del fondo
      var bg = px[3] > 200 && px[r + 3] > 200 && px[e + 3] > 200 && px[e - r + 3] > 200 ? [px[0], px[1], px[2]] : null;
      for (var i = 0; i < px.length; i += 4) {
        s += bg ? (Math.abs(px[i] - bg[0]) + Math.abs(px[i + 1] - bg[1]) + Math.abs(px[i + 2] - bg[2]) > 90 ? 1 : 0) : px[i + 3] / 255;
      }
      d = s / (w * h);
    } catch (e) {}
    return (INK[img.src] = d);
  }
  function fitLogos() {
    document.querySelectorAll('.logos--even img').forEach(function (img) {
      function fit() {
        if (!img.naturalWidth || !img.naturalHeight) return;
        var ar = img.naturalWidth / img.naturalHeight, lg = img.closest('.logos--lg') ? 1 : 0;
        var ink = Math.min(1.6, Math.max(0.75, Math.sqrt(0.42 / Math.max(inkOf(img), 0.05))));
        Object.keys(LOGO_AREA).forEach(function (k) {
          // ar^0.42 en vez de ar^0.5: los muy anchos quedan apenas más cortos, porque a lo largo pesan más
          img.style.setProperty('--lw-' + k, Math.round(Math.sqrt(LOGO_AREA[k][lg] * (+img.dataset.scale || 1) * ink) * Math.pow(ar, 0.42)) + 'px');
        });
      }
      if (img.complete) fit(); else img.addEventListener('load', fit, { once: true });
    });
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

  // Visor de fotos: foto grande, flechas, tira de miniaturas, contador y cerrar.
  // Teclado (← → Esc), deslizar en celular y clic afuera de la foto para cerrar.
  function initLightbox() {
    var box, img, count, strip, list = [], at = 0, back = null, x0 = null;
    var CHEV = function (d) { return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + d + '"/></svg>'; };
    function src(i, small) { return IMG + 'photos/' + list[i] + (small ? '-800' : '') + '.jpg'; }
    function build() {
      box = document.createElement('div');
      box.className = 'lb'; box.hidden = true;
      box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true');
      box.innerHTML = '<div class="lb__top"><span class="lb__count" aria-live="polite"></span>' +
        '<button class="lb__close" type="button">' + CHEV('M6 6l12 12M18 6L6 18') + '</button></div>' +
        '<div class="lb__stage"><button class="lb__nav lb__prev" type="button">' + CHEV('M15 5l-7 7 7 7') + '</button>' +
        '<img class="lb__img" alt="">' +
        '<button class="lb__nav lb__next" type="button">' + CHEV('M9 5l7 7-7 7') + '</button></div>' +
        '<div class="lb__thumbs"></div>';
      document.body.appendChild(box);
      img = box.querySelector('.lb__img'); count = box.querySelector('.lb__count'); strip = box.querySelector('.lb__thumbs');
      box.querySelector('.lb__close').addEventListener('click', close);
      box.querySelector('.lb__prev').addEventListener('click', function () { go(at - 1); });
      box.querySelector('.lb__next').addEventListener('click', function () { go(at + 1); });
      box.querySelector('.lb__stage').addEventListener('click', function (e) { if (e.target === e.currentTarget) close(); });
      strip.addEventListener('click', function (e) { var b = e.target.closest('[data-i]'); if (b) go(+b.dataset.i); });
      box.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') close();
        else if (e.key === 'ArrowLeft') go(at - 1);
        else if (e.key === 'ArrowRight') go(at + 1);
        else if (e.key === 'Tab') { // el foco no se escapa del visor
          var f = [].slice.call(box.querySelectorAll('button')).filter(function (b) { return b.offsetParent; });
          if (e.shiftKey && document.activeElement === f[0]) { f[f.length - 1].focus(); e.preventDefault(); }
          else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { f[0].focus(); e.preventDefault(); }
        }
      });
      img.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
      img.addEventListener('touchend', function (e) {
        if (x0 == null) return;
        var dx = e.changedTouches[0].clientX - x0; x0 = null;
        if (Math.abs(dx) > 45) go(at + (dx < 0 ? 1 : -1));
      });
    }
    function labels() {
      box.setAttribute('aria-label', U('lb.label'));
      box.querySelector('.lb__close').setAttribute('aria-label', U('lb.close'));
      box.querySelector('.lb__prev').setAttribute('aria-label', U('lb.prev'));
      box.querySelector('.lb__next').setAttribute('aria-label', U('lb.next'));
    }
    function go(i) {
      at = (i + list.length) % list.length;
      img.src = src(at);
      count.textContent = (at + 1) + ' / ' + list.length;
      [at - 1, at + 1].forEach(function (j) { new Image().src = src((j + list.length) % list.length); }); // las vecinas ya cargadas
      [].forEach.call(strip.children, function (b, j) {
        var on = j === at;
        b.classList.toggle('is-on', on);
        if (on) { b.setAttribute('aria-current', 'true'); b.scrollIntoView({ block: 'nearest', inline: 'center' }); } else b.removeAttribute('aria-current');
      });
    }
    function open(names, i, from) {
      if (!box) build();
      labels();
      list = names; back = from;
      strip.innerHTML = list.map(function (p, j) {
        return '<button type="button" data-i="' + j + '" aria-label="' + (j + 1) + ' / ' + list.length + '"><img src="' + src(j, true) + '" alt="" loading="lazy"></button>';
      }).join('');
      box.hidden = false;
      document.documentElement.classList.add('lb-open');
      go(i);
      box.querySelector('.lb__close').focus();
    }
    function close() {
      box.hidden = true;
      document.documentElement.classList.remove('lb-open');
      img.removeAttribute('src');
      if (back) back.focus();
    }
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[data-gal]');
      if (!a || e.ctrlKey || e.metaKey || e.shiftKey) return; // con Ctrl/Cmd se sigue pudiendo abrir en otra pestaña
      e.preventDefault();
      open(a.dataset.gal.split(','), +a.dataset.i, a);
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

  // Newsletter de Press Over: el email va a Substack sin salir de la web. Substack no deja leer su respuesta
  // desde otro sitio (no-cors), así que se agradece la suscripción; si el envío falla, se abre Substack.
  function initNews() {
    document.addEventListener('submit', function (e) {
      var form = e.target.closest('form.news'); if (!form) return;
      e.preventDefault();
      var input = form.querySelector('[name="email"]'), btn = form.querySelector('[type="submit"]'), status = form.querySelector('.news__status');
      function say(k, cls) { status.textContent = U(k); status.className = 'form-status news__status ' + (cls || ''); }
      if (!input.checkValidity()) { say('news.invalid', 'is-err'); input.focus(); return; }
      btn.disabled = true; say('form.sending');
      fetch(SUBSTACK + 'api/v1/free', {
        method: 'POST', mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'email=' + encodeURIComponent(input.value.trim()) + '&source=embed'
      }).then(function () { form.reset(); say('news.ok', 'is-ok'); })
        .catch(function () { say('news.err', 'is-err'); form.submit(); })
        .then(function () { btn.disabled = false; });
    });
  }

  // ---------------------------------------------------------------- boot
  injectChrome();
  captureES();
  initNav();
  initVideo();
  initForms();
  initNews();
  initLightbox();
  applyLang();
  // Las secciones con id (#ed-2025, #premios-2026) las arma el JS: se baja a la del link después de armarlas
  if (location.hash.length > 1) {
    var target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target) setTimeout(function () { target.scrollIntoView(); }, 60);
  }
})();
