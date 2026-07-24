const puppeteer = require('playwright');
(async () => {
  const browser = await puppeteer.chromium.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  
  await page.goto('http://localhost:8090/index.html');
  await page.evaluate(() => {
    window.controller = new AbortController();
    fetch('/api/portcos/grab', {
      method: 'POST',
      body: JSON.stringify({ company_name: "test", assessments: [{code: "123", year: "2020"}] }),
      signal: window.controller.signal
    }).catch(e => console.log("FETCH CAUGHT:", e.name));
  });
  
  await new Promise(r => setTimeout(r, 1000));
  await page.evaluate(() => {
    window.controller.abort();
  });
  
  await new Promise(r => setTimeout(r, 1000));
  await browser.close();
})();
