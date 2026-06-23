document.addEventListener('DOMContentLoaded', () => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  initNav();
  initScrollReveal(prefersReduced);
  initCounters(prefersReduced);
  initTabs();
  initProjectFilter();
});

/* ── Navigation ─────────────────────────────────── */
function initNav() {
  const nav = document.getElementById('nav');
  const toggle = document.querySelector('.nav__toggle');
  const menu = document.getElementById('nav-menu');

  // Scroll state
  window.addEventListener('scroll', () => {
    nav.classList.toggle('nav--scrolled', window.scrollY > 40);
  }, { passive: true });

  // Mobile hamburger
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!isOpen));
      toggle.classList.toggle('nav__toggle--open');
      menu.classList.toggle('nav__links--open');
      document.body.classList.toggle('nav-open');
    });

    menu.querySelectorAll('.nav__link:not(.nav__dropdown-trigger)').forEach(link => {
      link.addEventListener('click', closeNav);
    });
  }

  // Dropdown toggle (desktop + mobile)
  document.querySelectorAll('.nav__dropdown-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetId = btn.getAttribute('aria-controls');
      const dropdown = document.getElementById(targetId);
      if (!dropdown) return;

      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      closeAllDropdowns();
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        dropdown.classList.add('open');
      }
    });
  });

  // Close dropdowns on outside click
  document.addEventListener('click', closeAllDropdowns);

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllDropdowns();
      closeNav();
    }
  });

  function closeAllDropdowns() {
    document.querySelectorAll('.nav__dropdown.open').forEach(d => d.classList.remove('open'));
    document.querySelectorAll('.nav__dropdown-btn[aria-expanded="true"]').forEach(b => b.setAttribute('aria-expanded', 'false'));
  }

  function closeNav() {
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
    if (toggle) toggle.classList.remove('nav__toggle--open');
    if (menu) menu.classList.remove('nav__links--open');
    document.body.classList.remove('nav-open');
  }
}

/* ── Scroll reveal ──────────────────────────────── */
function initScrollReveal(prefersReduced) {
  const els = document.querySelectorAll('.reveal');

  if (prefersReduced) {
    els.forEach(el => el.classList.add('visible'));
    return;
  }

  // Stagger siblings within grids
  document.querySelectorAll(
    '.workshops__grid, .stats__grid, .news-grid, .university-grid, .people-grid, .mvv-grid, .join-grid'
  ).forEach(grid => {
    grid.querySelectorAll('.reveal').forEach((el, i) => {
      el.style.transitionDelay = `${i * 75}ms`;
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -24px 0px'
  });

  els.forEach(el => observer.observe(el));
}

/* ── Counter animation ──────────────────────────── */
function initCounters(prefersReduced) {
  const counters = document.querySelectorAll('[data-count]');

  if (prefersReduced) {
    counters.forEach(el => {
      const isPlus = el.dataset.plus !== undefined;
      el.textContent = isPlus ? `${el.dataset.count}+` : el.dataset.count;
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        runCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

function runCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  const isPlus = el.dataset.plus !== undefined;
  const duration = 1600;
  const start = performance.now();

  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4);
    const value = Math.round(eased * target);
    el.textContent = isPlus ? `${value}+` : String(value);
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

/* ── Tabs ───────────────────────────────────────── */
function initTabs() {
  document.querySelectorAll('.tabs').forEach(tabGroup => {
    const btns = tabGroup.querySelectorAll('.tabs__btn');
    const panels = tabGroup.querySelectorAll('.tabs__panel');

    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;

        btns.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const panel = tabGroup.querySelector(`[data-panel="${target}"]`);
        if (panel) panel.classList.add('active');
      });
    });
  });
}

/* ── Project filter ─────────────────────────────── */
function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  if (!filterBtns.length) return;

  const cards = document.querySelectorAll('.project-card[data-category]');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.dataset.filter;

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      cards.forEach(card => {
        if (cat === 'all' || card.dataset.category === cat) {
          card.removeAttribute('hidden');
        } else {
          card.setAttribute('hidden', '');
        }
      });
    });
  });
}
