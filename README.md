# Portfolio — Robert Aranda

Web estática hecha con HTML, CSS y JavaScript, sin frameworks ni instalaciones.

## Archivos

| Archivo      | Para qué sirve                                                  |
|--------------|-----------------------------------------------------------------|
| `data.js`    | **Tus datos y textos**: nombre, email, WhatsApp, servicios, proyectos, pasos, ventajas. Edita solo esto. |
| `index.html` | Estructura de la página                                         |
| `styles.css` | Diseño (azul) y animaciones                                     |
| `main.js`    | Efectos: escena 3D del inicio, scroll, "tu web paso a paso", tarjetas 3D |
| `scene3d.js` | Fondo 3D con formas flotantes (usa Three.js desde internet)     |
| `img/`       | Capturas de tus proyectos                                       |

## Añadir un proyecto nuevo

1. Guarda una captura de escritorio (ideal 1280×800) y una de móvil en `img/`.
2. En `data.js`, copia un bloque dentro de `projects` y cambia los datos.
3. `embed: true` muestra la web en vivo en la "Vista previa"; si la web no lo permite, pon `false` y se mostrarán las capturas.

## Verlo en tu PC

Usa la extensión **Live Server** de VS Code (clic derecho en `index.html` → *Open with Live Server*).
Si lo abres con doble clic, todo funciona menos el fondo 3D: el navegador lo bloquea en archivos locales. Una vez publicado, funciona completo.

## Publicarlo (recomendado: GitHub + Cloudflare Pages)

### 1. Subir el código a GitHub
1. Crea una cuenta en https://github.com y un repositorio nuevo llamado `portfolio` (público).
2. Pulsa **"uploading an existing file"** y arrastra todos los archivos de esta carpeta (incluida `img/`).
3. Pulsa **Commit changes**.

### 2. Publicar con Cloudflare Pages
1. Entra en https://dash.cloudflare.com → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Elige tu repositorio `portfolio`.
3. Framework preset: **None**. Build command: *(vacío)*. Output directory: `/`.
4. **Save and Deploy**. En un minuto tendrás tu web en `https://portfolio-xxx.pages.dev`.
5. Cada vez que cambies algo en GitHub, Cloudflare lo publica solo.

### 3. (Opcional) Tu propio dominio
Ej. `robertaranda.dev`: en Cloudflare Pages → tu proyecto → **Custom domains** → **Set up a custom domain**.

### Alternativa: solo GitHub Pages
En tu repositorio: **Settings → Pages → Source: Deploy from a branch → main / (root) → Save**.
Quedará en `https://tuusuario.github.io/portfolio`.
