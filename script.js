// script.js - minimal, elegant behavior
// - cambia color de fondo (plano) según slide visible
// - aplica color a los iconos (trazo) usando currentColor
// - botones start/back funcionan
// - micro-animaciones al tocar (very subtle), keyboard accessible

(function () {
  const slides = document.querySelectorAll('.slide');

  // Map slide color to icon/text color choices
  // For dark backgrounds -> cream (text-light)
  // For light background (verde claro) -> dark stroke (text-dark)
  const DARK_TEXT = getComputedStyle(document.documentElement).getPropertyValue('--text-light').trim() || '#F8EAD7';
  const LIGHT_STROKE = getComputedStyle(document.documentElement).getPropertyValue('--text-dark').trim() || '#0F4934';

  function setBodyBg(color) {
    if (!color) return;
    document.body.style.background = color;
    // update currentColor for graphics: iterate visible slide(s)
    // but we'll set color per-most-visible slide in observer below
  }

  // Build thresholds for smoother detection
  function buildThresholdList() {
    const thresholds = [];
    for (let i=0; i<=100; i+=5) thresholds.push(i/100);
    return thresholds;
  }

  const observer = new IntersectionObserver((entries) => {
    // choose entry with max intersection
    let best = entries[0];
    entries.forEach(e => {
      if (e.intersectionRatio > best.intersectionRatio) best = e;
    });
    if (best && best.isIntersecting) {
      const color = best.target.getAttribute('data-color') || '#0F4934';
      setBodyBg(color);

      // Decide icon/text color depending on bg
      const normalized = (color || '').toUpperCase();
      const lightBgHex = '#BEE2C8';
      const isLightBg = normalized === lightBgHex.toUpperCase();

      // set CSS currentColor for graphical buttons inside this slide
      const graphics = best.target.querySelectorAll('.graphic-line');
      graphics.forEach(g => {
        if (isLightBg) {
          g.style.color = LIGHT_STROKE; // dark stroke on light background
        } else {
          g.style.color = DARK_TEXT; // cream stroke on dark backgrounds
        }
      });

      // Also ensure general text color: if lightBg make text dark (handled via CSS class if needed)
      if (isLightBg) best.target.classList.add('light-text'); else best.target.classList.remove('light-text');
    }
  }, { threshold: buildThresholdList() });

  slides.forEach(s => observer.observe(s));

  // Set initial background on load
  window.addEventListener('load', () => {
    const first = document.querySelector('.slide');
    if (first) setBodyBg(first.getAttribute('data-color'));
  });

  // Start and back buttons
  const startBtn = document.getElementById('startBtn');
  if (startBtn) {
    startBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const next = document.getElementById('slide-2');
      if (next) next.scrollIntoView({ behavior: 'smooth' });
    });
  }
  const backTop = document.getElementById('backTop');
  if (backTop) {
    backTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Interactive micro-animations for graphical buttons
  const roleToAnim = {
    'huito': 'play-bounce',
    'maloca': 'play-bounce',
    'rio': 'play-wave',
    'arbol': 'play-sway'
  };

  const graphics = document.querySelectorAll('.graphic-line');
  graphics.forEach(g => {
    // pointer interaction (touch/mouse)
    g.addEventListener('pointerdown', (ev) => {
      ev.preventDefault();
      triggerAnim(g);
    }, { passive: false });

    // keyboard
    g.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' || ev.key === ' ') {
        ev.preventDefault();
        triggerAnim(g);
      }
    });
  });

  function triggerAnim(el) {
    const role = el.getAttribute('data-role');
    const animClass = roleToAnim[role] || 'play-bounce';
    // retrigger by removing and forcing reflow
    el.classList.remove(animClass);
    void el.offsetWidth;
    el.classList.add(animClass);
    const duration = (animClass === 'play-sway') ? 380 : (animClass === 'play-wave' ? 360 : 280);
    setTimeout(() => el.classList.remove(animClass), duration + 30);
  }

  // Respect reduced-motion
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mq.matches) {
    graphics.forEach(g => g.style.cursor = 'default');
  }
})();
