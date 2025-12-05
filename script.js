// Typing Effect
const roles = ["Web Designer", "Frontend Developer", "Creative Coder"];
let roleIndex = 0;
let charIndex = 0;
const typingTarget = document.querySelector(".typing-role");

function typeEffect() {
  if (!typingTarget) return;

  if (charIndex < roles[roleIndex].length) {
    typingTarget.textContent += roles[roleIndex].charAt(charIndex);
    charIndex += 1;
    setTimeout(typeEffect, 100);
    return;
  }

  setTimeout(eraseEffect, 1500);
}

function eraseEffect() {
  if (!typingTarget) return;

  if (charIndex > 0) {
    typingTarget.textContent = roles[roleIndex].substring(0, charIndex - 1);
    charIndex -= 1;
    setTimeout(eraseEffect, 60);
    return;
  }

  roleIndex = (roleIndex + 1) % roles.length;
  setTimeout(typeEffect, 200);
}

function initFadeInSections() {
  const sections = document.querySelectorAll(".fade-in-section");
  if (sections.length === 0) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.25 }
  );

  sections.forEach((section) => observer.observe(section));
}

function initTiltCards() {
  const tiltCards = document.querySelectorAll("[data-tilt]");
  if (tiltCards.length === 0) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const teardownTilt = () => {
    tiltCards.forEach((card) => {
      card.style.removeProperty("--tilt-rotate-x");
      card.style.removeProperty("--tilt-rotate-y");
      card.style.removeProperty("--tilt-scale");
    });
  };

  if (prefersReducedMotion.matches) {
    teardownTilt();
    return;
  }

  const updateTransform = (card, rotateX, rotateY) => {
    card.style.setProperty("--tilt-rotate-x", `${rotateX}deg`);
    card.style.setProperty("--tilt-rotate-y", `${rotateY}deg`);
  };

  tiltCards.forEach((card) => {
    let animationFrame = null;

    const handlePointerMove = (event) => {
      if (event.pointerType && event.pointerType !== "mouse" && event.pointerType !== "pen") {
        return;
      }

      const bounds = card.getBoundingClientRect();
      const relX = event.clientX - bounds.left;
      const relY = event.clientY - bounds.top;
      const rotateY = ((relX / bounds.width) - 0.5) * 16;
      const rotateX = (0.5 - (relY / bounds.height)) * 16;

      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }

      animationFrame = requestAnimationFrame(() => {
        updateTransform(card, rotateX.toFixed(2), rotateY.toFixed(2));
      });
    };

    const resetTilt = () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }

      animationFrame = requestAnimationFrame(() => {
        card.style.setProperty("--tilt-rotate-x", "0deg");
        card.style.setProperty("--tilt-rotate-y", "0deg");
        card.style.setProperty("--tilt-scale", "1");
        card.style.removeProperty("--tilt-translate-y");
        card.style.removeProperty("animation-play-state");
        card.classList.remove("is-hovered");
      });
    };

    card.addEventListener("pointerenter", (event) => {
      if (event.pointerType && event.pointerType !== "mouse" && event.pointerType !== "pen") {
        return;
      }
      card.style.setProperty("--tilt-scale", "1.08");
      card.style.setProperty("--tilt-translate-y", "-6px");
      card.style.animationPlayState = "paused";
      card.classList.add("is-hovered");
    });

    card.addEventListener("pointermove", handlePointerMove);
    card.addEventListener("pointerleave", resetTilt);
    card.addEventListener("pointercancel", resetTilt);
  });

  prefersReducedMotion.addEventListener("change", (mediaQuery) => {
    if (mediaQuery.matches) {
      teardownTilt();
    }
  });
}

function initProgressLines() {
  const lines = document.querySelectorAll(".progress-line");
  if (lines.length === 0) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const target = entry.target;
        const progressValue = target.dataset.progress || "0";
        target.style.setProperty("--progress", `${progressValue}%`);
        obs.unobserve(target);
      });
    },
    { threshold: 0.45 }
  );

  lines.forEach((line) => observer.observe(line));
}

function initTestimonialCarousel() {
  const track = document.querySelector("[data-testimonial-track]");
  if (!track) return;

  const slides = Array.from(track.children);
  if (slides.length <= 1) return;

  const dotsContainer = document.querySelector("[data-testimonial-dots]");
  const prevButton = document.querySelector(".testimonial-arrow.prev");
  const nextButton = document.querySelector(".testimonial-arrow.next");

  let currentIndex = 0;
  let autoTimer = null;

  const easing = getComputedStyle(document.documentElement).getPropertyValue("--transition-snappy") || "cubic-bezier(0.22, 1, 0.36, 1)";

  const setActiveDot = (index) => {
    if (!dotsContainer) return;
    dotsContainer.querySelectorAll("button").forEach((dot, idx) => {
      dot.classList.toggle("is-active", idx === index);
    });
  };

  const goToSlide = (index) => {
    currentIndex = (index + slides.length) % slides.length;
    track.style.transition = `transform 0.8s ${easing.trim()}`;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    setActiveDot(currentIndex);
  };

  const handlePrev = () => {
    stopAuto();
    goToSlide(currentIndex - 1);
    startAuto();
  };

  const handleNext = () => {
    stopAuto();
    goToSlide(currentIndex + 1);
    startAuto();
  };

  const startAuto = () => {
    stopAuto();
    autoTimer = window.setInterval(() => {
      goToSlide(currentIndex + 1);
    }, 6000);
  };

  const stopAuto = () => {
    if (autoTimer) {
      window.clearInterval(autoTimer);
      autoTimer = null;
    }
  };

  if (dotsContainer) {
    slides.forEach((_, idx) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", `Show testimonial ${idx + 1}`);
      dot.addEventListener("click", () => {
        stopAuto();
        goToSlide(idx);
        startAuto();
      });
      dotsContainer.appendChild(dot);
    });
  }

  prevButton?.addEventListener("click", handlePrev);
  nextButton?.addEventListener("click", handleNext);

  [track, prevButton, nextButton].forEach((element) => {
    if (!element) return;
    element.addEventListener("mouseenter", stopAuto);
    element.addEventListener("mouseleave", startAuto);
    element.addEventListener("focusin", stopAuto);
    element.addEventListener("focusout", startAuto);
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopAuto();
    } else {
      startAuto();
    }
  });

  // Initial state
  track.style.transform = "translateX(0)";
  requestAnimationFrame(() => {
    goToSlide(0);
    startAuto();
  });
}

function initScrollIndicator() {
  const indicator = document.querySelector(".scroll-indicator");
  if (!indicator) return;

  const handleScroll = () => {
    const targetOpacity = window.scrollY > 120 ? 0 : 0.85;
    indicator.style.opacity = targetOpacity.toString();
    indicator.style.pointerEvents = "none";
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();
}

function initDynamicYear() {
  const yearEl = document.querySelector("[data-year]");
  if (!yearEl) return;
  yearEl.textContent = new Date().getFullYear();
}

const projectShowcase = [
  {
    title: "Project Nova",
    tag: "Analytics",
    description: "AI-driven analytics cockpit layering predictive insights with realtime trend scanning for product teams.",
    image: "https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=1200&q=80",
    icon: "fa-solid fa-meteor",
  },
  {
    title: "Synapse Pulse",
    tag: "SaaS UI",
    description: "Cross-device operations suite streamlining launch readiness, sprint health, and stakeholder updates in one view.",
    image: "https://images.unsplash.com/photo-1557838923-2985c318be48?auto=format&fit=crop&w=1200&q=80",
    icon: "fa-solid fa-bolt",
  },
  {
    title: "Aurora Studio",
    tag: "Storytelling",
    description: "Immersive brand microsite blending motion-led storytelling, parallax depth, and generative color waves.",
    image: "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=80",
    icon: "fa-solid fa-moon",
  },
  {
    title: "CircuitX",
    tag: "Design System",
    description: "Hackathon-ready component library offering instant previews, live token editing, and theme presets.",
    image: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80",
    icon: "fa-solid fa-cubes-stacked",
  },
  {
    title: "Flux Horizon",
    tag: "VR Experience",
    description: "Cinematic VR landing page that teases spatial soundscapes, guided missions, and reactive lighting cues.",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    icon: "fa-solid fa-vr-cardboard",
  },
  {
    title: "Quantum Forge",
    tag: "Research",
    description: "Interactive report visualising quantum computing roadmaps with layered insights and annotated milestones.",
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1200&q=80",
    icon: "fa-solid fa-atom",
  },
  {
    title: "Neon Nexus",
    tag: "Event Hub",
    description: "High-energy hackathon portal with live leaderboards, team dashboards, and dynamic sponsor showcases.",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    icon: "fa-solid fa-satellite-dish",
  },
  {
    title: "HoloWave",
    tag: "Product Launch",
    description: "Launch splash for a holographic audio device featuring volumetric renders, sound-reactive gradients, and CTA flows.",
    image: "https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?auto=format&fit=crop&w=1200&q=80",
    icon: "fa-solid fa-wave-square",
  },
  {
    title: "Atlas Sync",
    tag: "Collaboration",
    description: "Realtime collaboration hub with adaptive timelines, meeting intelligence, and broadcast-ready status pulses.",
    image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=1200&q=80",
    icon: "fa-solid fa-layer-group",
  },
];

function createProjectCard(project, index) {
  const article = document.createElement("article");
  article.className = "project-card";
  article.setAttribute("data-tilt", "");

  const column = index % 3;
  let animationType = "fade-up"; // Default for middle column
  if (column === 0) { // Left column
    animationType = "fade-right";
  } else if (column === 2) { // Right column
    animationType = "fade-left";
  }

  article.setAttribute("data-aos", animationType);
  article.setAttribute("data-aos-delay", `${200 + (index % 3) * 100}`);

  const altText = `${project.title} showcase visual`;

  article.innerHTML = `
    <img src="${project.image}" alt="${altText}" loading="lazy" />
    <div class="project-overlay">
      <div class="overlay-content">
        <span class="project-tag">
          <i class="fa-solid fa-circle" aria-hidden="true"></i>
          ${project.tag}
        </span>
        <i class="${project.icon} overlay-icon" aria-hidden="true"></i>
        <h3 class="project-title">${project.title}</h3>
        <p class="project-description">${project.description}</p>
      </div>
    </div>
  `;

  return article;
}

function populateProjectGrid() {
  const grid = document.querySelector(".projects-grid");
  if (!grid) return;

  projectShowcase.forEach((project, index) => {
    const card = createProjectCard(project, index);
    grid.appendChild(card);
  });

  if (typeof initTiltCards === "function") {
    initTiltCards();
  }

  if (window.AOS) {
    if (typeof window.AOS.refreshHard === "function") {
      window.AOS.refreshHard();
    } else if (typeof window.AOS.refresh === "function") {
      window.AOS.refresh();
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  typeEffect();
  initFadeInSections();
  initTiltCards();
  initProgressLines();
  initTestimonialCarousel();
  initScrollIndicator();
  initDynamicYear();
  initFeaturedProjectTilt();
  populateProjectGrid();
});

// Mobile Navbar Toggle
function toggleMenu() {
  const nav = document.getElementById("navLinks");
  if (!nav) return;

  nav.classList.toggle("show");

  const outsideClickHandler = (event) => {
    const menuIcon = document.querySelector(".menu-icon");
    if (!menuIcon) return;

    const clickOutsideNav = !nav.contains(event.target);
    const clickOutsideMenu = !menuIcon.contains(event.target);

    if (clickOutsideNav && clickOutsideMenu) {
      nav.classList.remove("show");
      document.removeEventListener("click", outsideClickHandler);
    }
  };

  if (nav.classList.contains("show")) {
    document.addEventListener("click", outsideClickHandler);
  } else {
    document.removeEventListener("click", outsideClickHandler);
  }
}

// Preloader behaviour
window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");
  const mainContent = document.querySelector(".hero-section");
  if (!preloader || !mainContent) return;

  const hasVisited = sessionStorage.getItem("hasVisited");

  if (hasVisited) {
    preloader.style.display = "none";
    mainContent.classList.add("fade-in");
    return;
  }

  sessionStorage.setItem("hasVisited", "true");

  setTimeout(() => {
    preloader.style.opacity = "0";

    setTimeout(() => {
      preloader.style.display = "none";
      mainContent.classList.add("fade-in");
    }, 1000);
  }, 4000);
});

// Particle animation
const canvas = document.getElementById("particle-canvas");
const ctx = canvas ? canvas.getContext("2d") : null;

if (canvas && ctx) {
  const modes = [
    "orange-glow",
    "yellow-glow",
    "blue-bubble",
    "red-pulse",
    "green-orbit",
    "white-rain",
    "electric-purple",
    "aqua-neon",
    "pink-spark",
    "cyber-teal",
  ];

  let currentMode = modes[0];
  const particles = [];

  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  class Particle {
    constructor(x, y, mode) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 3 + 1;
      this.speedX = (Math.random() - 0.5) * 2;
      this.speedY = (Math.random() - 0.5) * 2;
      this.alpha = 1;
      this.mode = mode;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.alpha -= 0.01;
      this.size -= 0.02;

      // Add mode-specific behavior
      switch (this.mode) {
        case "orange-glow":
          this.speedY += 0.05;
          break;
        case "yellow-glow":
          this.speedX *= 0.99;
          this.speedY *= 0.99;
          break;
        case "blue-bubble":
          this.speedY -= 0.03;
          break;
        case "red-pulse":
          this.size += Math.sin(Date.now() * 0.01) * 0.1;
          break;
        case "green-orbit":
          const angle = Date.now() * 0.001;
          this.speedX = Math.cos(angle) * 2;
          this.speedY = Math.sin(angle) * 2;
          break;
        case "white-rain":
          this.speedY += 0.1;
          this.speedX = 0;
          break;
        case "electric-purple":
          this.speedX += (Math.random() - 0.5) * 0.5;
          this.speedY += (Math.random() - 0.5) * 0.5;
          break;
        case "aqua-neon":
          this.speedX = Math.sin(Date.now() * 0.01) * 2;
          this.speedY = Math.cos(Date.now() * 0.01) * 2;
          break;
        case "pink-spark":
          this.speedX *= 1.05;
          this.speedY *= 1.05;
          break;
        case "cyber-teal":
          this.speedX += Math.sin(this.y * 0.01) * 0.2;
          this.speedY += Math.cos(this.x * 0.01) * 0.2;
          break;
      }
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;

      // Mode-specific colors and effects
      switch (this.mode) {
        case "orange-glow":
          ctx.fillStyle = "#ff6b35";
          ctx.shadowBlur = 10;
          ctx.shadowColor = "#ff6b35";
          break;
        case "yellow-glow":
          ctx.fillStyle = "#ffd700";
          ctx.shadowBlur = 15;
          ctx.shadowColor = "#ffd700";
          break;
        case "blue-bubble":
          ctx.fillStyle = "#00bfff";
          ctx.shadowBlur = 20;
          ctx.shadowColor = "#00bfff";
          break;
        case "red-pulse":
          ctx.fillStyle = "#ff1493";
          ctx.shadowBlur = 25;
          ctx.shadowColor = "#ff1493";
          break;
        case "green-orbit":
          ctx.fillStyle = "#00ff00";
          ctx.shadowBlur = 15;
          ctx.shadowColor = "#00ff00";
          break;
        case "white-rain":
          ctx.fillStyle = "#ffffff";
          ctx.shadowBlur = 5;
          ctx.shadowColor = "#ffffff";
          break;
        case "electric-purple":
          ctx.fillStyle = "#9400d3";
          ctx.shadowBlur = 30;
          ctx.shadowColor = "#9400d3";
          break;
        case "aqua-neon":
          ctx.fillStyle = "#00ffff";
          ctx.shadowBlur = 25;
          ctx.shadowColor = "#00ffff";
          break;
        case "pink-spark":
          ctx.fillStyle = "#ff69b4";
          ctx.shadowBlur = 20;
          ctx.shadowColor = "#ff69b4";
          break;
        case "cyber-teal":
          ctx.fillStyle = "#008080";
          ctx.shadowBlur = 18;
          ctx.shadowColor = "#008080";
          break;
      }

      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  document.addEventListener("mousemove", (event) => {
    for (let i = 0; i < 6; i += 1) {
      particles.push(new Particle(event.clientX, event.clientY, currentMode));
    }
  });

  const handleParticles = () => {
    for (let i = 0; i < particles.length; i += 1) {
      particles[i].update();
      particles[i].draw();

      if (particles[i].alpha <= 0 || particles[i].size < 0.3) {
        particles.splice(i, 1);
        i -= 1;
      }
    }
  };

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleParticles();
    requestAnimationFrame(animate);
  };

  animate();

  setInterval(() => {
    const currentIndex = modes.indexOf(currentMode);
    currentMode = modes[(currentIndex + 1) % modes.length];
  }, 4000);
}

function initFeaturedProjectTilt() {
    const featuredCards = document.querySelectorAll('.featured-project-card');
    if (featuredCards.length === 0) return;

    featuredCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--x', `${x}px`);
            card.style.setProperty('--y', `${y}px`);

            const rotateX = (y / rect.height - 0.5) * -16;
            const rotateY = (x / rect.width - 0.5) * 16;

            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

// CV Download Button Handler
function initCVButton() {
  const cvButtons = document.querySelectorAll('#cvButton');
  
  cvButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Create notification element
      const notification = document.createElement('div');
      notification.className = 'cv-notification';
      notification.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <span>CV is not ready yet. Coming soon! 📋</span>
      `;
      
      // Add to body
      document.body.appendChild(notification);
      
      // Remove after animation completes (4 seconds)
      setTimeout(() => {
        notification.remove();
      }, 4000);
    });
  });
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initCVButton();
});
