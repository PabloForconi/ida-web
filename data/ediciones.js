/*
  IDA · contenido año por año
  ---------------------------------------------------------------------------
  Este es el único archivo que hay que tocar para:
    - cargar una edición nueva (copiar un bloque de `editions` y ponerlo PRIMERO),
    - actualizar números, fotos, video, premios y sponsors de una edición,
    - poner la fecha de la próxima edición (activa el countdown de la home),
    - abrir o cerrar convocatorias,
    - cambiar el endpoint de los formularios.

  Textos: { es: '...', en: '...' }. Fotos: nombre en src/img/photos sin extensión
  (se usan <nombre>.jpg y <nombre>-800.jpg). Logos: archivo en src/img/logos.
  `games` (opcional): nombres de los juegos del showcase, se listan en el archivo de ediciones.
  Premios: `cover` = portada del juego en src/img/games (la de Steam, 616x353); `img` = foto en img/photos.
  `featured: true` marca los premios que se muestran en la home (si no hay ninguno, van los primeros);
  `steam`: id de la app en Steam (store.steampowered.com/app/<id>), para el link de cada juego premiado.
  `by`: id de `orgs` del sponsor que presenta el premio (en la versión 2 se muestra su logo).
  `top: true`, el premio mayor del año (Mejor Videojuego): en la versión 2 se destaca con un laurel.
  `guests`: speakers internacionales; `flag` = código de país (img/flags/<código>.png), `img` = foto cuadrada en img/photos (sin foto, van las iniciales).
  Sponsors: cada grupo es una lista de ids, o una lista de niveles ([[grandes], [resto]]) cuando
  algunos aportaron más: el primer nivel se muestra más grande y cada nivel, con logos del mismo tamaño.
  `placeholder: true` muestra la etiqueta PLACEHOLDER en la web: sacarla cuando el dato sea real.
*/
window.IDA_DATA = {

  // Próxima edición. Con `date` en null la home muestra "Fecha a confirmar" en vez del countdown.
  next: {
    year: 2027,
    ord: { es: 'Cuarta edición', en: 'Fourth edition' },
    date: '2027-06-26T11:00:00-03:00', // activa la cuenta regresiva de la home actual
    dateLabel: { es: 'Sábado 26 de junio', en: 'Saturday, June 26' },
    hours: '11 – 20 h',
    venue: 'ccc', // clave de `venues`
    calls: {
      games: { open: false, url: 'https://oxoawards.com/ida2026' },
      talks: { open: false, url: null }
    }
  },

  config: {
    // Formspree (https://formspree.io): crear un form, copiar su endpoint acá.
    formEndpoint: 'https://formspree.io/f/REEMPLAZAR',
    mediaKit: 'docs/IDA-media-kit.pdf', // PDF para sponsors (placeholder)
    contactEmail: 'hola@indiedevargentina.com' // placeholder
  },

  links: {
    instagram: 'https://www.instagram.com/indiedevargentina/',
    x: 'https://x.com/IndieDevAr',
    youtube: 'https://www.youtube.com/playlist?list=PL4MM4yFwAavE0hKBzh70Vk25Pu28aM_Xt',
    facebook: 'https://www.facebook.com/indiedevargentina/',
    pressover: 'https://pressover.news/'
  },

  venues: {
    ccc: {
      name: 'Centro Cultural de la Cooperación',
      short: 'CCC', // nombre corto para la barra superior en celular
      address: 'Av. Corrientes 1543, CABA',
      map: 'https://maps.app.goo.gl/QorT6KUPbsa9SZ6o8',
      embed: 'https://maps.google.com/maps?q=Av.%20Corrientes%201543%2C%20CABA&t=m&z=15&output=embed&iwloc=near'
    },
    casapba: {
      name: 'Casa de la Provincia de Buenos Aires',
      address: 'CABA',
      map: 'https://maps.google.com/?q=Casa+de+la+Provincia+de+Buenos+Aires+CABA',
      embed: null
    }
  },

  // Organizaciones (sponsors, apoyos, comunidades). `tile: true` = logo con fondo claro, va sobre placa blanca.
  // `mono: true` = logo oscuro de un color, se muestra en blanco.
  // `scale`: multiplica el área visual del logo (1.5 = 50% más). `wide: true`: logo compuesto, va en una fila propia.
  orgs: {
    pressover:   { name: 'Press Over', logo: 'pressover.png', url: 'https://pressover.news/' },
    ocppc:       { name: 'Observatorio de Culturas Políticas y Políticas Culturales', logo: 'ocppc.png', url: 'https://www.centrocultural.coop/OCPPC' },
    ccc:         { name: 'Centro Cultural de la Cooperación', logo: 'ccc.png', url: 'https://www.centrocultural.coop/', scale: 1.4 },
    storyteller: { name: 'Storyteller', logo: 'storyteller.png', url: 'https://store.steampowered.com/app/1624540/Storyteller/?l=latam' },
    francia:     { name: 'Embajada de Francia · Institut Français', logo: 'francia.png', url: 'https://ar.diplomatie.gouv.fr/fr', scale: 2.2 },
    maimonides:  { name: 'Universidad Maimónides', logo: 'maimonides.png', url: 'https://www.maimonides.edu/' },
    oxobox:      { name: 'Oxobox', logo: 'oxobox.png', url: 'https://oxoawards.com/' },
    pm:          { name: 'Provincia Microcréditos', logo: 'pm-color.png', url: 'https://www.provinciamicrocreditos.com.ar/' },
    osai:        { name: 'Fundación OSAI', logo: 'osai.png', url: 'https://www.osai.org.ar/' },
    comu:        { name: 'COMU · Ciencias de la Comunicación UBA', logo: 'comu-color.png', url: 'https://comunicacion.sociales.uba.ar/' },
    casapba:     { name: 'Casa de la Provincia de Buenos Aires', logo: 'casa-pba.png', url: null, mono: true, scale: 6.5, wide: true }, // cuatro logos en uno: fila propia, bien grande
    ubasociales: { name: 'Facultad de Ciencias Sociales UBA', logo: 'uba-sociales.png', url: 'https://www.sociales.uba.ar/', mono: true },
    adva:        { name: 'ADVA', logo: 'adva.png', url: 'https://adva.vg/' },
    fundav:      { name: 'FUNDAV · Fundación Argentina de Videojuegos', logo: 'fundav.png', url: 'https://fundav.com/' },
    playbold:    { name: 'Play Bold', logo: 'playbold.png', url: 'https://playbold.agency/' },
    gameever:    { name: 'Game Ever', logo: 'gameever.png', url: 'https://gameeverstudio.com/' },
    foton:       { name: 'Foton Games', logo: 'foton.png', url: null },
    amd:         { name: 'AMD', logo: 'amd.svg', url: 'https://www.amd.com/', mono: true },
    // comunidades
    godot:       { name: 'Godot Argentina', logo: 'godot.png', url: null },
    audiovj:     { name: 'Audio para Videojuegos Argentina', logo: 'audio-vj.png', url: null },
    construct:   { name: 'Construct Meetup Argentina', logo: 'construct.png', url: null },
    redcom:      { name: 'Red de Comunidades de Desarrollo de Videojuegos', logo: 'red-comunidades.png', url: null },
    wigar:       { name: 'Women in Games Argentina', logo: 'wigar.png', url: null },
    acciondev:   { name: 'Acción Dev', logo: 'acciondev.png', url: null }
  },

  // Ediciones, de la más nueva a la más vieja.
  editions: [
    {
      year: 2026,
      ord: { es: 'Tercera edición', en: 'Third edition' },
      tag: { es: 'Tres pisos del CCC', en: 'Three floors of the CCC' },
      date: { es: 'Sábado 1 de agosto', en: 'Saturday, August 1' },
      hours: '11 – 20 h',
      venue: 'ccc',
      summary: {
        es: 'La tercera edición ocupó tres pisos y cuatro salas de conferencias del Centro Cultural de la Cooperación: showcase de videojuegos, charlas en simultáneo, networking y la segunda entrega de los Premios IDA, con diez categorías.',
        en: 'The third edition filled three floors and four conference rooms of the Centro Cultural de la Cooperación: game showcase, parallel talks, networking and the second IDA Awards, with ten categories.'
      },
      // Asistentes, juegos, postulaciones y charlas: notas de Press Over (3/8 y 7/8/2026). Speakers, provisorio.
      stats: { attendees: 3000, games: 25, talks: 22, speakers: 24 },
      statsNote: { es: '25 videojuegos seleccionados entre 114 postulados · 20 charlas nacionales y 2 internacionales', en: '25 games picked from 114 submissions · 20 national talks and 2 international' },
      highlights: [
        { es: 'Tres pisos y cuatro salas de conferencias del CCC', en: 'Three floors and four conference rooms at the CCC' },
        { es: 'Charlas internacionales de Yoan Fanise (Valiant Hearts, Road 96) y Josué Monchán, con más de 170 personas en cada una', en: 'International talks by Yoan Fanise (Valiant Hearts, Road 96) and Josué Monchán, with over 170 people at each' },
        { es: 'Premios IDA en diez categorías; The Outer Frame, Mejor Videojuego', en: 'IDA Awards in ten categories; The Outer Frame, Best Game' },
        { es: 'Los ganadores tienen lugar asegurado en el showcase de EVA 2026, gracias a ADVA', en: 'Winners get a guaranteed spot in the EVA 2026 showcase, thanks to ADVA' },
        { es: 'Primer showcase de Steam dedicado a videojuegos argentinos: más de 150 títulos y 48 horas en la portada', en: 'First Steam showcase devoted to Argentine games: over 150 games and 48 hours on the front page' }
      ],
      // Speakers internacionales (se destacan en la página de ediciones). Charlas: grilla de salas 2026.
      guests: [
        { name: 'Yoan Fanise', flag: 'fr', img: 'guest-yoan', from: { es: 'Francia', en: 'France' }, role: { es: 'Director de Valiant Hearts y Road 96', en: 'Director of Valiant Hearts and Road 96' }, talk: 'From Ubisoft to an indie success', note: { es: 'Con el apoyo de la Embajada de Francia', en: 'With the support of the French Embassy' } },
        { name: 'Josué Monchán', flag: 'es', img: 'guest-josue', from: { es: 'España', en: 'Spain' }, role: { es: 'Guionista de Pendulo Studios (Runaway, Yesterday) y Brainwash Gang', en: 'Writer at Pendulo Studios (Runaway, Yesterday) and Brainwash Gang' }, talk: 'War is fun: lo bélico lúdico y el conflicto narrativo' }
      ],
      guestsNote: { es: 'Más de 170 personas en cada charla, con el auditorio lleno.', en: 'Over 170 people at each talk, with a packed auditorium.' },
      // Exhibición digital en Steam (evento oficial dentro de la tienda). Números de la página del evento.
      steam: {
        url: 'https://store.steampowered.com/sale/indiedevargentina2026',
        img: 'steam-26',          // arte del evento
        mockup: 'steam-26-mockup.webp', // ventana de navegador con la página del evento (fondo transparente): se muestra antes que shot
        shot: 'steam-page-26',    // captura de la página del evento en Steam (se muestra en lugar del arte)
        partner: 'Skull Queens Games',
        games: 150,     // la página lista 152; la prensa habló de "+150"
        featured: 25,   // la selección de la exhibición presencial
        frontpage: 48,  // horas con el banner de IDA en la portada de Steam en Argentina (1 al 3 de agosto)
        followers: 1462 // seguidores de Indie Dev Argentina en Steam (octubre 2026)
      },
      video: 'SxAnJbHlfE0', // Press Over Podcast sobre IDA 2026 (todavía no hay aftermovie)
      videoLabel: { es: 'IDA 2026 en Press Over Podcast', en: 'IDA 2026 on Press Over Podcast' }, // nombre de la tarjeta si el video no es el aftermovie
      archiveVideo: false, // solo en "Así se vivió IDA" de la home, no en Ediciones
      photos: ['g26-01', 'g26-02', 'g26-03', 'g26-04', 'g26-05', 'g26-06', 'g26-07', 'g26-08', 'g26-09', 'g26-10', 'g26-11', 'g26-12', 'g26-13', 'g26-14'],
      // Fuente: pressover.news, "Videojuegos ganadores de Indie Dev Argentina 2026"
      // Los 25 del showcase (lista de Cultura Geek, 27/7/2026; portadas de Steam o itch.io)
      games: [
        { game: 'Sente', steam: 1005180, cover: 'sente.jpg' },
        { game: 'Keepers of Vyrellia', steam: 3973590, cover: 'keepers.jpg' },
        { game: 'Portens', steam: 4609210, cover: 'portens.jpg' },
        { game: 'La Hija del Delta', steam: 3301850, cover: 'hija-delta.jpg' },
        { game: 'Mini-Golf Crusade', steam: 5473420, cover: 'mini-golf.jpg' },
        { game: 'Xplorite', steam: 2720230, cover: 'xplorite.jpg' },
        { game: 'Beencremental', steam: 4545940, cover: 'beencremental.jpg' },
        { game: 'Phantom Gear', steam: 1802240, cover: 'phantom-gear.jpg' },
        { game: 'Zupay: Sombras de la Independencia', steam: 4074370, cover: 'zupay.jpg' },
        { game: 'Treetopians', steam: 3967310, cover: 'treetopians.jpg' },
        { game: 'Kalamor', steam: 5012920, cover: 'kalamor.jpg' },
        { game: 'The Outer Frame', steam: 4079320, cover: 'outer-frame.jpg' },
        { game: 'Human.exe', steam: 4016270, cover: 'human-exe.jpg' },
        { game: 'Kosenki', steam: 4121220, cover: 'kosenki.jpg' },
        { game: 'Teios Journey', steam: 3506070, cover: 'teios.jpg' },
        { game: 'Gaucho: Subway Escape', steam: 3272390, cover: 'gaucho.jpg' },
        { game: 'Lucky7!', url: 'https://zaiart.itch.io/lucky7-join-the-club', cover: 'lucky7.jpg' },
        { game: 'Speedtickers', steam: 3822390, cover: 'speedtickers.jpg' },
        { game: 'AstroBrawl', steam: 3175020, cover: 'astrobrawl.jpg' },
        { game: 'HAUS', steam: 4155380, cover: 'haus.jpg' },
        { game: 'Gravity Girl', steam: 3154470, cover: 'gravity-girl.jpg' },
        { game: 'Upwind', steam: 4103810, cover: 'upwind.jpg' },
        { game: 'Noctámbulo', steam: 3885870, cover: 'noctambulo.jpg' },
        { game: 'Yume no Office', steam: 2978070, cover: 'yume.jpg' },
        { game: 'Into the Grid', steam: 2576200, cover: 'into-the-grid.jpg' }
      ],
      awards: [
        { cat: { es: 'Mejor Videojuego · Premio AMD', en: 'Best Game · AMD Award' }, game: 'The Outer Frame', studio: 'Sapucai Games', steam: 4079320, cover: 'outer-frame.jpg', featured: true, top: true, by: 'amd' },
        { cat: { es: 'Identidad Argentina', en: 'Argentine Identity' }, game: 'Zupay: Sombras de la Independencia', studio: 'Abstract Tales', steam: 4074370, cover: 'zupay.jpg', featured: true },
        { cat: { es: 'Premio Press Over', en: 'Press Over Award' }, game: 'Teios Journey', studio: 'Serendipia Games', steam: 3506070, cover: 'teios.jpg', featured: true },
        { cat: { es: 'Mejor Game Design', en: 'Best Game Design' }, game: 'Treetopians', studio: 'Aparato Games', steam: 3967310, cover: 'treetopians.jpg' },
        { cat: { es: 'Mejor Gameplay', en: 'Best Gameplay' }, game: 'Xplorite', studio: 'Indie Two Games', steam: 2720230, cover: 'xplorite.jpg' },
        { cat: { es: 'Mejor Narrativa', en: 'Best Narrative' }, game: 'La Hija del Delta', studio: 'Bicho Raro', steam: 3301850, cover: 'hija-delta.jpg' },
        { cat: { es: 'Mejor Dirección de Arte', en: 'Best Art Direction' }, game: 'Teios Journey', studio: 'Serendipia Games', steam: 3506070, cover: 'teios.jpg' },
        { cat: { es: 'Mejor Diseño de Audio', en: 'Best Audio Design' }, game: 'Phantom Gear', studio: 'Bits Rule', steam: 1802240, cover: 'phantom-gear.jpg' },
        { cat: { es: 'Mejor Idea Original', en: 'Best Original Idea' }, game: 'The Outer Frame', studio: 'Sapucai Games', steam: 4079320, cover: 'outer-frame.jpg' },
        { cat: { es: 'Mejor Experiencia Multijugador', en: 'Best Multiplayer Experience' }, game: 'AstroBrawl', studio: 'Papa Corps', steam: 3175020, cover: 'astrobrawl.jpg' }
      ],
      sponsors: {
        presenta: ['pressover', 'ocppc'],
        apoyo: [['storyteller', 'ccc', 'pm'], ['francia', 'maimonides', 'oxobox', 'amd', 'osai', 'comu']], // CCC, Storyteller y Provincia Microcréditos aportaron más: van más grandes
        acompanan: ['adva', 'fundav', 'playbold', 'gameever']
      },
      communities: ['wigar', 'acciondev', 'construct', 'godot', 'redcom', 'audiovj'],
      placeholder: { stats: true, photos: false, video: false, awards: false }
    },
    {
      year: 2025,
      ord: { es: 'Segunda edición', en: 'Second edition' },
      tag: { es: 'Expansión', en: 'Expansion' },
      date: { es: '19 y 20 de julio', en: 'July 19 & 20' },
      hours: 'Sáb 11 – 19 h · Dom 11 – 18 h',
      venue: 'casapba',
      summary: {
        es: 'IDA creció a dos días en la Casa de la Provincia de Buenos Aires, sumó speakers internacionales y entregó por primera vez los Premios IDA.',
        en: 'IDA grew to two days at Casa de la Provincia de Buenos Aires, added international speakers and handed out the first IDA Awards.'
      },
      stats: { attendees: 2000, games: 21, talks: 12, speakers: 16 },
      statsNote: { es: '2 speakers internacionales', en: '2 international speakers' },
      // Fuente: newsletter de Press Over (11/7/2025). Cerraron los dos días de charlas.
      guests: [
        { name: 'Arturo Monedero', flag: 'es', img: 'guest-arturo', from: { es: 'España', en: 'Spain' }, role: { es: 'CEO de TLR Games y vicepresidente de AEVI', en: 'CEO of TLR Games and vice president of AEVI' }, talk: 'Cómo vender tu primer videojuego' },
        { name: 'David Lucio', flag: 'co', img: 'guest-david', from: { es: 'Colombia', en: 'Colombia' }, role: { es: 'Fundador y productor del Latin American Games Showcase', en: 'Founder and producer of the Latin American Games Showcase' }, talk: 'Cómo difundir mi videojuego y hacer networking' }
      ],
      highlights: [
        { es: 'Primera edición de dos días', en: 'First two-day edition' },
        { es: 'Primeros speakers internacionales', en: 'First international speakers' },
        { es: 'Primera entrega de los Premios IDA: 12 premios; Go Slimey Go!, Mejor Videojuego', en: 'First IDA Awards: 12 awards; Go Slimey Go!, Best Game' }
      ],
      video: '4j2kHT8cM8M',
      archiveVideo: false, // el aftermovie se ve en la home, no en la página de ediciones
      photos: ['g25-01', 'g25-02', 'g25-03', 'g25-04', 'g25-05', 'g25-06', 'g25-07', 'g25-08', 'g25-09', 'g25-10', 'g25-11', 'award-25'],
      // Showcase con portada: los ganadores salen de `awards` (mismo nombre) y se muestran primero, con su etiqueta
      games: [
        { game: 'The Last Librarian', steam: 2602080, cover: 'last-librarian.jpg' },
        { game: 'Rising Fox', steam: 3832050, cover: 'rising-fox.jpg' },
        { game: 'Escape of the Hammer Princess', steam: 3136530, cover: 'hammer-princess.jpg' },
        { game: 'Go Slimey Go!', steam: 3215230, cover: 'go-slimey.jpg' },
        { game: 'Dead Sale', steam: 3267050, cover: 'dead-sale.jpg' },
        { game: 'Letalis', steam: 2396200, cover: 'letalis.jpg' },
        { game: 'C.A.B.A. (ex Fábulas Porteñas)', steam: 3279900, cover: 'fabulas.jpg' },
        { game: 'Piso 6', steam: 3919710, cover: 'piso6.jpg' },
        { game: 'Zupay', steam: 4074370, cover: 'zupay.jpg' },
        { game: 'Kernel Hearts', steam: 2902170, cover: 'kernel-hearts.jpg' },
        { game: 'El 39', steam: 3900380, cover: 'el-39.jpg' },
        { game: 'Shippin', steam: 3334100, cover: 'shippin.jpg' },
        { game: 'Malvinas: La última carta', steam: 2584740, cover: 'malvinas.jpg' },
        { game: 'Pungo', steam: 3603010, cover: 'pungo.jpg' },
        { game: 'Ruless', cover: 'ruless.jpg' }, // sin página pública todavía
        { game: 'The Lost Land of Bahía Blanca', steam: 4144100, cover: 'bahia-blanca.jpg' },
        { game: 'Cazadora', url: 'https://pulgaescapista.itch.io/cazadora', cover: 'cazadora.jpg' },
        { game: 'Not So Smart Delivery', steam: 3512970, cover: 'not-so-smart.jpg' },
        { game: 'House of Horror: Outside Is Better', steam: 3152710, cover: 'house-of-horror.jpg' },
        { game: 'Quantum Echoes', steam: 4095460, cover: 'quantum-echoes.jpg' },
        { game: 'The Path into the Abyss', steam: 3000460, cover: 'path-abyss.jpg' }
      ],
      awards: [
        // Fuente: pressover.news, "Videojuegos ganadores de Indie Dev Argentina 2025" (12 premios, 8 juegos)
        { cat: { es: 'Mejor Videojuego', en: 'Best Game' }, game: 'Go Slimey Go!', studio: 'Tembac, Chabbie, Joacoyco y Toni Leys', steam: 3215230, cover: 'go-slimey.jpg', featured: true, top: true },
        { cat: { es: 'Identidad Argentina', en: 'Argentine Identity' }, game: 'Malvinas: La última carta', studio: 'El Burro Studio', steam: 2584740, cover: 'malvinas.jpg', featured: true },
        { cat: { es: 'Premio Press Over', en: 'Press Over Award' }, game: 'Go Slimey Go!', studio: 'Tembac, Chabbie, Joacoyco y Toni Leys', steam: 3215230, cover: 'go-slimey.jpg', featured: true },
        { cat: { es: 'Mejor Game Design', en: 'Best Game Design' }, game: 'Go Slimey Go!', studio: 'Tembac, Chabbie, Joacoyco y Toni Leys', steam: 3215230, cover: 'go-slimey.jpg' },
        { cat: { es: 'Mejor Gameplay', en: 'Best Gameplay' }, game: 'Kernel Hearts', studio: 'Ephemera Games', steam: 2902170, cover: 'kernel-hearts.jpg' },
        { cat: { es: 'Mejor Narrativa', en: 'Best Narrative' }, game: 'C.A.B.A. (ex Fábulas Porteñas)', studio: 'Hypnos Team', steam: 3279900, cover: 'fabulas.jpg' },
        { cat: { es: 'Mejor Dirección de Arte', en: 'Best Art Direction' }, game: 'Quantum Echoes', studio: 'Comfy Games', steam: 4095460, cover: 'quantum-echoes.jpg' },
        { cat: { es: 'Mejor Diseño de Audio', en: 'Best Audio Design' }, game: 'Go Slimey Go!', studio: 'Tembac, Chabbie, Joacoyco y Toni Leys', steam: 3215230, cover: 'go-slimey.jpg' },
        { cat: { es: 'Mejor Idea Original', en: 'Best Original Idea' }, game: 'Malvinas: La última carta', studio: 'El Burro Studio', steam: 2584740, cover: 'malvinas.jpg' },
        { cat: { es: 'Mejor Videojuego de Terror', en: 'Best Horror Game' }, game: 'Piso 6', studio: 'NostalgyStudios', steam: 3919710, cover: 'piso6.jpg' },
        { cat: { es: 'Mejor Pixel Art', en: 'Best Pixel Art' }, game: 'Letalis', studio: 'Monkiato', steam: 2396200, cover: 'letalis.jpg' },
        { cat: { es: 'Mejor Diseño UX/UI', en: 'Best UX/UI Design' }, game: 'The Last Librarian', studio: 'Leandro Davel, Franco Castellacci y Juliana Zaccone', steam: 2602080, cover: 'last-librarian.jpg' }
      ],
      sponsors: {
        presenta: ['pressover', 'foton', 'ocppc'], // coproducción (nota de Press Over sobre los ganadores 2025)
        apoyo: ['casapba', 'ccc', 'ubasociales', 'pm', 'osai', 'comu'],
        acompanan: ['adva', 'fundav', 'playbold', 'gameever']
      },
      communities: ['wigar', 'acciondev', 'construct', 'godot', 'redcom', 'audiovj'],
      placeholder: { stats: false, photos: false, video: false, awards: false }
    },
    {
      year: 2024,
      ord: { es: 'Primera edición', en: 'First edition' },
      tag: { es: 'El comienzo', en: 'The beginning' },
      date: { es: 'Sábado 27 de julio', en: 'Saturday, July 27' },
      hours: '11 – 21 h',
      venue: 'ccc',
      summary: {
        es: 'La primera edición se realizó en dos pisos y cuatro salas del Centro Cultural de la Cooperación, coproducida por Press Over y la Diplomatura de Videojuegos de UBA Sociales, como un primer acercamiento al desarrollo de videojuegos independiente en Argentina.',
        en: 'The first edition took place on two floors and in four rooms of the Centro Cultural de la Cooperación, co-produced by Press Over and the UBA Sociales Videogame Diploma, as a first approach to independent game development in Argentina.'
      },
      stats: { attendees: 1500, games: 12, talks: 20, speakers: 32 },
      statsNote: null,
      highlights: [
        { es: 'Nace IDA, creado por Press Over', en: 'IDA is born, created by Press Over' },
        { es: 'Dos pisos y cuatro salas del CCC', en: 'Two floors and four rooms at the CCC' },
        { es: 'Primer showcase de videojuegos en desarrollo: 10 elegidos por el jurado entre más de 40 obras, y 2 por Press Over', en: 'First showcase of games in development: 10 picked by the jury from over 40 entries, plus 2 by Press Over' },
        { es: 'Jurado con Daniel Benmergui (Storyteller) y Mauricio García (The Game Kitchen, Blasphemous)', en: 'Jury including Daniel Benmergui (Storyteller) and Mauricio García (The Game Kitchen, Blasphemous)' }
      ],
      video: null,
      photos: ['g24-03', 'g24-04', 'g24-05', 'g24-01', 'g24-07', 'g24-06', 'g24-09', 'g24-02', 'g24-08', 'g24-11', 'g24-10', 'g24-12'],
      games: [
        { game: 'Power Solenoid', steam: 2323340, cover: 'power-solenoid.jpg' },
        { game: 'Cards of Prophecy', steam: 3256450, cover: 'cards-prophecy.jpg' },
        { game: 'Era en un bosque', url: 'https://delleloper.itch.io/era-en-un-bosque-it-was-in-a-forest', cover: 'era-bosque.jpg' },
        { game: 'Quantum Echoes', steam: 4095460, cover: 'quantum-echoes.jpg' },
        { game: 'Blink and Die Replay', steam: 2958830, cover: 'blink-die.jpg' },
        { game: 'Dreieck', steam: 2354050, cover: 'dreieck.jpg' },
        { game: 'Dungeon Concierge', steam: 4186490, cover: 'dungeon-concierge.jpg' },
        { game: 'Oneiro Man', steam: 3146700, cover: 'oneiro-man.jpg' },
        { game: 'La Salamanca', steam: 3025180, cover: 'la-salamanca.jpg' },
        { game: 'Por el Campo', url: 'https://tucuman-videojuegos.itch.io/por-el-campo', cover: 'por-el-campo.jpg' },
        { game: 'The Path into the Abyss', steam: 3000460, cover: 'path-abyss.jpg' },
        { game: 'Malvinas: La última carta', steam: 2584740, cover: 'malvinas.jpg' }
      ],
      awards: [],
      sponsors: {
        presenta: ['pressover', 'ocppc'],
        apoyo: ['ccc', 'ubasociales', 'comu', 'osai'],
        acompanan: ['adva', 'fundav', 'playbold', 'gameever']
      },
      communities: [],
      placeholder: { stats: false, photos: false, video: false, awards: false }
    }
  ]
};
