/**
 * Pequeñas estrellas que aparecen y se desvanecen al mover el cursor
 * (o el dedo, en pantallas táctiles), dando una sensación mágica de
 * "polvo de estrella" siguiendo al usuario. Se escuchan ambos tipos
 * de entrada a la vez para funcionar igual de bien con mouse, con
 * dedo, o en dispositivos híbridos (ej. laptops con pantalla táctil).
 */
(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  let lastSpawn = 0;
  const THROTTLE_MS = 45;

  function spawnStar(x, y) {
    const now = performance.now();
    if (now - lastSpawn < THROTTLE_MS) return;
    lastSpawn = now;

    const star = document.createElement("div");
    star.className = "cursor-star";
    const size = 3 + Math.random() * 4;
    star.style.width = size + "px";
    star.style.height = size + "px";
    star.style.left = x - size / 2 + "px";
    star.style.top = y - size / 2 + "px";

    document.body.appendChild(star);
    star.addEventListener("animationend", () => star.remove());
  }

  // Ratón / trackpad.
  window.addEventListener("mousemove", (e) => spawnStar(e.clientX, e.clientY));

  // Dedo en pantallas táctiles: al tocar y al arrastrar el dedo.
  function handleTouch(e) {
    if (e.touches && e.touches[0]) {
      spawnStar(e.touches[0].clientX, e.touches[0].clientY);
    }
  }
  window.addEventListener("touchstart", handleTouch, { passive: true });
  window.addEventListener("touchmove", handleTouch, { passive: true });
})();
