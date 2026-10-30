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
  `featured: true` marca los premios que se muestran en la home (si no hay ninguno, van los primeros).
  Sponsors: cada grupo es una lista de ids, o una lista de niveles ([[grandes], [resto]]) cuando
  algunos aportaron más: el primer nivel se muestra más grande y cada nivel, con logos del mismo tamaño.
  `placeholder: true` muestra la etiqueta PLACEHOLDER en la web: sacarla cuando el dato sea real.
*/
window.IDA_DATA = {

  // Próxima edición. Con `date` en null la home muestra "Fecha a confirmar" en vez del countdown.
  next: {
    year: 2027,
    ord: { es: 'Cuarta edición', en: 'Fourth edition' },
    date: null, // ej.: '2027-08-07T11:00:00-03:00'
    dateLabel: { es: 'Fecha a confirmar', en: 'Date to be announced' },
    hours: null,
    venue: null, // ej.: 'ccc' (clave de `venues`)
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
  orgs: {
    pressover:   { name: 'Press Over', logo: 'pressover.png', url: 'https://pressover.news/' },
    ocppc:       { name: 'Observatorio de Culturas Políticas y Políticas Culturales', logo: 'ocppc.png', url: 'https://www.centrocultural.coop/OCPPC' },
    ccc:         { name: 'Centro Cultural de la Cooperación', logo: 'ccc.png', url: 'https://www.centrocultural.coop/' },
    storyteller: { name: 'Storyteller', logo: 'storyteller.png', url: 'https://store.steampowered.com/app/1624540/Storyteller/?l=latam' },
    francia:     { name: 'Embajada de Francia · Institut Français', logo: 'francia.png', url: 'https://ar.diplomatie.gouv.fr/fr' },
    maimonides:  { name: 'Universidad Maimónides', logo: 'maimonides.png', url: 'https://www.maimonides.edu/' },
    oxobox:      { name: 'Oxobox', logo: 'oxobox.png', url: 'https://oxoawards.com/' },
    pm:          { name: 'Provincia Microcréditos', logo: 'pm-white.png', url: 'https://www.provinciamicrocreditos.com.ar/' },
    osai:        { name: 'Fundación OSAI', logo: 'osai.png', url: 'https://www.osai.org.ar/' },
    comu:        { name: 'COMU · Ciencias de la Comunicación UBA', logo: 'comu-mono.png', url: 'https://comunicacion.sociales.uba.ar/', mono: true },
    casapba:     { name: 'Casa de la Provincia de Buenos Aires', logo: 'casa-pba.png', url: null, tile: true },
    ubasociales: { name: 'Facultad de Ciencias Sociales UBA', logo: 'uba-sociales.png', url: 'https://www.sociales.uba.ar/', mono: true },
    adva:        { name: 'ADVA', logo: 'adva.png', url: null },
    fundav:      { name: 'FUNDAV · Fundación Argentina de Videojuegos', logo: 'fundav.png', url: null },
    playbold:    { name: 'Play Bold', logo: 'playbold.png', url: null },
    gameever:    { name: 'Game Ever', logo: 'gameever.png', url: null },
    foton:       { name: 'Foton Games', logo: 'foton.png', url: null },
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
      tag: { es: 'Todo el CCC', en: 'The whole building' },
      date: { es: 'Sábado 1 de agosto', en: 'Saturday, August 1' },
      hours: '11 – 20 h',
      venue: 'ccc',
      summary: {
        es: 'La tercera edición ocupó todo el edificio del Centro Cultural de la Cooperación: showcase de juegos, charlas en simultáneo, networking y la segunda entrega de los Premios IDA, con diez categorías.',
        en: 'The third edition took over the whole Centro Cultural de la Cooperación building: game showcase, parallel talks, networking and the second IDA Awards, with ten categories.'
      },
      // Juegos y charlas: nota de Press Over (3/8/2026). Asistentes y speakers, provisorios.
      stats: { attendees: 2500, games: 25, talks: 22, speakers: 24 },
      statsNote: { es: '20 charlas nacionales y 2 internacionales', en: '20 national talks and 2 international' },
      highlights: [
        { es: 'Primera edición en los tres pisos del CCC', en: 'First edition across all three floors of the CCC' },
        { es: 'Charlas internacionales de Yoan Fanise (Valiant Hearts, Road 96) y Josué Monchan', en: 'International talks by Yoan Fanise (Valiant Hearts, Road 96) and Josué Monchan' },
        { es: 'Premios IDA en diez categorías; The Outer Frame, Mejor Videojuego', en: 'IDA Awards in ten categories; The Outer Frame, Best Game' },
        { es: 'Los ganadores tienen lugar asegurado en el showcase de EVA 2026, gracias a ADVA', en: 'Winners get a guaranteed spot in the EVA 2026 showcase, thanks to ADVA' }
      ],
      video: null, // id de YouTube del aftermovie
      photos: ['g26-01', 'g26-02', 'g26-03', 'g26-04', 'g26-05', 'g26-06', 'g26-07', 'g26-08', 'g26-09', 'g26-10', 'g26-11', 'g26-12', 'g26-13', 'g26-14'],
      // Fuente: pressover.news, "Videojuegos ganadores de Indie Dev Argentina 2026"
      awards: [
        { cat: { es: 'Mejor Videojuego · Premio AMD', en: 'Best Game · AMD Award' }, game: 'The Outer Frame', studio: 'Sapucai Games', cover: 'outer-frame.jpg', featured: true },
        { cat: { es: 'Mejor Apartado Visual', en: 'Best Visuals' }, game: 'Teios Journey', studio: 'Serendipia Games', cover: 'teios.jpg' },
        { cat: { es: 'Mejor Gameplay', en: 'Best Gameplay' }, game: 'Xplorite', studio: 'Indie Two Games', cover: 'xplorite.jpg' },
        { cat: { es: 'Mejor Multijugador o Cooperativo', en: 'Best Multiplayer or Co-op' }, game: 'AstroBrawl', studio: 'Papa Corps', cover: 'astrobrawl.jpg' },
        { cat: { es: 'Mejor Idea Original', en: 'Best Original Idea' }, game: 'The Outer Frame', studio: 'Sapucai Games', cover: 'outer-frame.jpg' },
        { cat: { es: 'Premio Press Over', en: 'Press Over Award' }, game: 'Teios Journey', studio: 'Serendipia Games', cover: 'teios.jpg', featured: true },
        { cat: { es: 'Mejor Game Design', en: 'Best Game Design' }, game: 'Treetopians', studio: 'Aparato Games', cover: 'treetopians.jpg' },
        { cat: { es: 'Mejor Narrativa', en: 'Best Narrative' }, game: 'La Hija del Delta', studio: 'Bicho Raro', cover: 'hija-delta.jpg' },
        { cat: { es: 'Excelencia en Audio', en: 'Excellence in Audio' }, game: 'Phantom Gear', studio: 'Bits Rule', cover: 'phantom-gear.jpg' },
        { cat: { es: 'Representación Argentina', en: 'Argentine Representation' }, game: 'Zupay: Sombras de la Independencia', studio: 'Abstract Tales', cover: 'zupay.jpg', featured: true }
      ],
      sponsors: {
        presenta: ['pressover', 'ocppc'],
        apoyo: [['ccc', 'storyteller'], ['francia', 'maimonides', 'oxobox', 'pm', 'osai', 'comu']], // CCC y Storyteller aportaron más: van más grandes
        acompanan: ['adva', 'fundav', 'playbold', 'gameever']
      },
      communities: ['wigar', 'acciondev', 'construct', 'godot', 'redcom', 'audiovj'],
      placeholder: { stats: true, photos: false, video: true, awards: false }
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
      highlights: [
        { es: 'Primera edición de dos días', en: 'First two-day edition' },
        { es: 'Primeros speakers internacionales', en: 'First international speakers' },
        { es: 'Primera entrega de los Premios IDA', en: 'First IDA Awards' }
      ],
      video: '4j2kHT8cM8M',
      photos: ['g25-01', 'g25-02', 'g25-03', 'g25-04', 'g25-05', 'g25-06', 'g25-07', 'g25-08', 'g25-09', 'g25-10', 'g25-11', 'award-25'],
      games: ['The Last Librarian', 'Rising Fox', 'Hammer Princess', 'Go Slimey Go!', 'Dead Sale', 'Letalis', 'Fábulas Porteñas', 'Piso 6', 'Zupay', 'Kernel Hearts', 'El 39', 'Shippin', 'Malvinas: La última carta', 'Pungo', 'Ruless', 'The Lost Land of Bahía Blanca', 'Cazadora', 'Not So Smart Delivery', 'House of Horror: Outside Is Better', 'Quantum Echoes', 'The Path into the Abyss'],
      awards: [
        { cat: { es: 'Mejor apartado visual', en: 'Best Visuals' }, game: 'Nombre del juego', studio: 'Estudio', img: null },
        { cat: { es: 'Mejor juego', en: 'Best Game' }, game: 'Nombre del juego', studio: 'Estudio', img: null },
        { cat: { es: 'Mejor diseño de juego', en: 'Best Game Design' }, game: 'Nombre del juego', studio: 'Estudio', img: null },
        { cat: { es: 'Premio del público', en: 'Audience Award' }, game: 'Nombre del juego', studio: 'Estudio', img: null }
      ],
      sponsors: {
        presenta: ['pressover'],
        apoyo: ['casapba', 'ubasociales', 'comu', 'pm', 'ocppc', 'ccc', 'osai'],
        acompanan: ['playbold', 'gameever', 'fundav', 'adva']
      },
      communities: ['wigar', 'acciondev', 'construct', 'godot', 'redcom', 'audiovj'],
      placeholder: { stats: false, photos: false, video: false, awards: true }
    },
    {
      year: 2024,
      ord: { es: 'Primera edición', en: 'First edition' },
      tag: { es: 'El comienzo', en: 'The beginning' },
      date: { es: 'Sábado 27 de julio', en: 'Saturday, July 27' },
      hours: '11 – 21 h',
      venue: 'ccc',
      summary: {
        es: 'La primera IDA nació en el Centro Cultural de la Cooperación, coproducida por Press Over y la Diplomatura de Videojuegos de UBA Sociales, como un primer acercamiento al desarrollo de videojuegos independiente en Argentina.',
        en: 'The first IDA was born at Centro Cultural de la Cooperación, co-produced by Press Over and the UBA Sociales Videogame Diploma, as a first approach to independent game development in Argentina.'
      },
      stats: { attendees: 1500, games: 12, talks: 20, speakers: 32 },
      statsNote: null,
      highlights: [
        { es: 'Nace IDA, creado por Press Over', en: 'IDA is born, created by Press Over' },
        { es: 'Primer showcase de juegos en desarrollo: 10 elegidos por el jurado entre más de 40 obras, y 2 por Press Over', en: 'First showcase of games in development: 10 picked by the jury from over 40 entries, plus 2 by Press Over' },
        { es: 'Jurado con Daniel Benmergui (Storyteller) y Mauricio García (The Game Kitchen, Blasphemous)', en: 'Jury including Daniel Benmergui (Storyteller) and Mauricio García (The Game Kitchen, Blasphemous)' }
      ],
      video: null,
      photos: ['g24-01', 'g24-02'],
      games: ['Power Solenoid', 'Cards of Prophecy', 'Era en un bosque', 'Quantum Echoes', 'Blink and Die Replay', 'Dreieck', 'Dungeon Concierge', 'Oneiro Man', 'La Salamanca', 'Por el Campo', 'The Path into the Abyss', 'Malvinas: La última carta'],
      awards: [],
      sponsors: {
        presenta: ['pressover'],
        apoyo: ['ocppc', 'ccc', 'ubasociales', 'comu', 'osai', 'adva', 'fundav'],
        acompanan: []
      },
      communities: [],
      placeholder: { stats: false, photos: true, video: false, awards: false }
    }
  ]
};
