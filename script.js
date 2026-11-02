'use strict';
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');
function closeMenu() {
  toggle.setAttribute('aria-expanded', 'false');
  nav.classList.remove('is-open');
}
toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('is-open', open);
});
nav.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
    closeMenu(); toggle.focus();
  }
});
window.matchMedia('(min-width: 701px)').addEventListener('change', closeMenu);
// Keep one experience expanded. Native details/summary also works without JS.
const experiences = [...document.querySelectorAll('.experience-item')];
experiences.forEach(item => item.addEventListener('toggle', () => {
  if (item.open) experiences.forEach(other => { if (other !== item) other.open = false; });
}));
const moreButton = document.querySelector('#more-button');
const moreProjects = document.querySelector('#more-projects');
moreButton.addEventListener('click', () => {
  const expanded = moreButton.getAttribute('aria-expanded') !== 'true';
  moreButton.setAttribute('aria-expanded', String(expanded));
  moreProjects.hidden = !expanded;
  moreButton.innerHTML = `${expanded ? 'Show Less' : 'View More'} <span aria-hidden="true">↗</span>`;
});
document.querySelector('#year').textContent = new Date().getFullYear();
