import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const projects = [
  {
    slug: 'predetect', name: 'PreDetect IA', description: 'Inteligencia artificial para ayudar a detectar el cáncer de mama.',
    status: 'En desarrollo', category: 'Inteligencia artificial · Salud', team: 'INNOVADUCATE', teamUrl: 'https://www.innovaducate.space/', role: 'Asesoramiento técnico médico',
    intro: 'Un proyecto de inteligencia artificial orientado a apoyar la evaluación inicial de casos de cáncer de mama.',
    sections: [
      ['El proyecto', 'PreDetect explora el uso de inteligencia artificial en el triage de cáncer de mama: la evaluación inicial que ayuda a ordenar los casos según la atención que necesitan.'],
      ['Mi participación', 'Colaboro con INNOVADUCATE desde el asesoramiento técnico médico, aportando la perspectiva de salud al desarrollo de la herramienta.'],
      ['En qué etapa está', 'El proyecto está en desarrollo. Podés conocer más en el sitio de PreDetect.']
    ],
    link: ['Visitar PreDetect', 'https://predetec.innovaducate.com/']
  },
  {
    slug: 'luna', name: 'LUNA', description: 'Una herramienta de IA para detectar neumonías en la guardia.',
    status: 'Próximamente', category: 'Inteligencia artificial · Salud', team: 'INNOVADUCATE', teamUrl: 'https://www.innovaducate.space/', role: 'Asesoramiento técnico médico',
    intro: 'Inteligencia artificial aplicada al diagnóstico de neumonías en un contexto de atención de urgencias.',
    sections: [
      ['El proyecto', 'LUNA es una herramienta en desarrollo orientada a apoyar el diagnóstico de neumonías en la guardia, mediante inteligencia artificial aplicada a imágenes.'],
      ['Mi participación', 'Participo en el equipo de INNOVADUCATE con asesoramiento técnico médico, conectando el desarrollo de la herramienta con el contexto de atención en salud.'],
      ['En qué etapa está', 'LUNA está en desarrollo. Su sitio web, luna.innovaducate.com, todavía está en preparación y estará disponible próximamente.']
    ]
  },
  {
    slug: 'nomade', name: 'Nomade', description: 'La productora de eventos más grande del sur mendocino.',
    category: 'Eventos · Organización', team: 'Nomade', role: 'Organización de eventos',
    intro: 'Un proyecto de organización de eventos en el sur de Mendoza.',
    sections: [
      ['El proyecto', 'Nomade nace del trabajo de organizar encuentros en el sur mendocino. Un proyecto que llevó las ideas a eventos y reunió a miles de personas.'],
      ['En números', 'Más de 5 eventos organizados y más de 15.000 entradas vendidas en total.'],
      ['Mi participación', 'Formo parte de la organización de los eventos. Una experiencia de trabajo en equipo que convive con mi recorrido en medicina y tecnología.']
    ],
    link: ['Ver Nomade en Instagram', 'https://www.instagram.com/reel/DRqHNtQET2B/']
  },
  {
    slug: 'alojamientos', name: 'Gestión de alojamientos', description: 'Alquiler y gestión de alojamientos temporarios.',
    category: 'Hospitalidad · Emprendimiento', team: 'Airbnb y Booking', teamLabel: 'Plataformas', role: 'Gestión integral de alojamientos',
    intro: 'Dos años de experiencia gestionando propiedades y alojamientos turísticos.',
    sections: [
      ['El proyecto', 'Gestión de propiedades de terceros y alquileres propios a través de Airbnb y Booking. Un proyecto que abarcó desde el equipamiento y la preparación integral de departamentos hasta su gestión como alojamientos.'],
      ['Mi participación', 'Invertí mi primer dinero en este proyecto y me ocupé de todo: amoblar y preparar los departamentos, ponerlos en alquiler y gestionar las estadías. Lo llevé adelante trabajando codo a codo con mi amigo y socio.'],
      ['Un reconocimiento', 'Durante el proyecto obtuve el reconocimiento como Superanfitrión en Airbnb.']
    ]
  },
  {
    slug: 'barrio-de-las-flores', name: 'El Barrio de las Flores', description: 'Mi banda adolescente.',
    category: 'Música · Producción audiovisual', team: 'El Barrio de las Flores', role: 'Bajo, guitarra y teclados',
    intro: 'Una banda de funk-rock que formamos cuando tenía 17 años.',
    sections: [
      ['El proyecto', 'El Barrio de las Flores es una parte de mi recorrido que pasa por la música: tocar, crear y compartir con otros.'],
      ['Mi participación', 'Bajo, guitarra y teclados. Con la banda grabamos Era, un single acompañado por una producción audiovisual.'],
      ['Escuchá Era', 'La canción y su video están disponibles en YouTube.']
    ],
    link: ['Escuchar Era en YouTube', 'https://www.youtube.com/watch?v=uCWyz2SU9NQ']
  }
];

const icons = {
  moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.9 13.1A9 9 0 0 1 10.9 3.1 9 9 0 1 0 20.9 13.1Z"/></svg>',
  sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7.5 10v7m0-10v.1M11 17v-7m0 3a3 3 0 0 1 6 0v4"/></svg>',
  copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>'
};
const escape = text => text.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
function layout({ title, description, body, prefix = '', about = false }) {
  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escape(title)}</title>
  <meta name="description" content="${escape(description)}">
  <meta name="color-scheme" content="light dark">
  <meta name="theme-color" content="#ffffff">
  <meta property="og:title" content="${escape(title)}">
  <meta property="og:description" content="${escape(description)}">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="summary">
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='22' fill='%2320252b'/%3E%3Ctext x='50' y='69' font-family='Arial,sans-serif' font-size='52' font-weight='700' fill='white' text-anchor='middle'%3EB%3C/text%3E%3C/svg%3E">
  <script>try{const t=localStorage.getItem('bdp-theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t;}catch(e){}</script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;550;600;650;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="${prefix}assets/minimal.css">
  <script src="${prefix}assets/minimal.js" defer></script>
</head>
<body>
  <a class="skip-link" href="#main">Saltar al contenido</a>
  <div class="wrap">
    <header class="site-header">
      <a class="name" href="${prefix}index.html">Benjamin De Paolo</a>
      <nav aria-label="Navegación principal">
        <a href="${prefix}sobre-mi.html"${about ? ' aria-current="page"' : ''}>Sobre mí</a>
        <a class="social-icon" href="https://www.linkedin.com/in/bdepaolo" target="_blank" rel="noopener noreferrer" aria-label="Benjamin en LinkedIn (abre otra pestaña)">${icons.linkedin}</a>
        <button class="icon-button" id="theme-toggle" type="button" aria-label="Cambiar tema"><span id="icon-moon">${icons.moon}</span><span id="icon-sun" hidden>${icons.sun}</span></button>
      </nav>
    </header>
    <main id="main">${body}</main>
    <footer class="site-footer" id="contacto">
      <ul class="contact-list" aria-label="Contacto y redes">
        <li>LinkedIn <a href="https://www.linkedin.com/in/bdepaolo" target="_blank" rel="noopener noreferrer">Benjamin De Paolo</a></li>
        <li>TikTok <a href="https://www.tiktok.com/@benjamin.de.paolo" target="_blank" rel="noopener noreferrer">@benjamin.de.paolo</a></li>
        <li>Email <a href="mailto:benjamindepaolo8@gmail.com">benjamindepaolo8@gmail.com</a><button class="icon-button copy-email" id="copy-email" type="button" aria-label="Copiar email" title="Copiar email">${icons.copy}</button></li>
      </ul>
      <p class="footer-note"><span>Desde Mendoza, Argentina.</span><a href="${prefix}index.html">Vibecodeada.</a></p>
    </footer>
  </div>
  <div class="toast" id="toast" role="status" aria-live="polite"></div>
</body>
</html>
`;
}

const home = `
      <section class="intro" aria-label="Presentación">
        <div class="intro-copy">
          <h1>Estudio Medicina y trabajo en proyectos que conectan <strong>salud, tecnología y personas.</strong></h1>
          <p><a href="https://www.uncuyo.edu.ar/" target="_blank" rel="noopener noreferrer">UNCUYO</a>-<a href="https://www.innovaducate.space/" target="_blank" rel="noopener noreferrer">INNOVADUCATE</a></p>
          <a class="intro-link" href="sobre-mi.html">Un poco más sobre mí <span aria-hidden="true">↗</span></a>
        </div>
        <img class="avatar" src="images/me.jpg" alt="Benjamin De Paolo" width="150" height="150" fetchpriority="high">
      </section>
      <section class="projects" id="proyectos" aria-labelledby="projects-title">
        <h2 id="projects-title">Proyectos</h2>
        <ul class="project-list">
          ${projects.map(p => `<li id="${p.slug}"><a class="project-link" href="proyectos/${p.slug}.html"><span class="project-title">${p.name}</span><span class="project-arrow" aria-hidden="true">↗</span><span class="project-description">${p.description}</span></a></li>`).join('\n          ')}
        </ul>
      </section>
`;
await mkdir(new URL('proyectos/', root), { recursive: true });
await writeFile(new URL('index.html', root), layout({title:'Benjamin De Paolo',description:'Medicina, tecnología y personas. Conocé mis proyectos de inteligencia artificial aplicada a la salud, emprendimientos y música.',body:home}));
for (const [i, p] of projects.entries()) {
  const next = projects[(i + 1) % projects.length];
  const body = `
      <article class="page-content">
        <a class="back-link" href="../index.html#proyectos">← Todos los proyectos</a>
        <h1>${p.name}</h1>
        <p class="lead">${p.intro}</p>
        ${p.status ? `<span class="badge">${p.status}</span>` : ''}
        <dl class="project-facts">
          <div><dt>Área</dt><dd>${p.category}</dd></div>
          <div><dt>${p.teamLabel || 'Equipo'}</dt><dd>${p.teamUrl ? `<a href="${p.teamUrl}" target="_blank" rel="noopener noreferrer">${p.team}</a>` : p.team}</dd></div>
          <div><dt>Mi aporte</dt><dd>${p.role}</dd></div>
        </dl>
        ${p.sections.map(([heading, text]) => `<section class="content-section"><h2>${heading}</h2><p>${text}</p></section>`).join('\n        ')}
        <div class="project-actions">${p.link ? `<a href="${p.link[1]}" target="_blank" rel="noopener noreferrer">${p.link[0]} <span aria-hidden="true">↗</span></a>` : `<a href="mailto:benjamindepaolo8@gmail.com?subject=${encodeURIComponent(`Conversemos sobre ${p.name}`)}">Conversemos sobre el proyecto <span aria-hidden="true">↗</span></a>`}</div>
        <nav class="project-next" aria-label="Más proyectos"><span>Siguiente proyecto</span><a href="${next.slug}.html">${next.name} <span aria-hidden="true">→</span></a></nav>
      </article>
  `;
  await writeFile(new URL(`proyectos/${p.slug}.html`, root), layout({title:`${p.name} — Benjamin De Paolo`,description:p.description,body,prefix:'../'}));
}

const entries = [
  ['Consultor técnico en Inteligencia Artificial','<a href="https://www.innovaducate.space/" target="_blank" rel="noopener noreferrer">INNOVADUCATE</a> · Dic 2024 – presente','Diseño, análisis y comunicación de soluciones de inteligencia artificial para educación y salud.'],
  ['Ayudante de Cátedra, Fisiopatología','Universidad Nacional de Cuyo · Jul 2026 – presente','Tutor a cargo de sala en la Facultad de Ciencias Médicas. Acompaño el aprendizaje a través de casos, razonamiento clínico y trabajo en equipo.'],
  ['Pasante de investigación, IHEM','CONICET / Universidad Nacional de Cuyo · Abr 2024 – jul 2025','Introducción a la investigación biomédica: lectura científica, procedimientos de laboratorio, registro de datos y protocolos de bioseguridad.'],
  ['Profesor de Química','Campus Barcala · Jul 2024 – mar 2025','Planificación de clases, resolución de problemas y seguimiento del progreso de los estudiantes.', ['Una clase de Química en Instagram', 'https://www.instagram.com/p/CzCmayfCUWh/']],
  ['Tutor de Física','Campus Barcala · Abr 2023 – jul 2024','Acompañamiento presencial y virtual, resolución guiada de ejercicios y preparación de evaluaciones.']
];
const shelves = [
  ['Libros', '', [['el-hombre-mediocre.webp','El hombre mediocre'],['recuerdos-de-un-medico-rural.webp','Recuerdos de un médico rural'],['el-inversor-inteligente.webp','El inversor inteligente']]],
  ['Discos', ' albums', [['la-grasa-de-las-capitales.webp','La grasa de las capitales'],['dark-side-of-the-moon.webp','The Dark Side of the Moon'],['after-chabon.avif','After Chabón']]],
  ['Películas', '', [['el-padrino.webp','El Padrino'],['into-the-wild.webp','Into the Wild'],['rocky.webp','Rocky']]]
];
const about = `
      <article class="page-content">
        <a class="back-link" href="index.html">← Volver al inicio</a>
        <h1>Un poco más sobre mí</h1>
        <p class="lead">Medicina, tecnología y ganas de entender cómo funcionan las cosas.</p>
        <p>Soy Benjamin. Nací en General Alvear, Mendoza, y a los 18 me mudé a la ciudad para estudiar Medicina en la Universidad Nacional de Cuyo.</p>
        <p>Me interesan los problemas difíciles, aprender y salir de mi zona de confort. Hoy reparto mi tiempo entre la facultad, la docencia y proyectos de inteligencia artificial aplicada a la salud.</p>
        <section class="content-section" id="experiencia">
          <h2>En lo que vengo trabajando</h2>
          ${entries.map(([title,meta,description,link])=>`<div class="entry"><h3>${title}</h3><p class="meta">${meta}</p><p class="description">${description}</p>${link ? `<p class="description"><a href="${link[1]}" target="_blank" rel="noopener noreferrer">${link[0]} <span aria-hidden="true">↗</span></a></p>` : ''}</div>`).join('\n          ')}
          <a href="index.html#proyectos">Conocé mis proyectos <span aria-hidden="true">↗</span></a>
        </section>
        <section class="content-section" id="educacion">
          <h2>Formación</h2>
          <div class="entry"><h3>Medicina</h3><p class="meta">Universidad Nacional de Cuyo · 2023 – actualidad</p></div>
          <div class="entry"><h3>Tecnicatura en Producción Agropecuaria</h3><p class="meta">Escuela de Agricultura · UNCUYO · 2016 – 2021</p><p class="description">Olimpiadas Nacionales de Química y organización de las 55 Olimpiadas de la Escuela.</p></div>
          <div class="entry"><h3>Inglés · Nivel B2</h3><p class="meta">Instituto Cultural · 2015 – 2020</p></div>
        </section>
        <section class="content-section" id="intereses">
          <h2>Fuera de la facultad</h2>
          <div class="interests">
            <div><h3>En movimiento</h3><p>Gimnasio, natación y running. Boxeo y kickboxing, de vez en cuando.</p></div>
            <div><h3>Mercados y blockchain</h3><p>Un interés personal: acciones, criptomonedas, futuros y opciones. Desarrollo de estrategias y operación con capital propio.</p></div>
          </div>
        </section>
        <section class="content-section" id="gustos">
          <h2>Cosas a las que vuelvo</h2>
          <p>Algunos libros, discos y películas que tienen su lugar en mi vida.</p>
          ${shelves.map(([heading,cls,items])=>`<h3>${heading}</h3><ul class="bookshelf${cls}">${items.map(([file,title])=>`<li><figure><img src="images/gustos/${file}" alt="" width="200" height="${cls ? '200':'300'}" loading="lazy"><figcaption>${title}</figcaption></figure></li>`).join('')}</ul>`).join('\n          ')}
        </section>
        <section class="content-section"><h2>Conversemos</h2><p>Si algo de lo que hago te interesa o tenés una idea para compartir, <a href="mailto:benjamindepaolo8@gmail.com">escribime</a>.</p><img class="signature" src="images/firma.png" alt="Firma de Benjamin De Paolo" width="100" height="96" loading="lazy"></section>
      </article>
`;
await writeFile(new URL('sobre-mi.html', root), layout({title:'Sobre mí — Benjamin De Paolo',description:'Mi recorrido en medicina, docencia e inteligencia artificial. Y también los libros, la música y las cosas que me mueven.',body:about,about:true}));
console.log(`Generadas 7 páginas estáticas en ${fileURLToPath(root)}`);
