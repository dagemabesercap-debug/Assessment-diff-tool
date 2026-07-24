const puppeteer = require('playwright');
(async () => {
  const browser = await puppeteer.chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:8000/index.html');
  await page.waitForTimeout(1000);
  
  const hasAddYearBtn = await page.evaluate(() => {
    return document.getElementById('btn-add-year') !== null;
  });
  console.log("Has + Add Year button?", hasAddYearBtn);
  
  await browser.close();
})();
