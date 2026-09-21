/**
 * Música de fondo.
 *
 * Se intenta reproducir automáticamente al cargar la página. Los
 * navegadores (Chrome, Firefox, Safari) bloquean el audio CON sonido
 * si la persona nunca interactuó con el sitio — es una política de
 * la plataforma, no algo que se pueda saltar desde el código. Por
 * eso, si el autoplay falla, la música arranca sola en cuanto la
 * persona hace lo primero que sea en la página (un clic, un toque,
 * una tecla o el primer scroll) — no hace falta que toque el botón
 * de música específicamente. El botón siempre refleja el estado real
 * y sirve para pausarla o volver a activarla cuando se quiera.
 */
(function () {
  const audio = document.getElementById("bgMusic");
  const btn = document.getElementById("musicToggle");
  if (!audio || !btn) return;

  audio.volume = 0.55;

  function tryPlay() {
    const p = audio.play();
    if (p && typeof p.catch === "function") {
      p.catch(() => {
        /* Autoplay bloqueado por el navegador; se reintentará con la
           primera interacción del usuario (ver más abajo). */
      });
    }
  }

  // Intento inicial, apenas carga la página.
  tryPlay();

  // Si el navegador lo bloqueó, la primera interacción del usuario
  // (con lo que sea: la galaxia, el jardín, una tecla, un scroll)
  // dispara la música automáticamente, sin que tenga que buscar el
  // botón. Se desactiva a sí mismo en cuanto suena una vez.
  const interactionEvents = ["pointerdown", "keydown", "touchstart", "wheel"];
  function onFirstInteraction() {
    if (audio.paused) tryPlay();
    interactionEvents.forEach((evt) => window.removeEventListener(evt, onFirstInteraction));
  }
  interactionEvents.forEach((evt) =>
    window.addEventListener(evt, onFirstInteraction, { passive: true, once: false })
  );

  audio.addEventListener("play", () => {
    interactionEvents.forEach((evt) => window.removeEventListener(evt, onFirstInteraction));
    btn.classList.add("is-playing");
    btn.setAttribute("aria-pressed", "true");
    btn.setAttribute("aria-label", "Pausar música de fondo");
  });

  audio.addEventListener("pause", () => {
    btn.classList.remove("is-playing");
    btn.setAttribute("aria-pressed", "false");
    btn.setAttribute("aria-label", "Reproducir música de fondo");
  });

  // El botón sigue funcionando como play/pause manual en todo momento.
  btn.addEventListener("click", () => {
    if (audio.paused) {
      tryPlay();
    } else {
      audio.pause();
    }
  });
})();
