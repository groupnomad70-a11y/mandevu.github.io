(() => {
  'use strict';
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Mobile menu */
  const menuBtn = $('#menuBtn'), navLinks = $('#navLinks');
  const setMenu = open => {
    navLinks.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.textContent = open ? 'Close ×' : 'Menu ☰';
    document.body.classList.toggle('menu-open', open);
  };
  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => setMenu(!navLinks.classList.contains('open')));
    $$('a', navLinks).forEach(a => a.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) { setMenu(false); menuBtn.focus(); }
    });
    window.matchMedia('(min-width: 741px)').addEventListener('change', e => { if (e.matches) setMenu(false); });
  }

  /* Header shadow once scrolled */
  const nav = $('.nav');
  const onScroll = () => nav && nav.classList.toggle('scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* Footer year */
  const year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());

  /* Reveal on scroll */
  const items = $$('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    }), { threshold: 0.12 });
    items.forEach(i => io.observe(i));
  } else items.forEach(i => i.classList.add('in'));

  /* Highlight the nav link for the section in view */
  const links = $$('a[href^="#"]', navLinks || document);
  const targets = links.map(a => $(a.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window && targets.length) {
    const spy = new IntersectionObserver(entries => entries.forEach(en => {
      if (!en.isIntersecting) return;
      links.forEach(a => a.setAttribute('aria-current', String(a.getAttribute('href') === '#' + en.target.id)));
    }), { rootMargin: '-45% 0px -50% 0px' });
    targets.forEach(t => spy.observe(t));
  }

  /* Load the Google map only when asked (faster page, no third-party request until then) */
  const mapBtn = $('#loadMap'), mapWrap = $('#mapWrap');
  if (mapBtn && mapWrap) {
    mapBtn.addEventListener('click', () => {
      const f = document.createElement('iframe');
      f.className = 'map';
      f.title = 'Map showing the Mandevu plant-sales point, Ngina Road, Nairobi';
      f.referrerPolicy = 'no-referrer-when-downgrade';
      f.src = mapWrap.dataset.src;
      mapWrap.replaceChildren(f);
    });
  }
})();
