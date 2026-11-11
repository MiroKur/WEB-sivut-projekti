"use strict";
const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("#main-nav");
function closeMenu() {
  toggle.setAttribute("aria-expanded", "false");
  nav.classList.remove("is-open");
}
toggle.addEventListener("click", () => {
  const open = toggle.getAttribute("aria-expanded") !== "true";
  toggle.setAttribute("aria-expanded", String(open));
  nav.classList.toggle("is-open", open);
});
nav.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});
document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    toggle.getAttribute("aria-expanded") === "true"
  ) {
    closeMenu();
    toggle.focus();
  }
});
window.matchMedia("(min-width: 701px)").addEventListener("change", closeMenu);
// Keep one experience expanded. Native details/summary also works without JS.
const experiences = [...document.querySelectorAll(".experience-item")];
experiences.forEach((item) =>
  item.addEventListener("toggle", () => {
    if (item.open)
      experiences.forEach((other) => {
        if (other !== item) other.open = false;
      });
  }),
);
const moreButton = document.querySelector("#more-button");
const moreProjects = document.querySelector("#more-projects");
moreButton.addEventListener("click", () => {
  const expanded = moreButton.getAttribute("aria-expanded") !== "true";
  moreButton.setAttribute("aria-expanded", String(expanded));
  moreProjects.hidden = !expanded;
  moreButton.querySelector(".button-label").textContent = expanded
    ? "Show Less"
    : "View More";
});
document.querySelector("#year").textContent = new Date().getFullYear();

// Motion preferences are observed live; the HTML always contains the final values.
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
const hero = document.querySelector('.hero');
const title = hero.querySelector('h1');
let motionFrame = 0;
function resetHero() {
  cancelAnimationFrame(motionFrame);
  for (const property of ['--portrait-x', '--portrait-y', '--title-x', '--title-y']) {
    hero.style.setProperty(property, '0px');
  }
}
hero.addEventListener('pointermove', event => {
  if (reducedMotion.matches || !finePointer.matches || event.pointerType !== 'mouse') return;
  const bounds = hero.getBoundingClientRect();
  const x = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1));
  const y = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1));
  cancelAnimationFrame(motionFrame);
  motionFrame = requestAnimationFrame(() => {
    hero.style.setProperty('--portrait-x', `${x * 10}px`);
    hero.style.setProperty('--portrait-y', `${y * 10}px`);
    hero.style.setProperty('--title-x', `${x * -5}px`);
    hero.style.setProperty('--title-y', `${y * -5}px`);
  });
});
hero.addEventListener('pointerleave', resetHero);
hero.addEventListener('pointercancel', resetHero);
finePointer.addEventListener('change', resetHero);

const counters = [...hero.querySelectorAll('[data-count]')];
let counterFrame = 0;
let counted = false;
function finishCounters() {
  cancelAnimationFrame(counterFrame);
  counters.forEach(counter => { counter.textContent = counter.dataset.count; });
}
function animateCounters() {
  if (counted) return;
  counted = true;
  if (reducedMotion.matches) return finishCounters();
  const start = performance.now();
  function tick(now) {
    const progress = Math.min(1, (now - start) / 1500);
    const eased = 1 - (1 - progress) ** 3;
    counters.forEach(counter => { counter.textContent = Math.round(Number(counter.dataset.count) * eased); });
    if (progress < 1) counterFrame = requestAnimationFrame(tick);
  }
  counterFrame = requestAnimationFrame(tick);
  title.classList.add('hero-reveal');
}
const heroObserver = new IntersectionObserver(entries => {
  if (entries.some(entry => entry.isIntersecting)) {
    animateCounters();
    heroObserver.disconnect();
  }
}, { threshold: 0.15 });
heroObserver.observe(hero);
reducedMotion.addEventListener('change', () => {
  resetHero();
  if (reducedMotion.matches) {
    finishCounters();
    title.classList.remove('hero-reveal');
  }
});

const track = document.querySelector('#showcase-track');
const controls = document.querySelector('.showcase-controls');
const position = controls.querySelector('input');
const previous = controls.querySelector('.carousel-prev');
const next = controls.querySelector('.carousel-next');
controls.hidden = false;
function syncCarousel() {
  const max = track.scrollWidth - track.clientWidth;
  position.value = max > 0 ? track.scrollLeft / max * 100 : 0;
  previous.disabled = track.scrollLeft <= 1;
  next.disabled = track.scrollLeft >= max - 1;
}
track.addEventListener('scroll', syncCarousel, { passive: true });
position.addEventListener('input', () => {
  track.scrollTo({ left: Number(position.value) / 100 * (track.scrollWidth - track.clientWidth), behavior: 'instant' });
});
function stepCarousel(direction) {
  const card = track.querySelector('.project');
  track.scrollBy({ left: direction * (card.getBoundingClientRect().width + parseFloat(getComputedStyle(track).gap)), behavior: reducedMotion.matches ? 'instant' : 'smooth' });
}
previous.addEventListener('click', () => stepCarousel(-1));
next.addEventListener('click', () => stepCarousel(1));
track.addEventListener('wheel', event => {
  // Preserve native horizontal trackpad movement and browser zoom gestures.
  if (event.ctrlKey || event.shiftKey || Math.abs(event.deltaX) >= Math.abs(event.deltaY) || !event.deltaY) return;
  const max = track.scrollWidth - track.clientWidth;
  const canScroll = event.deltaY > 0 ? track.scrollLeft < max - 1 : track.scrollLeft > 1;
  if (!canScroll) return;
  event.preventDefault();
  const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? track.clientWidth : 1;
  // Avoid competing smooth-scroll animations during a wheel gesture.
  track.style.scrollSnapType = 'none';
  track.scrollTo({ left: Math.max(0, Math.min(max, track.scrollLeft + event.deltaY * unit)), behavior: 'instant' });
  clearTimeout(track.snapTimer);
  track.snapTimer = setTimeout(() => { track.style.removeProperty('scroll-snap-type'); }, 180);
}, { passive: false });
new ResizeObserver(syncCarousel).observe(track);
// Start at the central project on desktop; mobile starts with the first card.
requestAnimationFrame(() => {
  if (matchMedia('(min-width: 701px)').matches) {
    track.scrollTo({ left: (track.scrollWidth - track.clientWidth) / 2, behavior: 'instant' });
  }
  syncCarousel();
});
