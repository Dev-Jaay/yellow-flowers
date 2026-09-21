/**
 * Genera partículas doradas flotantes (polvo de estrellas) y
 * pequeñas palabras románticas ambientales que aparecen y se
 * desvanecen por toda la pantalla.
 */
(function () {
  const stardustContainer = document.getElementById("stardust");
  const wordsContainer = document.getElementById("floatingWords");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isSmallScreen = window.innerWidth < 640;

  const WORDS = [
    "te amo", "mi sol", "mi universo", "eres preciosa", "para ti",
    "siempre juntos", "mi amor", "te adoro", "eres mi luz", "amor de mi vida"
  ];

  function spawnParticle() {
    const el = document.createElement("div");
    el.className = "stardust-particle";
    const size = 2 + Math.random() * 4;
    const left = Math.random() * 100;
    const duration = 10 + Math.random() * 14;
    const drift = (Math.random() - 0.5) * 120;

    el.style.left = left + "vw";
    el.style.width = size + "px";
    el.style.height = size + "px";
    el.style.setProperty("--drift", drift + "px");
    el.style.animationDuration = duration + "s";

    stardustContainer.appendChild(el);
    setTimeout(() => el.remove(), duration * 1000 + 200);
  }

  function spawnWord() {
    const el = document.createElement("div");
    el.className = "floating-word";
    el.textContent = WORDS[Math.floor(Math.random() * WORDS.length)];

    const left = 8 + Math.random() * 84;
    const top = 8 + Math.random() * 78;
    const size = 0.85 + Math.random() * 0.9;
    const duration = 7 + Math.random() * 4;

    el.style.left = left + "vw";
    el.style.top = top + "vh";
    el.style.fontSize = size + "rem";
    el.style.animationDuration = duration + "s";

    wordsContainer.appendChild(el);
    setTimeout(() => el.remove(), duration * 1000 + 200);
  }

  if (!reduceMotion) {
    const particleInterval = isSmallScreen ? 900 : 500;
    setInterval(spawnParticle, particleInterval);
    for (let i = 0; i < 12; i++) setTimeout(spawnParticle, i * 200);

    const wordInterval = isSmallScreen ? 4200 : 3200;
    setInterval(spawnWord, wordInterval);
    setTimeout(spawnWord, 1500);
  }
})();
