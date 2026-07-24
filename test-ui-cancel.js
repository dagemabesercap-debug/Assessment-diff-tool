const puppeteer = require('playwright');
(async () => {
  const browser = await puppeteer.chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1200, height: 800 });
  
  // Set up console listener to see JS errors
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', error => console.log('BROWSER ERROR:', error));

  await page.goto('http://localhost:8000/index.html');
  await page.click('#btn-open-upload');
  await page.waitForTimeout(500);
  
  await page.fill('#input-company-name', 'test');
  await page.fill('.assessment-code', '123');
  await page.fill('.assessment-year', '2020');
  
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2000);
  
  console.log("Clicking cancel button");
  await page.click('#btn-cancel-upload');
  await page.waitForTimeout(2000);
  
  console.log("Checking if modal is hidden");
  const modalVisible = await page.evaluate(() => document.getElementById('upload-modal').style.display !== 'none');
  console.log("Modal visible?", modalVisible);
  
  await browser.close();
})();
