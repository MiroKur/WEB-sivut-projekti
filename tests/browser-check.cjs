// Playwright ja Chromium tarvitaan vain testausympäristössä, ei itse sivustolla.
// Käynnistä ensin projektin HTTP-palvelin.

// --- Riippuvuudet ja asetukset ---
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const sivustonOsoite = process.env.SITE_URL || 'http://127.0.0.1:5500';
const kuvakaappausKansio = process.env.SCREENSHOT_DIR || '/tmp/portfolio-check';
const selainPolku = process.env.CHROMIUM_PATH || '/usr/bin/chromium';
const testattavatLeveydet = [320, 360, 375, 390, 430, 768, 1024, 1440];
const kosketusLeveydet = [320, 360, 375, 390, 430];

(async () => {
  // --- Selaimen käynnistys ja virheiden kerääminen ---
  fs.mkdirSync(kuvakaappausKansio, { recursive: true });

  const selain = await chromium.launch({
    executablePath: selainPolku,
    args: ['--no-sandbox'],
  });

  try {
    const sivu = await selain.newPage();
    const virheet = [];

    sivu.on('pageerror', (virhe) => virheet.push(virhe.message));
    sivu.on('console', (viesti) => {
      if (viesti.type() === 'error') virheet.push(viesti.text());
    });
    sivu.on('requestfailed', (pyynto) => virheet.push(pyynto.url()));

    await sivu.emulateMedia({ reducedMotion: 'reduce' });

    // --- Responsiivisuus, sisältö ja näppäimistökäyttö ---
    for (const leveys of testattavatLeveydet) {
      await sivu.setViewportSize({ width: leveys, height: 900 });
      await sivu.goto(sivustonOsoite);

      await sivu.evaluate(async () => {
        for (const kuva of document.images) {
          kuva.loading = 'eager';
          await kuva.decode();
        }

        await Promise.all(
          [300, 400, 500, 600].map((paino) => document.fonts.load(`${paino} 14px Poppins`)),
        );
      });

      assert(
        await sivu.evaluate(() => document.documentElement.scrollWidth === innerWidth),
        'Sivun sisältö ei saa ylittää näkymän leveyttä',
      );
      assert(
        await sivu.evaluate(() =>
          [...document.images].every((kuva) => kuva.naturalWidth && kuva.hasAttribute('alt')),
        ),
        'Kaikki kuvat latautuvat ja niillä on vaihtoehtoinen teksti',
      );
      assert(
        await sivu.evaluate(() =>
          [...document.fonts].every((fontti) => fontti.status === 'loaded'),
        ),
        'Kaikki fontit latautuvat',
      );
      assert(
        await sivu.evaluate(() =>
          [...document.querySelectorAll('.round-arrow')].every((elementti) => {
            const rajaus = elementti.getBoundingClientRect();
            return Math.abs(rajaus.width - rajaus.height) < 1;
          }),
        ),
        'Nuolipainikkeiden muoto pysyy pyöreänä',
      );
      assert(
        await sivu.evaluate(() =>
          [...document.querySelectorAll('[data-count]')].every(
            (elementti) => elementti.textContent === elementti.dataset.count,
          ),
        ),
        'Reduced motion -tilassa laskurit näyttävät heti lopputuloksen',
      );
      assert(
        await sivu.evaluate(() =>
          [...document.images].every(
            (kuva) => kuva.hasAttribute('width') && kuva.hasAttribute('height'),
          ),
        ),
        'Kuville on määritelty mitat asettelun vakauttamiseksi',
      );

      const karuselli = sivu.locator('#showcase-track');
      assert(
        await karuselli.evaluate((elementti) => elementti.scrollWidth > elementti.clientWidth),
        'Karusellin pitää olla vaakasuunnassa vieritettävä',
      );

      await sivu.locator('.showcase-position').focus();
      await sivu.keyboard.press('End');
      await sivu.waitForTimeout(200);
      assert(
        await karuselli.evaluate(
          (elementti) =>
            Math.abs(elementti.scrollLeft - (elementti.scrollWidth - elementti.clientWidth)) < 2,
        ),
        'End-näppäin siirtää karusellin loppuun',
      );

      await sivu.keyboard.press('Home');
      await sivu.waitForTimeout(200);
      assert(
        await karuselli.evaluate((elementti) => elementti.scrollLeft < 2),
        'Home-näppäin siirtää karusellin alkuun',
      );

      await sivu.goto(sivustonOsoite);
      await sivu.keyboard.press('Tab');
      assert(
        await sivu
          .locator('.skip-link')
          .evaluate((elementti) => elementti === document.activeElement),
        'Ohituslinkki on ensimmäinen näppäimistöllä kohdistettava elementti',
      );
      await sivu.keyboard.press('Enter');

      if (leveys < 701) {
        assert(
          (await sivu.locator('.offer h2').innerText()).includes('Get a Free'),
          'Tarjousosion rivinvaihto ei katkaise sanoja mobiilissa',
        );
        assert(
          (await sivu.locator('.contact p:not(.eyebrow)').innerText()).includes(
            'collaborations. Let’s',
          ),
          'Yhteystietojen rivinvaihto ei katkaise sanoja mobiilissa',
        );

        const valikkopainike = sivu.locator('.menu-toggle');
        await valikkopainike.focus();
        await sivu.keyboard.press('Enter');
        assert.equal(await valikkopainike.getAttribute('aria-expanded'), 'true');

        await sivu.keyboard.press('Escape');
        assert.equal(await valikkopainike.getAttribute('aria-expanded'), 'false');
        assert(
          await valikkopainike.evaluate((elementti) => elementti === document.activeElement),
          'Valikon sulkeminen palauttaa kohdistuksen painikkeeseen',
        );

        await sivu.keyboard.press('Enter');
        await sivu.locator('#main-nav a').first().click();
        assert(sivu.url().endsWith('#about'), 'Valikkolinkki vie oikeaan osioon');
        assert.equal(await valikkopainike.getAttribute('aria-expanded'), 'false');
      }

      for (let indeksi = 0; indeksi < 2; indeksi++) {
        await sivu.locator('.experience-item summary').nth(indeksi).focus();
        await sivu.keyboard.press('Enter');
        await sivu.waitForTimeout(100);
        assert.equal(
          await sivu.locator('.experience-item[open]').count(),
          1,
          'Kerrallaan saa olla auki vain yksi työkokemusrivi',
        );
      }

      const lisaaPainike = sivu.locator('#more-button');
      await lisaaPainike.focus();
      assert.equal(
        await lisaaPainike.evaluate((elementti) => getComputedStyle(elementti).outlineStyle),
        'solid',
        'Lisää-painikkeen kohdistus näkyy',
      );
      await sivu.keyboard.press('Enter');
      assert(await sivu.locator('#more-projects').isVisible(), 'Lisäprojektit avautuvat');
      assert.equal(await lisaaPainike.getAttribute('aria-expanded'), 'true');

      await sivu.keyboard.press('Enter');
      assert(!(await sivu.locator('#more-projects').isVisible()), 'Lisäprojektit sulkeutuvat');
      assert.equal(await lisaaPainike.getAttribute('aria-expanded'), 'false');

      await sivu.locator('.article-body summary').first().focus();
      await sivu.keyboard.press('Enter');
      assert.notEqual(
        await sivu.locator('.article-body details').first().getAttribute('open'),
        null,
        'Artikkelin lisäsisältö avautuu näppäimistöllä',
      );
      await sivu.keyboard.press('Enter');

      const kapselinOtsikko = sivu.locator('.portfolio-capsule > span').last();
      const alkuperainenOtsikko = await kapselinOtsikko.textContent();
      await kapselinOtsikko.evaluate(
        (elementti) =>
          (elementti.textContent = 'Portfolio and selected multidisciplinary design projects'),
      );
      assert(
        await sivu
          .locator('.portfolio-capsule')
          .evaluate((elementti) => elementti.scrollWidth <= elementti.clientWidth + 2),
        'Pitkä portfolion otsikko mahtuu kapseliin',
      );
      await kapselinOtsikko.evaluate(
        (elementti, teksti) => (elementti.textContent = teksti),
        alkuperainenOtsikko,
      );

      assert(
        await sivu.locator('.offer-copy').evaluate((elementti) => {
          const sisalto = elementti.getBoundingClientRect();
          const osio = elementti.closest('.offer').getBoundingClientRect();
          return (
            sisalto.top >= osio.top && sisalto.bottom <= osio.bottom && sisalto.width <= osio.width
          );
        }),
        'Tarjousosion sisältö pysyy osionsa sisällä',
      );

      await sivu.evaluate(() => {
        document.activeElement.blur();
        window.scrollTo(0, 0);
      });
      await sivu.screenshot({
        path: path.join(kuvakaappausKansio, `page-${leveys}.png`),
        fullPage: true,
      });

      if ([390, 768, 1440].includes(leveys)) {
        for (const osio of ['home', 'about', 'experience', 'portfolio', 'blog']) {
          await sivu.locator(`#${osio}`).screenshot({
            path: path.join(kuvakaappausKansio, `${osio}-${leveys}.png`),
          });
        }
      }

      if ([390, 1440].includes(leveys)) {
        await sivu.locator('#showcase-track').evaluate((elementti) =>
          elementti.scrollTo({
            left: innerWidth > 700 ? (elementti.scrollWidth - elementti.clientWidth) / 2 : 0,
            behavior: 'instant',
          }),
        );
        await sivu.waitForTimeout(100);
        await sivu.locator('.showcase').screenshot({
          path: path.join(kuvakaappausKansio, `showcase-${leveys}.png`),
        });
        await sivu.locator('.offer').screenshot({
          path: path.join(kuvakaappausKansio, `offer-${leveys}.png`),
        });
      }

      console.log(`${leveys}px: PASS`);
    }

    // --- Liikeanimaatiot ja hiiren vierityksen toiminta ---
    assert.equal(
      await sivu.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior),
      'auto',
      'Reduced motion -tilassa sivun vieritys ei ole animoitu',
    );

    await sivu.setViewportSize({ width: 1440, height: 900 });
    await sivu.emulateMedia({ reducedMotion: 'no-preference' });
    await sivu.goto(sivustonOsoite);
    await sivu.waitForTimeout(100);

    assert(
      (await sivu.locator('[data-count="200"]').textContent()) !== '200',
      'Laskuri alkaa animoitua',
    );
    await sivu.waitForTimeout(1600);
    assert.equal(await sivu.locator('[data-count="200"]').textContent(), '200');
    assert.equal(await sivu.locator('[data-count="50"]').textContent(), '50');

    await sivu.mouse.move(1150, 350);
    await sivu.waitForTimeout(250);
    assert(
      await sivu
        .locator('.hero')
        .evaluate(
          (elementti) => parseFloat(elementti.style.getPropertyValue('--portrait-x')) !== 0,
        ),
      'Hero-kuva liikkuu osoittimen mukana',
    );

    await sivu.mouse.move(10, 10);
    await sivu.waitForTimeout(250);
    assert.equal(
      await sivu
        .locator('.hero')
        .evaluate((elementti) => elementti.style.getPropertyValue('--portrait-x')),
      '0px',
      'Hero-kuva palaa lähtökohtaansa osoittimen poistuessa',
    );

    await sivu.mouse.move(1150, 350);
    await sivu.emulateMedia({ reducedMotion: 'reduce' });
    await sivu.waitForTimeout(100);
    assert.equal(
      await sivu
        .locator('.hero')
        .evaluate((elementti) => elementti.style.getPropertyValue('--portrait-x')),
      '0px',
      'Reduced motion poistaa hero-kuvan liikkeen',
    );
    assert.equal(
      await sivu
        .locator('.hero h1')
        .evaluate((elementti) => getComputedStyle(elementti).animationName),
      'none',
      'Reduced motion poistaa otsikon animaation',
    );

    const karuselli = sivu.locator('#showcase-track');
    await karuselli.scrollIntoViewIfNeeded();
    await karuselli.evaluate((elementti) => {
      elementti.style.scrollSnapType = 'none';
      elementti.scrollTo({ left: 40, behavior: 'instant' });
    });
    await karuselli.hover();

    // Ensimmäisen kahden sekunnin aikana pystyrulla vierittää sivua, ei karusellia.
    const alkuSivuVieritys = await sivu.evaluate(() => scrollY);
    const alkuKaruselliVieritys = await karuselli.evaluate((elementti) => elementti.scrollLeft);
    await sivu.mouse.wheel(0, 120);
    await sivu.waitForTimeout(100);
    assert(
      await karuselli.evaluate(
        (elementti, alku) => Math.abs(elementti.scrollLeft - alku) < 2,
        alkuKaruselliVieritys,
      ),
      'Karuselli ei kaappaa pystyrullausta ennen viiveen päättymistä',
    );
    assert(
      (await sivu.evaluate(() => scrollY)) > alkuSivuVieritys,
      'Sivu vierii normaalisti karusellin viiveen aikana',
    );

    await sivu.waitForTimeout(2100);
    const ennenKarusellivieritysta = await karuselli.evaluate((elementti) => elementti.scrollLeft);
    await sivu.mouse.wheel(0, 120);
    await sivu.waitForTimeout(100);
    assert(
      (await karuselli.evaluate((elementti) => elementti.scrollLeft)) > ennenKarusellivieritysta,
      'Pystyrulla siirtää karusellia viiveen jälkeen',
    );

    await sivu.waitForTimeout(300);
    const ennenVaakarullausta = await karuselli.evaluate((elementti) => elementti.scrollLeft);
    await sivu.mouse.wheel(100, 0);
    await sivu.waitForTimeout(100);
    assert(
      (await karuselli.evaluate((elementti) => elementti.scrollLeft)) > ennenVaakarullausta,
      'Kosketuslevyn vaakarullaus toimii natiivisti',
    );

    await sivu.waitForTimeout(200);
    await karuselli.evaluate((elementti) =>
      elementti.scrollTo({ left: elementti.scrollWidth, behavior: 'instant' }),
    );
    await sivu.waitForTimeout(100);
    const sivunVieritysOikeassaReunassa = await sivu.evaluate(() => scrollY);
    await sivu.mouse.wheel(0, 200);
    await sivu.waitForTimeout(200);
    assert(
      (await sivu.evaluate(() => scrollY)) > sivunVieritysOikeassaReunassa,
      'Sivun pystyrullaus jatkuu karusellin oikeassa reunassa',
    );

    await karuselli.evaluate((elementti) =>
      elementti.scrollIntoView({ block: 'center', behavior: 'instant' }),
    );
    await karuselli.evaluate((elementti) => {
      elementti.style.scrollSnapType = 'none';
      elementti.scrollTo({ left: 0, behavior: 'instant' });
    });
    await karuselli.hover();
    await sivu.waitForTimeout(800);
    assert(
      await karuselli.evaluate((elementti) => elementti.scrollLeft < 2),
      'Karuselli on vasemmassa reunassa',
    );

    const sivunVieritysVasemmassaReunassa = await sivu.evaluate(() => scrollY);
    await karuselli.evaluate((elementti) => {
      window.peruutetutReunatapahtumat = [];
      elementti.addEventListener(
        'wheel',
        (tapahtuma) => {
          window.peruutetutReunatapahtumat.push(tapahtuma.defaultPrevented);
        },
        { passive: true },
      );
    });

    // Chromium voi jättää keinotekoisen siirron jälkeen vaakarullauksen hetkeksi päälle.
    for (
      let askel = 0;
      askel < 3 && (await sivu.evaluate(() => scrollY)) >= sivunVieritysVasemmassaReunassa;
      askel++
    ) {
      await sivu.mouse.wheel(0, -150);
      await sivu.waitForTimeout(250);
    }

    assert(
      await sivu.evaluate(() =>
        window.peruutetutReunatapahtumat.every((peruutettu) => !peruutettu),
      ),
      'Vasemman reunan rullaustapahtumia ei estetä',
    );
    assert(
      (await sivu.evaluate(() => scrollY)) < sivunVieritysVasemmassaReunassa,
      'Sivun pystyrullaus jatkuu karusellin vasemmassa reunassa',
    );

    await sivu.emulateMedia({ reducedMotion: 'no-preference' });
    await sivu.locator('.article-card').first().hover();
    await sivu.waitForTimeout(250);
    assert(
      await sivu
        .locator('.article-card')
        .first()
        .evaluate((elementti) => getComputedStyle(elementti).transform !== 'none'),
      'Artikkelikortti korostuu osoittimen ollessa sen päällä',
    );

    await sivu.locator('.hero').scrollIntoViewIfNeeded();
    assert.equal(
      await sivu.locator('[data-count="200"]').textContent(),
      '200',
      'Laskuri ei käynnisty uudelleen osioon palattaessa',
    );

    // --- Toiminta ilman JavaScriptiä ---
    const ilmanJavaScriptia = await selain.newContext({
      javaScriptEnabled: false,
      viewport: { width: 390, height: 900 },
    });
    const staattinenSivu = await ilmanJavaScriptia.newPage();

    await staattinenSivu.goto(sivustonOsoite);
    assert.equal(await staattinenSivu.locator('[data-count="200"]').textContent(), '200');
    assert(await staattinenSivu.locator('h1').isVisible(), 'Pääotsikko näkyy ilman JavaScriptiä');
    assert(
      await staattinenSivu
        .locator('.showcase-grid')
        .evaluate((elementti) => elementti.scrollWidth > elementti.clientWidth),
      'Showcasea voi vierittää ilman JavaScriptiä',
    );
    await staattinenSivu.locator('.article-body summary').first().click();
    assert.notEqual(
      await staattinenSivu.locator('.article-body details').first().getAttribute('open'),
      null,
      'Artikkelin lisäsisältö toimii ilman JavaScriptiä',
    );
    await ilmanJavaScriptia.close();

    // --- Kosketusnäytöt, mobiilivalikko ja natiivi pyyhkäisy ---
    for (const leveys of kosketusLeveydet) {
      const kosketuskonteksti = await selain.newContext({
        hasTouch: true,
        isMobile: true,
        viewport: { width: leveys, height: 844 },
      });
      const mobiilisivu = await kosketuskonteksti.newPage();

      mobiilisivu.on('pageerror', (virhe) => virheet.push(virhe.message));
      mobiilisivu.on('console', (viesti) => {
        if (viesti.type() === 'error') virheet.push(viesti.text());
      });

      await mobiilisivu.emulateMedia({ reducedMotion: 'reduce' });
      await mobiilisivu.goto(sivustonOsoite);

      assert.equal(
        await mobiilisivu
          .locator('.hero')
          .evaluate((elementti) =>
            getComputedStyle(elementti).getPropertyValue('--portrait-x').trim(),
          ),
        '',
        'Hero-kuvassa ei ole parallax-liikettä kosketusnäytöllä',
      );
      assert(
        await mobiilisivu.evaluate(() => document.documentElement.scrollWidth === innerWidth),
        'Sivun sisältö ei ylitä kosketusnäytön leveyttä',
      );
      assert(
        await mobiilisivu.locator('.hero-portrait').evaluate((elementti) => {
          const teksti = document.querySelector('.hero-copy').getBoundingClientRect();
          return elementti.getBoundingClientRect().top >= teksti.bottom;
        }),
        'Hero-kuva sijoittuu mobiilissa tekstin alle',
      );

      for (const valitsin of ['.brand', '.menu-toggle', '.header-cta']) {
        const rajaus = await mobiilisivu.locator(valitsin).boundingBox();
        assert(
          rajaus.width >= 44 && rajaus.height >= 44,
          'Mobiilin painikkeen kosketusalue on vähintään 44 × 44 pikseliä',
        );
      }

      await mobiilisivu.locator('.menu-toggle').tap();
      assert.equal(await mobiilisivu.locator('.menu-toggle').getAttribute('aria-expanded'), 'true');
      await mobiilisivu.locator('#main-nav a').first().tap();
      assert.equal(
        await mobiilisivu.locator('.menu-toggle').getAttribute('aria-expanded'),
        'false',
      );

      const karuselli = mobiilisivu.locator('#showcase-track');
      await karuselli.scrollIntoViewIfNeeded();
      const rajaus = await karuselli.boundingBox();
      const y = Math.max(20, Math.min(700, rajaus.y + 100));
      const debugYhteys = await kosketuskonteksti.newCDPSession(mobiilisivu);

      await debugYhteys.send('Input.dispatchTouchEvent', {
        type: 'touchStart',
        touchPoints: [{ x: leveys * 0.8, y }],
      });

      for (let askel = 1; askel <= 12; askel++) {
        await debugYhteys.send('Input.dispatchTouchEvent', {
          type: 'touchMove',
          touchPoints: [{ x: leveys * (0.8 - (0.6 * askel) / 12), y }],
        });
        await mobiilisivu.waitForTimeout(20);
      }

      await debugYhteys.send('Input.dispatchTouchEvent', {
        type: 'touchEnd',
        touchPoints: [],
      });
      await mobiilisivu.waitForTimeout(400);

      assert(
        await karuselli.evaluate((elementti) => elementti.scrollLeft > 30),
        'Natiivi kosketuspyyhkäisy siirtää karusellia',
      );
      assert(
        await mobiilisivu
          .locator('.showcase .project-caption')
          .evaluateAll((elementit) =>
            elementit.every((elementti) => elementti.scrollWidth <= elementti.clientWidth + 1),
          ),
        'Projektikorttien otsikot ja logot mahtuvat mobiilissa',
      );

      await mobiilisivu.locator('.experience-item summary').first().tap();
      await mobiilisivu.waitForFunction(
        () => document.querySelectorAll('.experience-item[open]').length === 1,
      );
      assert.equal(await mobiilisivu.locator('.experience-item[open]').count(), 1);
      assert(
        await mobiilisivu.locator('.experience-item').first().locator('.job').isVisible(),
        'Työrooli näkyy mobiilissa',
      );

      await mobiilisivu.locator('.article-body summary').first().tap();
      assert.notEqual(
        await mobiilisivu.locator('.article-body details').first().getAttribute('open'),
        null,
        'Artikkelin lisäsisältö avautuu kosketuksella',
      );
      assert.equal(await mobiilisivu.locator('[data-count="200"]').textContent(), '200');

      const kuvake = await mobiilisivu.request.get(
        new URL('/assets/logo.webp', mobiilisivu.url()).href,
      );
      assert.equal(kuvake.status(), 200, 'Sivuston kuvake latautuu');

      await kosketuskonteksti.close();
      console.log(`${leveys}px kosketus/pyyhkäisy: PASS`);
    }

    // --- Testin yhteenveto ---
    assert.deepEqual(virheet, [], 'Sivulla ei saa olla JavaScript-, konsoli- tai verkkovirheitä');
    console.log(
      'Fontit, kuvat, näppäimistö, valikko, accordion, projektit, liike, karuselli, kosketus ja konsoli: PASS',
    );
  } finally {
    await selain.close();
  }
})().catch((virhe) => {
  console.error(virhe);
  process.exitCode = 1;
});
