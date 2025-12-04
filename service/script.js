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
  article.setAttribute("data-aos", "zoom-in-up");
  article.setAttribute("data-aos-delay", `${200 + index * 80}`);

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
    populateProjectGrid();

    const featuredCards = document.querySelectorAll('.featured-project-card');

    featuredCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            const rotateX = (y / rect.height) * -8; // Adjust multiplier for sensitivity
            const rotateY = (x / rect.width) * 8;   // Adjust multiplier for sensitivity

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
            card.style.transition = 'transform 0.1s linear'; // Smooth transition for mouse move
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            card.style.transition = 'transform 0.4s ease'; // Slower transition for mouse leave
        });
    });
});

