/**
 * Campo de estrellas en <canvas> con:
 *  - Múltiples capas de profundidad (parallax)
 *  - Parpadeo suave e independiente por estrella
 *  - Reacción sutil al movimiento del cursor / giroscopio móvil
 *  - Estrellas fugaces ocasionales
 */
(function () {
  const canvas = document.getElementById("starfield");
  const ctx = canvas.getContext("2d");

  let width, height, dpr;
  let layers = [];
  let shootingStars = [];
  let pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
  let reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const LAYER_CONFIG = [
    { count: 90, sizeRange: [0.5, 1.2], speed: 0.15, twinkleSpeed: 0.015, parallax: 6 },
    { count: 60, sizeRange: [1, 1.9], speed: 0.3, twinkleSpeed: 0.02, parallax: 14 },
    { count: 35, sizeRange: [1.5, 2.6], speed: 0.5, twinkleSpeed: 0.028, parallax: 26 }
  ];

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildStars();
  }

  function buildStars() {
    layers = LAYER_CONFIG.map((cfg) => {
      const stars = [];
      for (let i = 0; i < cfg.count; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: cfg.sizeRange[0] + Math.random() * (cfg.sizeRange[1] - cfg.sizeRange[0]),
          twinklePhase: Math.random() * Math.PI * 2,
          baseAlpha: 0.4 + Math.random() * 0.6
        });
      }
      return { cfg, stars };
    });
  }

  function maybeSpawnShootingStar() {
    if (reduceMotion) return;
    if (Math.random() < 0.0025 && shootingStars.length < 2) {
      const startX = Math.random() * width * 0.6 + width * 0.2;
      shootingStars.push({
        x: startX,
        y: -20,
        vx: 5 + Math.random() * 4,
        vy: 3 + Math.random() * 2,
        life: 1,
        length: 80 + Math.random() * 60
      });
    }
  }

  function drawShootingStars() {
    shootingStars.forEach((s) => {
      const grad = ctx.createLinearGradient(s.x, s.y, s.x - s.length, s.y - s.length * 0.55);
      grad.addColorStop(0, `rgba(255, 245, 210, ${s.life})`);
      grad.addColorStop(1, "rgba(255, 245, 210, 0)");
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x - s.length, s.y - s.length * 0.55);
      ctx.stroke();

      s.x += s.vx * 4;
      s.y += s.vy * 4;
      s.life -= 0.02;
    });
    shootingStars = shootingStars.filter((s) => s.life > 0 && s.y < height + 100);
  }

  let t = 0;
  function render() {
    t += 1;
    ctx.clearRect(0, 0, width, height);

    pointer.x += (pointer.targetX - pointer.x) * 0.04;
    pointer.y += (pointer.targetY - pointer.y) * 0.04;

    layers.forEach((layer) => {
      const { cfg, stars } = layer;
      const offsetX = -pointer.x * cfg.parallax;
      const offsetY = -pointer.y * cfg.parallax;

      stars.forEach((star) => {
        const alpha = reduceMotion
          ? star.baseAlpha
          : star.baseAlpha * (0.6 + 0.4 * Math.sin(t * cfg.twinkleSpeed + star.twinklePhase));

        const x = star.x + offsetX;
        const y = star.y + offsetY;

        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 250, 235, ${Math.max(alpha, 0)})`;
        ctx.shadowColor = "rgba(255, 224, 150, 0.8)";
        ctx.shadowBlur = star.r * 2.2;
        ctx.arc(x, y, star.r, 0, Math.PI * 2);
        ctx.fill();
      });
    });

    maybeSpawnShootingStar();
    drawShootingStars();

    requestAnimationFrame(render);
  }

  function onPointerMove(clientX, clientY) {
    pointer.targetX = (clientX / width - 0.5) * 2;
    pointer.targetY = (clientY / height - 0.5) * 2;
  }

  window.addEventListener("resize", resize);
  window.addEventListener("mousemove", (e) => onPointerMove(e.clientX, e.clientY));
  window.addEventListener(
    "touchmove",
    (e) => {
      if (e.touches && e.touches[0]) {
        onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    },
    { passive: true }
  );

  if (window.DeviceOrientationEvent) {
    window.addEventListener("deviceorientation", (e) => {
      if (e.gamma === null || e.beta === null) return;
      pointer.targetX = Math.max(-1, Math.min(1, e.gamma / 30));
      pointer.targetY = Math.max(-1, Math.min(1, (e.beta - 45) / 30));
    });
  }

  resize();
  render();
})();
