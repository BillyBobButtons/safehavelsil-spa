/* ─────────────────────────────────────────────────────────────
   Safe Haven SLC — Main JS
   ───────────────────────────────────────────────────────────── */

(function () {
  'use strict';

  // ── NAV: scroll state & mobile toggle ─────────────────────────
  const header  = document.getElementById('site-header');
  const toggle  = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  function updateHeader() {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  toggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close nav when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close nav on outside click
  document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('open') && !header.contains(e.target)) {
      navLinks.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  // ── SCROLL ANIMATIONS ─────────────────────────────────────────
  const revealEls = document.querySelectorAll('.reveal, .fade-up');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  // ── ANIMATED COUNTERS ─────────────────────────────────────────
  const counters = document.querySelectorAll('.stat-number[data-target]');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);

      if (target === 0) { el.textContent = '0'; counterObserver.unobserve(el); return; }

      const duration = 1400;
      const startTime = performance.now();

      function tick(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(tick);
      }

      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));

  // ── BACK TO TOP ───────────────────────────────────────────────
  const backToTop = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    const show = window.scrollY > 500;
    backToTop.hidden = !show;
  }, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ── CONTACT FORM ──────────────────────────────────────────────
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('form-success');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Basic validation
      const required = form.querySelectorAll('[required]');
      let valid = true;

      required.forEach(field => {
        field.style.borderColor = '';
        if (!field.value.trim()) {
          field.style.borderColor = '#E57373';
          valid = false;
        }
      });

      if (!valid) {
        const firstInvalid = form.querySelector('[required]:not([value]),[required][value=""]');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // Simulate submission (replace with actual endpoint)
      const btn = form.querySelector('button[type="submit"]');
      btn.textContent = 'Sending…';
      btn.disabled = true;

      setTimeout(() => {
        form.hidden = true;
        success.hidden = false;
      }, 900);
    });

    // Clear error highlight on input
    form.querySelectorAll('input, textarea').forEach(field => {
      field.addEventListener('input', () => { field.style.borderColor = ''; });
    });
  }

  // ── SMOOTH ANCHOR SCROLL (accounts for fixed header) ──────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();

      const headerHeight = header.offsetHeight;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight - 12;
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });
})();
