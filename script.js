"use strict";
/* 01. MOBIILIVALIKKO
 * aria-expanded kertoo avauspainikkeen tilan avustaville teknologioille.
 * is-open-luokka ohjaa CSS:n näyttötilaa. aria-controls on valmiiksi HTML:ssä.
 */
const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("#main-nav");
// Sama sulkufunktio palvelee ankkurivalintaa, Escapea ja siirtymistä desktop-leveyteen.
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
/* 02. EXPERIENCE-ACCORDION
 * toggle syntyy natiivin details-elementin avautuessa tai sulkeutuessa.
 * Suljemme muut rivit vain, kun nykyinen rivi avautuu.
 * Summaryn oletustoimintaa ei estetä eikä sen näppäimistökäyttöä rakenneta uudelleen.
 */
const experiences = [...document.querySelectorAll(".experience-item")];
experiences.forEach((item) =>
  item.addEventListener("toggle", () => {
    if (item.open)
      experiences.forEach((other) => {
        if (other !== item) other.open = false;
      });
  }),
);
/* 03. VIEW MORE / SHOW LESS
 * hidden poistaa lisärivin näkyvistä ja fokusjärjestyksestä.
 * Muutamme vain button-label-tekstisolmua, jotta SVG-nuoli säilyy.
 */
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
// Pieni riippumaton aputoiminto: footerin vuosiluku käyttäjän selaimen ajasta.
document.querySelector("#year").textContent = new Date().getFullYear();

/* 04. LIIKEASETUKSET JA HERO-PARALLAX
 * matchMedia kysyy selaimen mediaehdon ja ilmoittaa sen muutoksista.
 * Tarkka hover-osoitin sallii hiiriefektin; reduced motion ohittaa liikkeen.
 * Loppuluvut ja otsikko ovat aina HTML:ssä, joten sisältö ei riipu animaatiosta.
 */
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
const hero = document.querySelector('.hero');
const title = hero.querySelector('h1');
// Säilytetään vain viimeisin odottava piirtojakso; hiiritapahtumia voi saapua sitä useammin.
let motionFrame = 0;
// cancelAnimationFrame peruu vielä suorittamattoman päivityksen; CSS pehmentää palautuksen.
function resetHero() {
  cancelAnimationFrame(motionFrame);
  for (const property of ['--portrait-x', '--portrait-y', '--title-x', '--title-y']) {
    hero.style.setProperty(property, '0px');
  }
}
// Pointer Events kattaa eri osoittimet. Reagoimme vain hiireen, emme kosketuseleeseen.
hero.addEventListener('pointermove', event => {
  if (reducedMotion.matches || !finePointer.matches || event.pointerType !== 'mouse') return;
  // getBoundingClientRect antaa heron sijainnin ja koon suhteessa selainikkunaan.
  // Keskikohta muuttuu nollaksi, reunat arvoiksi -1 ja +1; min/max rajaa liikkeen.
  const bounds = hero.getBoundingClientRect();
  const x = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1));
  const y = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1));
  cancelAnimationFrame(motionFrame);
  // requestAnimationFrame ajoittaa transform-muuttujien muutoksen seuraavaan piirtojaksoon.
  // Kuva liikkuu 10 px ja otsikko 5 px vastakkaiseen suuntaan ilman top/left-layoutmuutoksia.
  motionFrame = requestAnimationFrame(() => {
    hero.style.setProperty('--portrait-x', `${x * 10}px`);
    hero.style.setProperty('--portrait-y', `${y * 10}px`);
    hero.style.setProperty('--title-x', `${x * -5}px`);
    hero.style.setProperty('--title-y', `${y * -5}px`);
  });
});
// Poistuminen tai osoitineleen peruminen palauttaa lähtötilan myös kesken odottavan päivityksen.
hero.addEventListener('pointerleave', resetHero);
hero.addEventListener('pointercancel', resetHero);
finePointer.addEventListener('change', resetHero);

/* 05. NUMEROLASKURIT
 * data-count sisältää tavoiteluvun. counted varmistaa yhden käynnistyksen.
 * performance.now antaa ajankohdan; kesto perustuu aikaan, ei näytön kuvataajuuteen.
 */
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
    // Eteneminen 0…1. Kuutiollinen ease-out hidastaa loppua kohti.
    const progress = Math.min(1, (now - start) / 1500);
    const eased = 1 - (1 - progress) ** 3;
    counters.forEach(counter => { counter.textContent = Math.round(Number(counter.dataset.count) * eased); });
    if (progress < 1) counterFrame = requestAnimationFrame(tick);
  }
  counterFrame = requestAnimationFrame(tick);
  // 06. HELLO-PALJASTUS: luokka käynnistää CSS:n clip-path-animaation.
  // Tekstisisältöä ei poisteta eikä otsikon vaatimaa tilaa muuteta.
  title.classList.add('hero-reveal');
}
// IntersectionObserver käynnistää laskurit, kun vähintään 15 % herosta näkyy.
// disconnect lopettaa tarkkailun ensimmäisen käynnistyksen jälkeen.
const heroObserver = new IntersectionObserver(entries => {
  if (entries.some(entry => entry.isIntersecting)) {
    animateCounters();
    heroObserver.disconnect();
  }
}, { threshold: 0.15 });
heroObserver.observe(hero);
/* 07. REDUCED MOTION AJON AIKANA
 * Myös kesken käytön vaihdettu asetus huomioidaan: perutaan liike,
 * asetetaan loppuluvut ja poistetaan paljastusluokka. CSS poistaa muut animaatiot.
 */
reducedMotion.addEventListener('change', () => {
  resetHero();
  if (reducedMotion.matches) {
    finishCounters();
    title.classList.remove('hero-reveal');
  }
});

/* 08. SHOWCASE-KARUSELLIN OHJAIMET
 * scrollWidth = koko vieritettävän sisällön leveys.
 * clientWidth = näkyvän sisäkehyksen leveys.
 * scrollLeft = kuinka pitkälle vasemmasta reunasta on vieritetty.
 * Niiden erotus on suurin sallittu vieritysmatka.
 */
const track = document.querySelector('#showcase-track');
const controls = document.querySelector('.showcase-controls');
const position = controls.querySelector('input');
const previous = controls.querySelector('.carousel-prev');
const next = controls.querySelector('.carousel-next');
let showcaseWheelEnabled = false;
let showcaseActivationTimer;
const showcaseObserver = new IntersectionObserver(([entry]) => {
  clearTimeout(showcaseActivationTimer);
  showcaseWheelEnabled = false;
  if (entry.isIntersecting) {
    showcaseActivationTimer = setTimeout(() => {
      showcaseWheelEnabled = true;
    }, 2000);
  }
});
showcaseObserver.observe(track.closest('.showcase'));
controls.hidden = false;
// Muunnetaan todellinen sijainti prosentiksi. Pieni 1 px toleranssi huomioi pyöristyksen reunoissa.
function syncCarousel() {
  const max = track.scrollWidth - track.clientWidth;
  position.value = max > 0 ? track.scrollLeft / max * 100 : 0;
  previous.disabled = track.scrollLeft <= 1;
  next.disabled = track.scrollLeft >= max - 1;
}
// Passiivinen kuuntelija vain lukee scroll-tilan; sen ei tarvitse estää oletustoimintoa.
track.addEventListener('scroll', syncCarousel, { passive: true });
// Range toimii hiirellä, kosketuksella ja näppäimistöllä; prosentti muunnetaan pikseleiksi.
position.addEventListener('input', () => {
  track.scrollTo({ left: Number(position.value) / 100 * (track.scrollWidth - track.clientWidth), behavior: 'instant' });
});
// Edellinen/seuraava siirtää yhden kortin ja sen jälkeisen välin verran.
function stepCarousel(direction) {
  const card = track.querySelector('.project');
  track.scrollBy({ left: direction * (card.getBoundingClientRect().width + parseFloat(getComputedStyle(track).gap)), behavior: reducedMotion.matches ? 'instant' : 'smooth' });
}
previous.addEventListener('click', () => stepCarousel(-1));
next.addEventListener('click', () => stepCarousel(1));
/* 09. HIIRIRULLAN MUUNTAMINEN VAAKALIIKKEEKSI
 * preventDefault on perusteltu vain, kun pystyrulla todella liikuttaa karusellia.
 * Reunoissa palaamme ennen estoa, jotta sivu saa jatkaa pystysuunnassa.
 * passive:false on tarpeen juuri preventDefault-kutsua varten;
 * kosketuspyyhkäisyä ei simuloida, vaan se jää natiiville overflow-alueelle.
 */
track.addEventListener('wheel', event => {
  // Säilytetään trackpadin vaakaliike, Shift-vieritys ja Ctrl-zoomaus selaimen omina eleinä.
  if (!showcaseWheelEnabled || event.ctrlKey || event.shiftKey || Math.abs(event.deltaX) >= Math.abs(event.deltaY) || !event.deltaY) return;
  const max = track.scrollWidth - track.clientWidth;
  const canScroll = event.deltaY > 0 ? track.scrollLeft < max - 1 : track.scrollLeft > 1;
  if (!canScroll) return;
  event.preventDefault();
  // deltaMode kertoo yksikön: 0 = pikselit, 1 = rivit, 2 = sivut. Riville käytetään 16 px arviota.
  const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? track.clientWidth : 1;
  // Välitön siirto välttää kilpailevat smooth-animaatiot. Snap palautetaan eleen tauottua.
  track.style.scrollSnapType = 'none';
  track.scrollTo({ left: Math.max(0, Math.min(max, track.scrollLeft + event.deltaY * unit)), behavior: 'instant' });
  clearTimeout(track.snapTimer);
  track.snapTimer = setTimeout(() => { track.style.removeProperty('scroll-snap-type'); }, 180);
}, { passive: false });
/* 10. KOONMUUTOKSET JA ALOITUSSIJAINTI
 * ResizeObserver pitää ohjainten tilan ajan tasalla kehyksen koon muuttuessa.
 * Aloitussiirto tehdään vasta seuraavassa piirtohetkessä, kun layout on laskettu.
 */
new ResizeObserver(syncCarousel).observe(track);
// Työpöytä alkaa keskimmäisestä kortista, mobiili ensimmäisestä ja näyttää seuraavan reunan.
requestAnimationFrame(() => {
  if (matchMedia('(min-width: 701px)').matches) {
    track.scrollTo({ left: (track.scrollWidth - track.clientWidth) / 2, behavior: 'instant' });
  }
  syncCarousel();
});
