// Requires Playwright and Chromium in the development environment, not in the site.
// Start the repository's HTTP server before running this script.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const output = process.env.SCREENSHOT_DIR || '/tmp/portfolio-check';

(async () => {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
    args: ['--no-sandbox'],
  });
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => {
      if (message.type() === 'error') errors.push(message.text());
    });
    page.on('requestfailed', request => errors.push(request.url()));
    await page.emulateMedia({ reducedMotion: 'reduce' });
    for (const width of [320, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(process.env.SITE_URL || 'http://127.0.0.1:5500');
      await page.evaluate(async () => {
        for (const image of document.images) {
          image.loading = 'eager';
          await image.decode();
        }
        await Promise.all([300, 400, 500, 600].map(weight =>
          document.fonts.load(`${weight} 14px Poppins`)));
      });
      assert(await page.evaluate(() => document.documentElement.scrollWidth === innerWidth), 'page overflow');
      assert(await page.evaluate(() => [...document.images].every(image => image.naturalWidth && image.hasAttribute('alt'))), 'images');
      assert(await page.evaluate(() => [...document.fonts].every(font => font.status === 'loaded')), 'fonts');
      assert(await page.evaluate(() => [...document.querySelectorAll('.round-arrow')].every(element => {
        const rect = element.getBoundingClientRect();
        return Math.abs(rect.width - rect.height) < 1;
      })), 'circle geometry');
      assert(await page.evaluate(() => [...document.querySelectorAll('[data-count]')].every(el => el.textContent === el.dataset.count)), 'reduced motion final counters');
      assert(await page.evaluate(() => [...document.images].every(el => el.hasAttribute('width') && el.hasAttribute('height'))), 'intrinsic image dimensions');
      const track = page.locator('#showcase-track');
      assert(await track.evaluate(el => el.scrollWidth > el.clientWidth), 'carousel overflow at every viewport');
      await page.locator('.showcase-position').focus();
      await page.keyboard.press('End');
      await page.waitForTimeout(200);
      assert(await track.evaluate(el => Math.abs(el.scrollLeft - (el.scrollWidth - el.clientWidth)) < 2), 'carousel keyboard end');
      await page.keyboard.press('Home');
      await page.waitForTimeout(200);
      assert(await track.evaluate(el => el.scrollLeft < 2), 'carousel keyboard start');
      await page.goto(process.env.SITE_URL || 'http://127.0.0.1:5500');
      await page.keyboard.press('Tab');
      assert(await page.locator('.skip-link').evaluate(element => element === document.activeElement), 'first Tab');
      await page.keyboard.press('Enter');
      if (width < 701) {
        const menu = page.locator('.menu-toggle');
        await menu.focus();
        await page.keyboard.press('Enter');
        assert.equal(await menu.getAttribute('aria-expanded'), 'true');
        await page.keyboard.press('Escape');
        assert.equal(await menu.getAttribute('aria-expanded'), 'false');
        assert(await menu.evaluate(element => element === document.activeElement));
        await page.keyboard.press('Enter');
        await page.locator('#main-nav a').first().click();
        assert(page.url().endsWith('#about'));
        assert.equal(await menu.getAttribute('aria-expanded'), 'false');
      }
      for (let index = 0; index < 2; index++) {
        await page.locator('.experience-item summary').nth(index).focus();
        await page.keyboard.press('Enter');
        await page.waitForTimeout(100);
        assert.equal(await page.locator('.experience-item[open]').count(), 1);
      }
      const more = page.locator('#more-button');
      await more.focus();
      assert.equal(await more.evaluate(element => getComputedStyle(element).outlineStyle), 'solid');
      await page.keyboard.press('Enter');
      assert(await page.locator('#more-projects').isVisible());
      assert.equal(await more.getAttribute('aria-expanded'), 'true');
      await page.keyboard.press('Enter');
      assert(!(await page.locator('#more-projects').isVisible()));
      assert.equal(await more.getAttribute('aria-expanded'), 'false');
      await page.locator('.article-body summary').first().focus();
      await page.keyboard.press('Enter');
      assert.notEqual(await page.locator('.article-body details').first().getAttribute('open'), null);
      await page.keyboard.press('Enter');
      const label = page.locator('.portfolio-capsule > span').last();
      const original = await label.textContent();
      await label.evaluate(element => element.textContent = 'Portfolio and selected multidisciplinary design projects');
      assert(await page.locator('.portfolio-capsule').evaluate(element => element.scrollWidth <= element.clientWidth + 2));
      await label.evaluate((element, text) => element.textContent = text, original);
      assert(await page.locator('.offer-copy').evaluate(el => {
        const a = el.getBoundingClientRect();
        const b = el.closest('.offer').getBoundingClientRect();
        return a.top >= b.top && a.bottom <= b.bottom && a.width <= b.width;
      }), 'offer content fits');
      await page.evaluate(() => { document.activeElement.blur(); window.scrollTo(0, 0); });
      await page.screenshot({ path: path.join(output, `page-${width}.png`), fullPage: true });
      if ([390, 768, 1440].includes(width)) {
        for (const section of ['home', 'about', 'experience', 'portfolio', 'blog']) {
          await page.locator(`#${section}`).screenshot({ path: path.join(output, `${section}-${width}.png`) });
        }
      }
      if ([390, 1440].includes(width)) {
        await page.locator('#showcase-track').evaluate(el => el.scrollTo({ left: innerWidth > 700 ? (el.scrollWidth - el.clientWidth) / 2 : 0, behavior: 'instant' }));
        await page.waitForTimeout(100);
        await page.locator('.showcase').screenshot({ path: path.join(output, `showcase-${width}.png`) });
        await page.locator('.offer').screenshot({ path: path.join(output, `offer-${width}.png`) });
      }
      console.log(`${width}px: PASS`);
    }
    assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior), 'auto');
    // Exercise motion separately from the responsive reduced-motion pass.
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto(process.env.SITE_URL || 'http://127.0.0.1:5500');
    await page.waitForTimeout(100);
    assert(await page.locator('[data-count="200"]').textContent() !== '200', 'counter animates');
    await page.waitForTimeout(1600);
    assert.equal(await page.locator('[data-count="200"]').textContent(), '200');
    assert.equal(await page.locator('[data-count="50"]').textContent(), '50');
    await page.mouse.move(1150, 350);
    await page.waitForTimeout(250);
    assert(await page.locator('.hero').evaluate(el => parseFloat(el.style.getPropertyValue('--portrait-x')) !== 0), 'parallax moves');
    await page.mouse.move(10, 10);
    await page.waitForTimeout(250);
    assert.equal(await page.locator('.hero').evaluate(el => el.style.getPropertyValue('--portrait-x')), '0px');
    await page.mouse.move(1150, 350);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForTimeout(100);
    assert.equal(await page.locator('.hero').evaluate(el => el.style.getPropertyValue('--portrait-x')), '0px');
    assert.equal(await page.locator('.hero h1').evaluate(el => getComputedStyle(el).animationName), 'none');
    const track = page.locator('#showcase-track');
    await track.scrollIntoViewIfNeeded();
    await track.evaluate(el => { el.style.scrollSnapType = 'none'; el.scrollTo({ left: 40, behavior: 'instant' }); });
    await track.hover();
    const beforeWheel = await track.evaluate(el => el.scrollLeft);
    await page.mouse.wheel(0, 120);
    await page.waitForTimeout(80);
    assert(await track.evaluate(el => el.scrollLeft) > beforeWheel, 'vertical wheel moves carousel');
    await page.waitForTimeout(300);
    const beforeHorizontal = await track.evaluate(el => el.scrollLeft);
    await page.mouse.wheel(100, 0);
    await page.waitForTimeout(100);
    assert(await track.evaluate(el => el.scrollLeft) > beforeHorizontal, 'native horizontal wheel');
    await page.waitForTimeout(200);
    await track.evaluate(el => el.scrollTo({ left: el.scrollWidth, behavior: 'instant' }));
    await page.waitForTimeout(100);
    const beforeY = await page.evaluate(() => scrollY);
    await page.mouse.wheel(0, 200);
    await page.waitForTimeout(200);
    assert(await page.evaluate(() => scrollY) > beforeY, 'right edge releases page scroll');
    await track.evaluate(el => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
    await track.evaluate(el => { el.style.scrollSnapType = 'none'; el.scrollTo({ left: 0, behavior: 'instant' }); });
    await track.hover();
    await page.waitForTimeout(800);
    assert(await track.evaluate(el => el.scrollLeft < 2), 'at left boundary');
    const edgeY = await page.evaluate(() => scrollY);
    // Chromium can retain its native horizontal scroll latch for the first tick
    // after an artificial jump from the opposite edge. Boundary events must stay
    // uncancelled and the page must resume scrolling within this short gesture.
    await track.evaluate(el => {
      window.boundaryWheelCancelled = [];
      el.addEventListener('wheel', event => {
        window.boundaryWheelCancelled.push(event.defaultPrevented);
      }, { passive: true });
    });
    for (let tick = 0; tick < 3 && await page.evaluate(() => scrollY) >= edgeY; tick++) {
      await page.mouse.wheel(0, -150);
      await page.waitForTimeout(250);
    }
    assert(await page.evaluate(() => window.boundaryWheelCancelled.every(cancelled => !cancelled)), 'left boundary does not cancel native scrolling');
    assert(await page.evaluate(() => scrollY) < edgeY, 'left edge releases page scroll');
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.locator('.article-card').first().hover();
    await page.waitForTimeout(250);
    assert(await page.locator('.article-card').first().evaluate(el => getComputedStyle(el).transform !== 'none'), 'whole article hover');
    await page.locator('.hero').scrollIntoViewIfNeeded();
    assert.equal(await page.locator('[data-count="200"]').textContent(), '200', 'counter does not restart on re-entry');
    const noJS = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 900 } });
    const plain = await noJS.newPage();
    await plain.goto(process.env.SITE_URL || 'http://127.0.0.1:5500');
    assert.equal(await plain.locator('[data-count="200"]').textContent(), '200');
    assert(await plain.locator('h1').isVisible());
    assert(await plain.locator('.showcase-grid').evaluate(el => el.scrollWidth > el.clientWidth));
    await plain.locator('.article-body summary').first().click();
    assert.notEqual(await plain.locator('.article-body details').first().getAttribute('open'), null);
    await noJS.close();
    const touch = await browser.newContext({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } });
    const mobile = await touch.newPage();
    await mobile.goto(process.env.SITE_URL || 'http://127.0.0.1:5500');
    await mobile.mouse.move(250, 350);
    assert.equal(await mobile.locator('.hero').evaluate(el => getComputedStyle(el).getPropertyValue('--portrait-x').trim()), '');
    await mobile.locator('.menu-toggle').tap();
    assert.equal(await mobile.locator('.menu-toggle').getAttribute('aria-expanded'), 'true');
    await touch.close();
    assert.deepEqual(errors, []);
    console.log('Fonts, images, keyboard, menu, accordion, View More, capsule, motion, carousel, wheel boundaries and console: PASS');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
