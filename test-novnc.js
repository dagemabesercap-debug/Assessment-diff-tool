const puppeteer = require('playwright');
(async () => {
  const browser = await puppeteer.chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:8000/index.html');
  await page.evaluate(() => {
    document.getElementById('browser-view-container').style.display = 'flex';
    const iframe = document.getElementById('browser-iframe');
    iframe.src = iframe.src + '&ts=' + Date.now();
  });
  await page.waitForTimeout(2000);
  
  // Check if iframe loaded
  const title = await page.frame({ url: /vnc_auto/ }).title();
  console.log("Iframe title:", title);
  await browser.close();
})();
