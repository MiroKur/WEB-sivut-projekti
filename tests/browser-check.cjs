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
      assert(await page.evaluate(() => {
        const frame = document.querySelector('.hero-portrait').getBoundingClientRect();
        const image = document.querySelector('.hero-portrait-image').getBoundingClientRect();
        return image.top + 51 / 1075 * image.height <= frame.top + 0.1;
      }), 'hero screenshot strip');
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
      await page.evaluate(() => { document.activeElement.blur(); window.scrollTo(0, 0); });
      await page.screenshot({ path: path.join(output, `page-${width}.png`), fullPage: true });
      if ([390, 768, 1440].includes(width)) {
        for (const section of ['home', 'about', 'experience', 'portfolio']) {
          await page.locator(`#${section}`).screenshot({ path: path.join(output, `${section}-${width}.png`) });
        }
      }
      console.log(`${width}px: PASS`);
    }
    assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior), 'auto');
    assert.deepEqual(errors, []);
    console.log('Fonts, images, keyboard, menu, accordion, View More, capsule, crop, reduced motion and console: PASS');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
