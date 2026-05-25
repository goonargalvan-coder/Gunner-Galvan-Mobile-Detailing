/* Gunnar Galvan Mobile Detailing — main.js */

gsap.registerPlugin(ScrollTrigger);

/* --- Nav scroll --- */
const nav = document.querySelector('.nav');
const onScroll = () => nav?.classList.toggle('scrolled', window.scrollY > 50);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* --- Mobile nav --- */
const toggle   = document.querySelector('.nav-toggle');
const mobileNav = document.querySelector('.nav-mobile');

toggle?.addEventListener('click', () => {
  const open = toggle.classList.toggle('open');
  mobileNav.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

document.querySelectorAll('.nav-mobile .nav-link').forEach(l =>
  l.addEventListener('click', () => {
    toggle.classList.remove('open');
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
  })
);

/* --- Active nav link --- */
const page = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link[data-page]').forEach(l => {
  if (l.dataset.page === page) l.classList.add('active');
});

/* --- Hero entrance (index only) --- */
if (document.querySelector('.hero')) {
  gsap.timeline({ defaults: { ease: 'power3.out' } })
    .from('.hero-badge',   { opacity: 0, y: 16, duration: 0.55 }, 0.2)
    .from('.hero h1',      { opacity: 0, y: 28, duration: 0.7  }, 0.4)
    .from('.hero-sub',     { opacity: 0, y: 20, duration: 0.6  }, 0.6)
    .from('.hero-actions', { opacity: 0, y: 16, duration: 0.55 }, 0.75)
    .from('.hero-stats',   { opacity: 0, y: 12, duration: 0.5  }, 0.9);
}

/* --- Page hero entrance (inner pages) --- */
if (document.querySelector('.page-hero')) {
  gsap.timeline({ defaults: { ease: 'power3.out' } })
    .from('.page-hero .label-tag', { opacity: 0, y: 12, duration: 0.5 }, 0.2)
    .from('.page-hero h1',         { opacity: 0, y: 22, duration: 0.6 }, 0.35)
    .from('.page-hero p',          { opacity: 0, y: 16, duration: 0.5 }, 0.5);
}

/* --- Scroll reveal helpers --- */
const reveal = (sel, fromProps = {}) =>
  gsap.utils.toArray(sel).forEach(el =>
    gsap.from(el, {
      opacity: 0, y: 28, duration: 0.65, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top bottom', once: true },
      ...fromProps
    })
  );

const batch = (sel, stagger = 0.1) =>
  ScrollTrigger.batch(sel, {
    onEnter: els => gsap.from(els, { opacity: 0, y: 28, duration: 0.6, ease: 'power2.out', stagger }),
    start: 'top bottom', once: true
  });

/* Run after DOM ready */
document.addEventListener('DOMContentLoaded', () => {
  reveal('.fade-up');
  reveal('.fade-in', { y: 0, duration: 0.8 });
  reveal('.slide-r', { y: 0, x: -28 });
  reveal('.slide-l', { y: 0, x: 28 });
  batch('.svc-card', 0.12);
  batch('.why-card', 0.1);
  batch('.step',     0.07);
  batch('.pricing-row', 0.06);
});

/* --- Form submit (contact page) --- */
const form = document.querySelector('.contact-form');
form?.addEventListener('submit', e => {
  e.preventDefault();
  const btn = form.querySelector('[type=submit]');
  btn.textContent = 'Sending…';
  btn.disabled = true;
  /* Wire up your backend / EmailJS / Formspree here */
  setTimeout(() => {
    btn.textContent = 'Message Sent!';
    btn.style.background = '#16a34a';
  }, 1200);
});
