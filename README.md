# Nuestra Galaxia 🌻

Una página web romántica e inmersiva: una galaxia oscura con estrellas, partículas
y una gran flor central rodeada de girasoles que orbitan y se pueden tocar. Al hacer
clic en cada girasol se abre un mensaje con transición suave.

Es un proyecto **100% estático** (HTML + CSS + JS puro, sin frameworks ni build step),
así que puedes abrirlo directamente o subirlo a cualquier hosting estático.

## Estructura

```
index.html              → estructura de la página
css/style.css           → todos los estilos (galaxia, órbitas, modal, responsive)
js/messages.js          → ✏️ EDITA AQUÍ los mensajes de cada girasol
js/starfield.js         → estrellas de fondo (canvas) + paralaje con el cursor
js/stardust.js          → partículas doradas flotantes y palabras ambientales
js/cursor-trail.js      → estrellas que siguen al cursor/dedo
js/galaxy.js            → construye los anillos de girasoles automáticamente
js/main.js              → apertura/cierre del modal y efecto 3D de la galaxia
assets/flores/          → imágenes de las flores (PNG con fondo transparente)
```

## ✏️ Cómo personalizar los mensajes

Abre **`js/messages.js`**. Ahí verás una lista `GALAXY_MESSAGES`. Cada elemento es
un girasol de la galaxia:

```js
{
  image: "assets/flores/flor-1.png",
  title: "Un deseo bajo las estrellas",
  message: "Aquí va tu mensaje personalizado..."
}
```

- Cambia `title` y `message` por tu propio texto.
- Cambia `image` por cualquier archivo dentro de `assets/flores/` (o agrega tus
  propias imágenes PNG con fondo transparente a esa carpeta).
- Agrega o elimina objetos de la lista: la galaxia se reorganiza sola, sin tocar
  el HTML ni el CSS.
- El mensaje del centro de la galaxia (la flor grande) se edita en la constante
  `GALAXY_CORE_MESSAGE`, al final del mismo archivo.

## 🖼️ Cómo agregar tus propias flores

1. Guarda la imagen (PNG, idealmente con fondo transparente) dentro de `assets/flores/`.
2. Referénciala en `js/messages.js` con su ruta, por ejemplo `assets/flores/mi-flor.png`.

## 🚀 Cómo probarlo localmente

Simplemente abre `index.html` con doble clic en tu navegador. Como no usa `fetch`
ni módulos ES, funciona incluso sin servidor local.

Si prefieres un servidor local (opcional, para simular producción):

```bash
npx serve .
```

## 🌍 Cómo desplegarlo

Cualquiera de estas opciones funciona sin configuración adicional, porque el
proyecto es completamente estático:

- **Netlify**: arrastra la carpeta completa a [app.netlify.com/drop](https://app.netlify.com/drop).
- **Vercel**: `npx vercel` dentro de esta carpeta.
- **GitHub Pages**: sube el contenido a un repositorio y activa Pages apuntando
  a la rama principal.
- **Cualquier hosting estático** (Cloudflare Pages, Surge, un servidor propio, etc.).

## 🎛️ Detalles técnicos / ajustes rápidos

- **Cantidad de girasoles**: la controla automáticamente la cantidad de objetos en
  `GALAXY_MESSAGES`. Se reparten entre 3 anillos.
- **Velocidad de las órbitas**: se ajusta en `RING_CONFIG` dentro de `js/galaxy.js`
  (propiedad `duration`, en segundos).
- **Colores / tipografías**: variables CSS al inicio de `css/style.css` (`:root`).
- **Rendimiento en móviles**: las partículas y palabras flotantes reducen su
  frecuencia automáticamente en pantallas pequeñas, y todas las animaciones
  respetan `prefers-reduced-motion`.

Hecho con 🌻 para alguien especial.
