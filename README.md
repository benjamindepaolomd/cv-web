# Sitio personal de Benjamin De Paolo

## Portfolio minimalista

Diseño inspirado en tmalamud.com: columna de 640 px, foto circular, tipografía Geist, proyectos como enlaces de texto y temas claro y oscuro. La portada prioriza los proyectos; cada uno tiene una página propia. `sobre-mi.html` reúne la trayectoria, formación e intereses.

El sitio funciona sin instalar dependencias. Los HTML generados se pueden abrir directamente o publicar en un hosting estático, incluyendo la carpeta `proyectos/`.

- `index.html`: presentación y cinco proyectos.
- `proyectos/*.html`: detalle, participación y enlaces reales de cada proyecto.
- `sobre-mi.html`: recorrido e intereses.
- `assets/minimal.css` y `assets/minimal.js`: estilos, tema persistente y copia de email.
- `scripts/build.mjs`: contenido y plantillas de las siete páginas. Después de editarlo, ejecutar `node scripts/build.mjs`.
- `scripts/serve.mjs`: vista local con `node scripts/serve.mjs`, en `http://127.0.0.1:4173`.

La navegación y los contenidos funcionan sin JavaScript. El tema sigue al sistema hasta elegir uno; la preferencia se comparte entre páginas. Incluye foco visible, enlace para saltar al contenido, adaptación móvil y respeto por movimiento reducido. PreDetect incluye el enlace a su sitio web. LUNA se presenta como «Próximamente», con su dominio como texto hasta que esté listo. INNOVADUCATE enlaza a su web desde la portada, la experiencia y las fichas de ambos proyectos.

Las páginas anteriores `otras-cosas.html` y `404.html` mantienen sus recursos compartidos. La documentación que sigue corresponde a las versiones anteriores.

## Historial: perfil unificado

`index.html` reúne ahora el CV, los proyectos de IA, otras actividades, los intereses y el contacto. Conserva los recursos compartidos y agrega `assets/portfolio.css` y `assets/portfolio.js` para su diseño adaptable, navegación por secciones y contenido multimedia en ventanas emergentes. Los reproductores se cargan al abrir su ventana y se descargan al cerrarla. El diálogo se cierra con el botón, Escape o un clic afuera, y devuelve el foco al botón de origen.

`otras-cosas.html` se conserva como página anterior para mantener sus enlaces existentes. La navegación del nuevo index es interna; la paleta de comandos incluye todas sus secciones. No se requieren dependencias ni compilación. Se puede abrir `index.html` directamente o servir la carpeta con un servidor estático.

La documentación siguiente describe también la estructura y los comportamientos de la versión anterior.

Sitio estático de dos páginas, sin dependencias ni build. Se abre haciendo doble clic en
`index.html` y se publica subiendo la carpeta tal cual a GitHub Pages o Cloudflare Pages.

## Estructura

```
/
├── index.html            # perfil / CV
├── otras-cosas.html      # página "Sobre mí" (el archivo conserva el nombre viejo para no romper links)
├── 404.html              # página de error (la usan GitHub y Cloudflare Pages)
├── assets/
│   ├── site.css          # estilos de todas las páginas
│   └── site.js           # funciones de todas las páginas
├── images/
│   ├── me.jpg            # foto del avatar (perfil)
│   ├── firma.png         # firma (pie de "Sobre mí")
│   └── gustos/           # portadas de películas, discos y libros (webp de hasta 600 px de alto, una en avif)
├── .nojekyll             # le dice a GitHub Pages que publique los archivos tal cual
├── .gitignore            # deja afuera de GitHub lo que no es del sitio
│
├── Cambios.txt           # notas de cambios pendientes            ┐
├── Cambios-HECHOS.txt    # historial de notas ya aplicadas        │ no forman parte del sitio
└── _archivo/             # material que ya no se usa              ┘ ni se suben a GitHub
    ├── portadas-originales/   # imágenes originales de las portadas, antes de optimizarlas
    ├── version-anterior/      # copia vieja de la página "Sobre mí"
    └── herramientas/          # diagnostico.html: página que muestra qué hace cada navegador
```

En "Sobre mí" los reels de Instagram flotan a la derecha (`.split-side`, en pantallas de 880 px o más) y el
texto corre continuo y los rodea: junto al reel es más angosto y apenas el reel termina vuelve a ocupar todo el
ancho. En pantallas más chicas el reel va debajo del párrafo.

Las portadas van en tres filas de tres (`.shelf`). Cada fila ocupa todo el ancho de la columna, de línea a línea como
el texto, y las portadas de una misma fila tienen la misma altura: el ancho de cada una es proporcional a su
relación ancho/alto, que va en el `style="--r:..."` de cada `<li>` (ancho / alto x 1000, por ejemplo 675 para una
portada de 405 x 600). Al agregar una portada hay que poner ese número. Por eso las filas de películas y libros
quedan más altas que la de discos: los discos son cuadrados y con tres alcanza el ancho antes.

En el pie de "Sobre mí" la firma flota abajo a la derecha (`footer.signed`). Los botones del pie reservan a su derecha
el ancho de la firma (variable `--sig`), así que en el teléfono pasan a dos líneas en vez de quedar tapados por ella.

Las dos páginas cargan el mismo CSS y el mismo JS, así que cualquier cambio de estilo o de
comportamiento se hace una sola vez y aparece en las dos.

## Cómo funciona el JS compartido

`assets/site.js` activa cada función sólo si encuentra el elemento correspondiente, así que
la misma copia sirve para las tres páginas:

| Función | Se activa si existe |
|---|---|
| Cambio de tema (con transición circular) | `#theme-toggle` |
| Header pegajoso + barra de progreso | `#header-row`, `#progress-bar` |
| Spotlight que sigue al cursor | `#spotlight` |
| Botones magnéticos | clase `.magnetic` |
| Aparición al scrollear | clase `.reveal` |
| Foco de palabras al scrollear (descripciones del perfil y párrafos de "Sobre mí") | clase `.desc` o párrafos de `.prose` |
| Reloj de Mendoza | `#local-clock` |
| Botón "Hablemos" (WhatsApp de 8 a 18, aviso fuera de horario) | `#talk-btn` |
| Luz de estado del botón (verde de 8 a 18, roja fuera de horario, pulsante) | `#status-dot` |
| Pin de Google Maps (ventana emergente con General Alvear) | `#map-btn` |
| Avisos flotantes | `#toast` |
| Copiar email / descargar vCard | `#copy-email-btn`, `#vcard-btn` |
| Paleta de comandos (Ctrl/⌘ + K) y atajos | `#sheet-overlay` + `#sheet` |

La paleta de comandos arma su lista sola: cada elemento con `id` y `data-section="Etiqueta"`
se convierte en un comando "Ir a Etiqueta". Para agregar una sección nueva al buscador
alcanza con ponerle esos dos atributos en el HTML.

El atributo `data-page` del `<body>` (`index`, `otras-cosas`, `404`) es lo que decide el
comando de navegación entre páginas.

## Publicar en GitHub Pages

Solo forman parte del sitio `index.html`, `otras-cosas.html`, `404.html`, `assets/`, `images/` y `.nojekyll`.
El `.gitignore` deja afuera las notas (`Cambios*.txt`) y `_archivo/`, así que con git (por ejemplo con GitHub
Desktop) se sube solo lo del sitio.

1. Crear un repositorio nuevo en github.com. Tiene que ser público: en las cuentas gratuitas Pages solo funciona
   con repositorios públicos.
2. Subir esta carpeta: con GitHub Desktop (File, Add local repository, Commit, Publish repository) o con git.
3. En el repositorio: Settings, Pages, "Deploy from a branch", rama `main`, carpeta `/ (root)`, Save.
4. En uno o dos minutos el sitio queda en `https://USUARIO.github.io/NOMBRE-DEL-REPO/` (o en
   `https://USUARIO.github.io/` si el repositorio se llama `USUARIO.github.io`).

Si en vez de git se arrastran archivos a la web de GitHub, hay que arrastrar solo esos seis elementos, nunca las
notas ni `_archivo/`.

**Cloudflare Pages**: conectar el repositorio, sin comando de build, directorio de salida `/`.

## Pendiente

El link de WhatsApp está en la variable `WHATSAPP` al principio de `assets/site.js` (formato
`https://wa.me/<código de país + número>`, sin `+` ni espacios). El horario en que "Hablemos" abre WhatsApp y en que
la luz está verde (hora de Mendoza) está en `TALK_FROM` / `TALK_TO`.

- Opcional: sumar el link a Letterboxd (en `otras-cosas.html`, bloque `#cap-gustos`).
- Opcional, cuando se conozca la dirección final: poner la dirección completa en el `<link rel="canonical">` de
  cada página.
