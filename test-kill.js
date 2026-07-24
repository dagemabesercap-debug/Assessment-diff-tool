const puppeteer = require('playwright');
(async () => {
  const browser = await puppeteer.chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:8090/index.html');
  await page.evaluate(() => {
    window.controller = new AbortController();
    fetch('/api/portcos/grab', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ company_name: "test", assessments: [{code: "123", year: "2020"}] }),
      signal: window.controller.signal
    }).catch(() => {});
  });
  
  await new Promise(r => setTimeout(r, 2000));
  
  // Abort
  await page.evaluate(() => {
    window.controller.abort();
  });
  
  await new Promise(r => setTimeout(r, 2000));
  await browser.close();
})();
