// Modal de aviso
const soundModal = document.getElementById("soundModal");
const modalClose = document.getElementById("modalClose");
const modalOverlay = document.getElementById("modalOverlay");
const audio = document.getElementById("audio");

// Bloquear scroll ao carregar
document.body.classList.add("modal-open");

function closeModal() {
  soundModal.classList.add("hidden");
  document.body.classList.remove("modal-open");
  // Iniciar música ao fechar
  audio.play().catch(() => {
    // Se autoplay falhar, usuário terá que clicar no botão play
  });
}

modalClose?.addEventListener("click", closeModal);
modalOverlay?.addEventListener("click", closeModal);

// Player
const playBtn = document.getElementById("playBtn");
const pauseBtn = document.getElementById("pauseBtn");
const seek = document.getElementById("seek");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const s = Math.max(0, Math.floor(seconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
}

playBtn?.addEventListener("click", async () => {
  try {
    await audio.play();
  } catch (e) {
    // Autoplay costuma ser bloqueado, mas clique do usuário deve liberar
  }
});

pauseBtn?.addEventListener("click", () => {
  audio.pause();
});

audio.addEventListener("loadedmetadata", () => {
  durationEl.textContent = formatTime(audio.duration);
});

audio.addEventListener("timeupdate", () => {
  currentTimeEl.textContent = formatTime(audio.currentTime);

  if (Number.isFinite(audio.duration) && audio.duration > 0) {
    const pct = Math.round((audio.currentTime / audio.duration) * 100);
    seek.value = String(pct);
  }
});

seek?.addEventListener("input", () => {
  if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;
  const pct = Number(seek.value) / 100;
  audio.currentTime = pct * audio.duration;
});

// Scroll reveal
const revealEls = Array.from(document.querySelectorAll(".reveal"));
const momentVideo = document.getElementById("momentVideo");
const staticText = document.querySelector(".static");
const footer = document.querySelector(".footer");

const io = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;

      entry.target.classList.add("is-visible");

      // Iniciar vídeo quando aparecer na tela
      if (entry.target.contains(momentVideo) && momentVideo) {
        momentVideo.play().catch(() => {
          // Se autoplay falhar, vídeo permanece pausado
        });
      }

      io.unobserve(entry.target);
    }
  },
  { threshold: 0.15 }
);

revealEls.forEach((el) => io.observe(el));

// Observer específico para o footer
if (footer && staticText) {
  const footerObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          // Mostrar texto .static após 5 segundos
          setTimeout(() => {
            staticText.classList.add("show");
          }, 5000);
          
          footerObserver.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.15 }
  );
  
  footerObserver.observe(footer);
}