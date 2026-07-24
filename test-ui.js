const puppeteer = require('playwright');
(async () => {
  const browser = await puppeteer.chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:8000/index.html');
  await page.waitForTimeout(1000);
  
  const html = await page.evaluate(() => {
    return document.getElementById('portco-detail-panel').innerHTML;
  });
  console.log(html);
  
  await browser.close();
})();
