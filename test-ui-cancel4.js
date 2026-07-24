const puppeteer = require('playwright');
(async () => {
  const browser = await puppeteer.chromium.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', error => console.log('BROWSER ERROR:', error));

  await page.goto('http://localhost:8090/index.html');
  await page.click('#btn-open-upload');
  
  await page.fill('#input-company-name', 'test');
  await page.fill('.assessment-code', '123');
  await page.fill('.assessment-year', '2020');
  
  console.log("Submitting...");
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2000);
  
  console.log("Clicking cancel button");
  await page.click('#btn-cancel-upload');
  await page.waitForTimeout(2000);
  
  await browser.close();
})();
