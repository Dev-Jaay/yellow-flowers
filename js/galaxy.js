/**
 * Construye los anillos orbitales de la galaxia:
 *  - Una flor única y clicable por cada entrada de GALAXY_MESSAGES
 *    (definido en js/messages.js), repartidas sin repetirse entre
 *    los 3 anillos. Al hacer clic despachan "flower:open" para que
 *    main.js abra el modal correspondiente.
 *  - Emojis decorativos (corazones amarillos, estrellas, destellos)
 *    intercalados en los mismos anillos para dar sensación de
 *    plenitud, puramente visuales y no interactivos.
 */
(function () {
  const galaxy = document.getElementById("galaxy");
  const ringEls = {
    0: document.getElementById("ring1"),
    1: document.getElementById("ring2"),
    2: document.getElementById("ring3")
  };

  // Config de cada anillo: porcentaje de radio respecto al contenedor,
  // duración de la revolución y dirección (debe coincidir con el CSS
  // de .orbit-ring--N para que la flor se mantenga "de pie").
  const RING_CONFIG = [
    { percent: 0.40, duration: 46, direction: "normal", flowerSize: [58, 72], decorCount: 3, decorSize: [16, 22] },
    { percent: 0.68, duration: 66, direction: "reverse", flowerSize: [66, 84], decorCount: 4, decorSize: [18, 26] },
    { percent: 0.96, duration: 92, direction: "normal", flowerSize: [74, 96], decorCount: 5, decorSize: [20, 30] }
  ];

  const DECOR_SYMBOLS = ["💛", "⭐", "✨", "🌟", "💫"];

  let currentRadii = [0, 0, 0];

  function computeRadii() {
    const w = galaxy.clientWidth;
    currentRadii = RING_CONFIG.map((cfg) => (w * cfg.percent) / 2);
  }

  function createOrbitWrapper(angle, ringIndex, cfg) {
    const item = document.createElement("div");
    item.className = "orbit-item";
    item.style.setProperty("--angle", angle + "deg");
    item.style.setProperty("--radius", currentRadii[ringIndex] + "px");

    const upright = document.createElement("div");
    upright.className = "flower-upright";
    upright.style.setProperty("--angle", angle + "deg");
    upright.style.setProperty("--dur", cfg.duration + "s");
    upright.style.setProperty("--dir", cfg.direction);

    item.appendChild(upright);
    return { item, upright };
  }

  // Congela la órbita completa del anillo mientras el cursor (o un
  // dedo) está sobre una flor, así es fácil apuntar y hacer clic
  // sobre un objeto que normalmente está en movimiento.
  function attachPauseOnHover(btn, ringEl) {
    let touchResumeTimer = null;

    const pause = () => ringEl.classList.add("is-paused");
    const resume = () => ringEl.classList.remove("is-paused");

    btn.addEventListener("pointerenter", pause);
    btn.addEventListener("pointerleave", resume);
    btn.addEventListener("focus", pause);
    btn.addEventListener("blur", resume);

    // En pantallas táctiles no existe "hover": pausamos al tocar y
    // reanudamos poco después (o en cuanto se cierra el modal).
    btn.addEventListener(
      "touchstart",
      () => {
        pause();
        clearTimeout(touchResumeTimer);
        touchResumeTimer = setTimeout(resume, 1500);
      },
      { passive: true }
    );
  }

  function createFlowerButton(msg, size) {
    const swayDuration = 4 + Math.random() * 3;
    const swayDelay = Math.random() * -6;

    const btn = document.createElement("button");
    btn.className = "flower-btn";
    btn.type = "button";
    btn.style.setProperty("--size", size + "px");
    btn.style.setProperty("--sway-dur", swayDuration + "s");
    btn.style.setProperty("--sway-delay", swayDelay + "s");
    btn.setAttribute("aria-label", msg.title || "Abrir mensaje");

    const glow = document.createElement("span");
    glow.className = "flower-btn__glow";

    const img = document.createElement("img");
    img.src = msg.image;
    img.alt = msg.title || "Girasol";
    img.draggable = false;
    img.loading = "lazy";

    btn.appendChild(glow);
    btn.appendChild(img);
    btn.addEventListener("click", () => {
      document.dispatchEvent(new CustomEvent("flower:open", { detail: msg }));
    });

    return btn;
  }

  function createDecorItem(size) {
    const swayDuration = 3 + Math.random() * 3;
    const swayDelay = Math.random() * -6;
    const symbol = DECOR_SYMBOLS[Math.floor(Math.random() * DECOR_SYMBOLS.length)];

    const span = document.createElement("span");
    span.className = "decor-item";
    span.textContent = symbol;
    span.setAttribute("aria-hidden", "true");
    span.style.setProperty("--size", size + "px");
    span.style.setProperty("--sway-dur", swayDuration + "s");
    span.style.setProperty("--sway-delay", swayDelay + "s");
    span.style.setProperty("--twinkle-delay", Math.random() * -4 + "s");

    return span;
  }

  // Reparte los slots de un anillo entre flores y decoraciones,
  // separando las flores lo más uniformemente posible.
  function buildRingSlots(flowerCount, decorCount) {
    const total = flowerCount + decorCount;
    const slots = new Array(total).fill("decor");
    for (let i = 0; i < flowerCount; i++) {
      const idx = Math.round((i * total) / flowerCount) % total;
      slots[idx] = "flower";
    }
    return slots;
  }

  function buildGalaxy() {
    Object.values(ringEls).forEach((el) => (el.innerHTML = ""));

    // Reparte las flores únicas entre los 3 anillos sin repetir ninguna.
    const flowerBuckets = [[], [], []];
    GALAXY_MESSAGES.forEach((msg, i) => flowerBuckets[i % 3].push(msg));

    RING_CONFIG.forEach((cfg, ringIndex) => {
      const ringEl = ringEls[ringIndex];
      ringEl.style.animationDuration = cfg.duration + "s";

      const flowers = flowerBuckets[ringIndex];
      const slots = buildRingSlots(flowers.length, cfg.decorCount);
      const total = slots.length;
      let flowerCursor = 0;

      slots.forEach((type, i) => {
        const angle = (360 / total) * i + ringIndex * 18;
        const { item, upright } = createOrbitWrapper(angle, ringIndex, cfg);

        if (type === "flower") {
          const msg = flowers[flowerCursor++];
          const baseSize = cfg.flowerSize[0] + Math.random() * (cfg.flowerSize[1] - cfg.flowerSize[0]);
          const size = baseSize * (msg.scale || 1);
          const btn = createFlowerButton(msg, size);
          attachPauseOnHover(btn, ringEl);
          upright.appendChild(btn);
        } else {
          const size = cfg.decorSize[0] + Math.random() * (cfg.decorSize[1] - cfg.decorSize[0]);
          upright.appendChild(createDecorItem(size));
        }

        ringEl.appendChild(item);
      });
    });
  }

  function updateRadii() {
    computeRadii();
    document.querySelectorAll(".orbit-item").forEach((item) => {
      const ringEl = item.parentElement;
      let ringIndex = 0;
      if (ringEl === ringEls[1]) ringIndex = 1;
      if (ringEl === ringEls[2]) ringIndex = 2;
      item.style.setProperty("--radius", currentRadii[ringIndex] + "px");
    });
  }

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(updateRadii, 150);
  });

  computeRadii();
  buildGalaxy();
})();
