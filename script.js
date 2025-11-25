(function () {
  const slides = document.querySelectorAll('.slide');


  const DARK_TEXT = getComputedStyle(document.documentElement).getPropertyValue('--text-light').trim() || '#F8EAD7';
  const LIGHT_STROKE = getComputedStyle(document.documentElement).getPropertyValue('--text-dark').trim() || '#0F4934';

  function setBodyBg(color) {
    if (!color) return;
    document.body.style.background = color;
   
  }

  function buildThresholdList() {
    const thresholds = [];
    for (let i=0; i<=100; i+=5) thresholds.push(i/100);
    return thresholds;
  }

  const observer = new IntersectionObserver((entries) => {
    let best = entries[0];
    entries.forEach(e => {
      if (e.intersectionRatio > best.intersectionRatio) best = e;
    });
    if (best && best.isIntersecting) {
      const color = best.target.getAttribute('data-color') || '#0F4934';
      setBodyBg(color);

    
      const normalized = (color || '').toUpperCase();
      const lightBgHex = '#BEE2C8';
      const isLightBg = normalized === lightBgHex.toUpperCase();

      const graphics = best.target.querySelectorAll('.graphic-line');
      graphics.forEach(g => {
        if (isLightBg) {
          g.style.color = LIGHT_STROKE; 
        } else {
          g.style.color = DARK_TEXT; 
        }
      });

      if (isLightBg) best.target.classList.add('light-text'); else best.target.classList.remove('light-text');
    }
  }, { threshold: buildThresholdList() });

  slides.forEach(s => observer.observe(s));

  window.addEventListener('load', () => {
    const first = document.querySelector('.slide');
    if (first) setBodyBg(first.getAttribute('data-color'));
  });

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

  const roleToAnim = {
    'huito': 'play-bounce',
    'maloca': 'play-bounce',
    'rio': 'play-wave',
    'arbol': 'play-sway'
  };

  const graphics = document.querySelectorAll('.graphic-line');
  graphics.forEach(g => {
    g.addEventListener('pointerdown', (ev) => {
      ev.preventDefault();
      triggerAnim(g);
    }, { passive: false });

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
    el.classList.remove(animClass);
    void el.offsetWidth;
    el.classList.add(animClass);
    const duration = (animClass === 'play-sway') ? 380 : (animClass === 'play-wave' ? 360 : 280);
    setTimeout(() => el.classList.remove(animClass), duration + 30);
  }

})();
