(() => {
  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  const cursorGlow = document.querySelector('.cursor-glow');
  const photo = document.getElementById('profileImage');
  const photoWrap = document.querySelector('.photo-wrap');
  const fallback = document.getElementById('photoFallback');

  document.getElementById('year').textContent = new Date().getFullYear();

  if (photo && photoWrap && fallback) {
    const showPhoto = () => {
      photoWrap.classList.add('has-photo');
      fallback.hidden = true;
    };
    const showFallback = () => {
      photoWrap.classList.remove('has-photo');
      fallback.hidden = false;
    };
    photo.addEventListener('load', showPhoto);
    photo.addEventListener('error', showFallback);
    if (photo.complete) {
      photo.naturalWidth ? showPhoto() : showFallback();
    }
  }

  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 22);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  menuToggle?.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    menuToggle.classList.toggle('is-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
  });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    menuToggle?.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  }));

  if (window.matchMedia('(pointer:fine)').matches && cursorGlow) {
    cursorGlow.style.opacity = '1';
    window.addEventListener('pointermove', event => {
      cursorGlow.style.left = `${event.clientX}px`;
      cursorGlow.style.top = `${event.clientY}px`;
    }, { passive: true });
  }

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: .14 });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      skillObserver.unobserve(entry.target);
    });
  }, { threshold: .35 });
  document.querySelectorAll('.skill-column').forEach(el => skillObserver.observe(el));

  const countUp = (element) => {
    const target = Number(element.dataset.count || 0);
    const suffix = element.dataset.suffix || '';
    const duration = 1200;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      element.textContent = `${Math.round(target * eased)}${suffix}`;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const metricsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const num = entry.target.querySelector('[data-count]');
      if (num && !num.dataset.counted) {
        num.dataset.counted = 'true';
        countUp(num);
      }
      metricsObserver.unobserve(entry.target);
    });
  }, { threshold: .45 });
  document.querySelectorAll('.metric-card').forEach(el => metricsObserver.observe(el));
})();
