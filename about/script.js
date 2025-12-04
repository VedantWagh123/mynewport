  // Skill Icons Intersection Observer
window.addEventListener('DOMContentLoaded', () => {
  const skillIcons = document.querySelectorAll('.skill-icon');

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  skillIcons.forEach((icon, index) => {
    skillObserver.observe(icon);
    icon.style.transitionDelay = `${index * 0.15}s`; // staggered animation
  });
});

// Tab Switching Function (only one definition)
function showTab(tabId) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));

  document.querySelector(`[onclick="showTab('${tabId}')"]`).classList.add('active');
  document.getElementById(tabId).classList.add('active');
}

// Fixed height for tallest tab content
window.addEventListener('load', () => {
  const contents = document.querySelectorAll('.tab-content');
  let maxHeight = 0;

  contents.forEach(content => {
    content.style.display = 'block';
    const height = content.offsetHeight;
    if (height > maxHeight) maxHeight = height;
    content.style.display = ''; // reset
  });

  document.querySelector('.tab-contents').style.minHeight = maxHeight + 'px';
});

// Scroll Animation (for general scroll-animate elements)
window.addEventListener('DOMContentLoaded', () => {
  const scrollElements = document.querySelectorAll('.scroll-animate');

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        scrollObserver.unobserve(entry.target); // remove this line if repeat animation needed
      }
    });
  }, { threshold: 0.2 });

  scrollElements.forEach(el => scrollObserver.observe(el));
});

// Typewriter / Canva animation can go below this comment
// Example placeholder (you can paste that logic here later)
// TODO: Add your canvas or typewriter animation code below
