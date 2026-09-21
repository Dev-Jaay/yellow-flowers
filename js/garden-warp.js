/**
 * El Jardín: túnel infinito de tulipanes.
 *
 * Los tulipanes "nacen" en el centro de la pantalla (muy pequeños,
 * lejos de la cámara) y avanzan hacia el usuario, agrandándose y
 * alejándose del centro, como si se atravesara un campo de flores.
 * Al pasar de largo se reciclan y vuelven a nacer en el centro, así
 * que el efecto nunca se acaba (infinito).
 *
 * La velocidad de avance la controla:
 *  - El scroll / rueda del mouse (o el gesto de pellizco de un
 *    trackpad, que el navegador reporta como wheel + ctrlKey).
 *  - En pantallas táctiles: pellizcar con dos dedos para
 *    expandir/zoom (separar los dedos = avanzar) y también un
 *    arrastre simple con un dedo, por comodidad.
 */
(function () {
  const canvas = document.getElementById("warpCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const hint = document.getElementById("gardenHint");

  const TULIP_SRC = "assets/flores/flor-5.png";
  const tulipImg = new Image();
  let imgReady = false;
  let imgAspect = 0.7; // ancho/alto, se corrige cuando carga la imagen real
  tulipImg.onload = () => {
    imgReady = true;
    imgAspect = tulipImg.naturalWidth / tulipImg.naturalHeight;
  };
  tulipImg.src = TULIP_SRC;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let width = 0,
    height = 0,
    cx = 0,
    cy = 0,
    dpr = 1;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cx = width / 2;
    cy = height / 2;
  }

  // --- Modelo del túnel (perspectiva simple) ---
  const FAR_Z = 14; // profundidad a la que "nace" un tulipán
  const NEAR_Z = 0.6; // al cruzar este umbral, se recicla (infinito)
  const BASE_SIZE = 110; // tamaño de referencia (px) a distancia z=1
  const COUNT = 46;

  function focal() {
    return Math.min(width, height) * 0.9;
  }

  function rand(a, b) {
    return a + Math.random() * (b - a);
  }
  function clamp(v, a, b) {
    return Math.max(a, Math.min(b, v));
  }

  let particles = [];

  function spawn(p, initial) {
    p.wx = rand(-1, 1);
    p.wy = rand(-1, 1);
    p.z = initial ? rand(NEAR_Z, FAR_Z) : rand(FAR_Z * 0.9, FAR_Z);
    p.rot = rand(0, 360);
    p.rotSpeed = rand(-18, 18);
    p.jitter = rand(0.75, 1.3);
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < COUNT; i++) {
      const p = {};
      spawn(p, true);
      particles.push(p);
    }
  }

  // --- Entrada del usuario: scroll y pellizco/zoom ---
  let velocity = 0;
  const FRICTION = 0.945;
  const WHEEL_K = 0.0022;
  const TOUCH_DRAG_K = 0.02;
  const PINCH_K = 0.05;
  let hasInteracted = false;

  function registerInput(amount) {
    velocity += amount;
    if (!hasInteracted && Math.abs(velocity) > 0.01) {
      hasInteracted = true;
      if (hint) hint.classList.add("is-hidden");
    }
  }

  function onWheel(e) {
    e.preventDefault();
    registerInput(e.deltaY * WHEEL_K);
  }

  let singleTouchY = null;
  let pinchDist = null;

  function touchDistance(touches) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.hypot(dx, dy);
  }

  function onTouchStart(e) {
    if (e.touches.length === 2) {
      pinchDist = touchDistance(e.touches);
      singleTouchY = null;
    } else if (e.touches.length === 1) {
      singleTouchY = e.touches[0].clientY;
      pinchDist = null;
    }
  }

  function onTouchMove(e) {
    e.preventDefault();
    if (e.touches.length === 2) {
      const dist = touchDistance(e.touches);
      if (pinchDist != null) {
        // Separar los dedos (pellizco hacia afuera / zoom+) = avanzar.
        registerInput((dist - pinchDist) * PINCH_K);
      }
      pinchDist = dist;
      singleTouchY = null;
    } else if (e.touches.length === 1) {
      const y = e.touches[0].clientY;
      if (singleTouchY != null) {
        registerInput((singleTouchY - y) * TOUCH_DRAG_K);
      }
      singleTouchY = y;
    }
  }

  function onTouchEnd(e) {
    if (e.touches.length < 2) pinchDist = null;
    if (e.touches.length < 1) singleTouchY = null;
  }

  window.addEventListener("wheel", onWheel, { passive: false });
  window.addEventListener("touchstart", onTouchStart, { passive: true });
  window.addEventListener("touchmove", onTouchMove, { passive: false });
  window.addEventListener("touchend", onTouchEnd, { passive: true });
  window.addEventListener("resize", resize);

  // --- Bucle de animación ---
  let lastTime = 0;

  function drawCenterGlow() {
    const radius = Math.min(width, height) * 0.4;
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
    grad.addColorStop(0, "rgba(255, 213, 88, 0.3)");
    grad.addColorStop(1, "rgba(255, 213, 88, 0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawTulip(p) {
    const f = focal();
    const scale = f / p.z;
    const sx = cx + p.wx * scale;
    const sy = cy + p.wy * scale;
    const h = (BASE_SIZE * p.jitter) / p.z;
    const w = h * imgAspect;

    const fadeIn = clamp((FAR_Z - p.z) / (FAR_Z - FAR_Z * 0.8), 0, 1);
    const fadeOut = clamp((p.z - NEAR_Z) / (NEAR_Z * 1.6 - NEAR_Z), 0, 1);
    const opacity = fadeIn * fadeOut;
    if (opacity <= 0.01 || !imgReady) return;

    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.translate(sx, sy);
    ctx.rotate((p.rot * Math.PI) / 180);
    ctx.shadowColor = "rgba(255, 213, 88, 0.85)";
    ctx.shadowBlur = 10 + h * 0.12;
    ctx.drawImage(tulipImg, -w / 2, -h / 2, w, h);
    ctx.restore();
  }

  function frame(t) {
    if (!lastTime) lastTime = t;
    const dt = clamp((t - lastTime) / 16.6667, 0, 3);
    lastTime = t;

    velocity *= FRICTION;
    if (Math.abs(velocity) < 0.0006) velocity = 0;
    const idle = reduceMotion ? 0 : 0.028;
    const speed = velocity + idle;

    ctx.clearRect(0, 0, width, height);
    drawCenterGlow();

    particles.forEach((p) => {
      p.z -= speed * dt;
      p.rot += p.rotSpeed * dt * 0.4;
      if (p.z < 0.05) p.z = 0.05;
      if (p.z <= NEAR_Z) spawn(p, false);
      if (p.z > FAR_Z * 1.15) p.z = FAR_Z;
    });

    // Dibuja de más lejos a más cerca para que las cercanas queden encima.
    particles
      .slice()
      .sort((a, b) => b.z - a.z)
      .forEach(drawTulip);

    requestAnimationFrame(frame);
  }

  resize();
  initParticles();
  requestAnimationFrame(frame);
})();
