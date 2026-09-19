# Sitio personal de Benjamin De Paolo

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
│   └── gustos/           # portadas de películas, discos y libros (webp de 360 px de alto, una en avif)
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
ancho. En pantallas más chicas el reel va debajo del párrafo. Las portadas van en tres filas (`.shelf`), todas a
la misma altura.

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
| Foco de palabras al scrollear | clase `.desc` |
| Reloj de Mendoza | `#local-clock` |
| Botón "Hablemos" (WhatsApp de 8 a 18, aviso fuera de horario) | `#talk-btn` |
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

- **Antes de publicar**: cargar el link de WhatsApp, variable `WHATSAPP` al principio de `assets/site.js`
  (formato `https://wa.me/<código de país + número>`, sin `+` ni espacios). Mientras no esté, el botón "Hablemos"
  abre la portada de WhatsApp en horario. El horario en que abre WhatsApp (hora de Mendoza) está en
  `TALK_FROM` / `TALK_TO`.
- Opcional: sumar el link a Letterboxd (en `otras-cosas.html`, bloque `#cap-gustos`).
- Opcional, cuando se conozca la dirección final: poner la dirección completa en el `<link rel="canonical">` de
  cada página.
