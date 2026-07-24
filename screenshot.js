const puppeteer = require('playwright');
(async () => {
  const browser = await puppeteer.chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('http://localhost:8000/index.html');
  await page.click('#btn-open-upload');
  await page.waitForTimeout(500);
  await page.fill('#input-company-name', 'test');
  await page.fill('.assessment-code', '123');
  await page.fill('.assessment-year', '2020');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(1000); // Wait for animations and elevated-z
  await page.screenshot({ path: 'screenshot.png', fullPage: true });
  await browser.close();
})();
