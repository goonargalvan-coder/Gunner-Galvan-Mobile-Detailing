/* Gunnar Galvan Mobile Detailing — main.js */

gsap.registerPlugin(ScrollTrigger);

/* --- Nav scroll --- */
const nav = document.querySelector('.nav');
const onScroll = () => nav?.classList.toggle('scrolled', window.scrollY > 50);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* --- Mobile nav --- */
const toggle    = document.querySelector('.nav-toggle');
const mobileNav = document.querySelector('.nav-mobile');

toggle?.addEventListener('click', () => {
  const open = toggle.classList.toggle('open');
  mobileNav.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

document.querySelectorAll('.nav-mobile .nav-link').forEach(l =>
  l.addEventListener('click', () => {
    toggle.classList.remove('open');
    mobileNav.classList.remove('open');
    toggle.setAttribute('aria-expanded', false);
    document.body.style.overflow = '';
  })
);

/* --- Active nav link --- */
const page = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link[data-page]').forEach(l => {
  if (l.dataset.page === page) l.classList.add('active');
});

/* --- Hero (index only) --- */
if (document.querySelector('.hero')) {
  /* Parallax */
  gsap.to('.hero-bg img', {
    y: '-15%', ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.5 }
  });

  /* Entrance — hero is always above fold so gsap.from is fine here */
  gsap.timeline({ defaults: { ease: 'expo.out' } })
    .from('.hero-badge',   { opacity: 0, y: 28, duration: 0.75 }, 0.2)
    .from('.hero h1',      { opacity: 0, y: 80, duration: 1.2  }, 0.35)
    .from('.hero-sub',     { opacity: 0, y: 52, duration: 1.0  }, 0.62)
    .from('.hero-actions', { opacity: 0, y: 36, duration: 0.9  }, 0.82)
    .from('.hero-stats',   { opacity: 0, y: 24, duration: 0.75 }, 1.02);
}

/* --- Page hero entrance (inner pages) --- */
if (document.querySelector('.page-hero')) {
  gsap.timeline({ defaults: { ease: 'expo.out' } })
    .from('.page-hero .label-tag', { opacity: 0, y: 20, duration: 0.65 }, 0.15)
    .from('.page-hero h1',         { opacity: 0, y: 56, duration: 1.0  }, 0.3)
    .from('.page-hero p',          { opacity: 0, y: 32, duration: 0.8  }, 0.52);
}

/* ============================================================
   SCROLL REVEAL
   Pattern: gsap.set() hides elements immediately, then gsap.to()
   fires on scroll — avoids immediateRender flicker from gsap.from()
   ============================================================ */

const reveal = (sel, initState = {}, toState = {}) =>
  gsap.utils.toArray(sel).forEach(el => {
    gsap.set(el, { opacity: 0, y: 64, ...initState });
    gsap.to(el, {
      opacity: 1, y: 0, x: 0, duration: 0.95, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 92%', once: true },
      ...toState
    });
  });

const batch = (sel, stagger = 0.13) => {
  gsap.set(sel, { opacity: 0, y: 64 });
  ScrollTrigger.batch(sel, {
    onEnter: els => gsap.to(els, {
      opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger
    }),
    start: 'top 92%', once: true
  });
};

document.addEventListener('DOMContentLoaded', () => {
  reveal('.fade-up');
  reveal('.fade-in', { y: 0 }, { duration: 1.1 });
  reveal('.slide-r', { y: 0, x: -64 });
  reveal('.slide-l', { y: 0, x:  64 });
  batch('.svc-card',    0.14);
  batch('.why-card',    0.12);
  batch('.step',        0.08);
  batch('.pricing-row', 0.06);

  ScrollTrigger.refresh(); // recalculate after layout settles
});

/* --- Form submit (contact page) --- */
const form = document.querySelector('.contact-form');

/* Anti-spam: stamp load time so we can reject instant submissions */
const tsField = document.getElementById('gotcha-ts');
if (tsField) tsField.value = Date.now();

form?.addEventListener('submit', e => {
  e.preventDefault();

  /* --- Anti-spam checks --- */
  const honeypot = form.querySelector('[name="website"]');
  if (honeypot && honeypot.value) return;            /* bot filled hidden field */

  const elapsed = Date.now() - Number(tsField?.value || 0);
  if (elapsed < 3000) return;                         /* submitted in < 3s = bot */

  const btn = form.querySelector('[type=submit]');
  btn.textContent = 'Sending…';
  btn.disabled = true;
  setTimeout(() => {
    form.hidden = true;
    document.getElementById('form-success').hidden = false;
  }, 1200);
});
