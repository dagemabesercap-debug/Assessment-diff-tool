const puppeteer = require('playwright');
(async () => {
  const browser = await puppeteer.chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1500, height: 1000 });
  await page.goto('http://localhost:8000/index.html');
  await page.click('#btn-open-upload');
  await page.waitForTimeout(500);
  
  await page.fill('#input-company-name', 'test');
  await page.fill('.assessment-code', '123');
  await page.fill('.assessment-year', '2020');
  
  // Submit first time
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2000);
  
  // Cancel
  await page.click('#btn-close-browser');
  await page.waitForTimeout(1000);
  
  // Submit second time
  await page.click('button[type="submit"]');
  await page.waitForTimeout(5000);
  
  await page.screenshot({ path: 'screenshot2.png', fullPage: true });
  await browser.close();
})();
