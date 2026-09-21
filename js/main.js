/**
 * Lógica principal: apertura/cierre del modal romántico.
 *
 * Nota: este archivo tenía antes un efecto de paralaje 3D
 * (rotateX/rotateY sobre #galaxy siguiendo el cursor). Se quitó
 * porque, combinado con transform-style:preserve-3d, hacía que el
 * navegador ignorara el z-index normal para decidir qué elemento
 * recibe el clic: a veces el clic "atravesaba" una flor (o el
 * centro, aunque estuviera quieto) y caía sobre el anillo orbital
 * de atrás. Por eso el clic fallaba de forma intermitente.
 */
(function () {
  const overlay = document.getElementById("modalOverlay");
  const modalTitle = document.getElementById("modalTitle");
  const modalMessage = document.getElementById("modalMessage");
  const modalFlowerImg = document.getElementById("modalFlowerImg");
  const modalClose = document.getElementById("modalClose");
  const modalScroll = document.querySelector(".modal__scroll");
  const galaxyCore = document.getElementById("galaxyCore");

  let lastFocused = null;

  function updateScrollFade() {
    if (!modalScroll) return;
    const isScrollable = modalScroll.scrollHeight > modalScroll.clientHeight + 2;
    modalScroll.classList.toggle("is-scrollable", isScrollable);
  }

  function openModal(data) {
    modalTitle.textContent = data.title || "";
    modalMessage.textContent = data.message || "";
    modalFlowerImg.src = data.image || "assets/flores/centro.png";
    modalFlowerImg.alt = data.title || "Flor";
    if (modalScroll) modalScroll.scrollTop = 0;

    lastFocused = document.activeElement;
    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    modalClose.focus();

    // Se calcula después de pintar el modal (la imagen puede tardar
    // un instante en cargar y cambiar la altura disponible).
    requestAnimationFrame(updateScrollFade);
    modalFlowerImg.addEventListener("load", updateScrollFade, { once: true });
  }

  function closeModal() {
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus();
    }
  }

  document.addEventListener("flower:open", (e) => openModal(e.detail));

  galaxyCore.addEventListener("click", () => {
    openModal({
      title: GALAXY_CORE_MESSAGE.title,
      message: GALAXY_CORE_MESSAGE.message,
      image: "assets/flores/centro.png"
    });
  });
  galaxyCore.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      galaxyCore.click();
    }
  });

  modalClose.addEventListener("click", closeModal);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("is-open")) {
      closeModal();
    }
  });

  window.addEventListener("resize", () => {
    if (overlay.classList.contains("is-open")) updateScrollFade();
  });
})();
