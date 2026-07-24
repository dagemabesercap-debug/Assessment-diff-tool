const puppeteer = require('playwright');
(async () => {
  const browser = await puppeteer.chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1200, height: 800 });
  await page.goto('http://localhost:8000/index.html');
  
  const cardBox = await page.evaluate(() => {
    const card = document.getElementById('upload-modal-card');
    const browserContainer = document.getElementById('browser-view-container');
    
    // Force state
    document.getElementById('upload-modal').style.display = 'block';
    card.classList.add('elevated-z');
    browserContainer.style.display = 'flex';
    
    // Increase height of wrapper to show the whole iframe vertically
    const iframeWrapper = browserContainer.querySelector('div[style*="position: relative"]');
    if (iframeWrapper) {
       iframeWrapper.style.height = '850px';
    }
    
    return {
      card: card.getBoundingClientRect(),
      wrapper: iframeWrapper.getBoundingClientRect()
    };
  });
  console.log(JSON.stringify(cardBox, null, 2));
  await browser.close();
})();
