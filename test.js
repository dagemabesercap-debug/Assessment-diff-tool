const puppeteer = require('playwright');
(async () => {
  const browser = await puppeteer.chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1200, height: 800 });
  await page.goto('http://localhost:8000/index.html');
  await page.click('#btn-open-upload');
  await page.waitForTimeout(500);
  
  const box = await page.evaluate(() => {
    const card = document.getElementById('upload-modal-card');
    const browserContainer = document.getElementById('browser-view-container');
    
    browserContainer.style.display = 'flex';
    card.classList.add('elevated-z');
    
    const iframeWrapper = document.getElementById('browser-iframe').parentElement;
    
    return {
      card: card.getBoundingClientRect(),
      wrapper: iframeWrapper.getBoundingClientRect(),
      overlayScrollable: window.getComputedStyle(document.getElementById('upload-modal')).overflow
    };
  });
  console.log(JSON.stringify(box, null, 2));
  await browser.close();
})();
