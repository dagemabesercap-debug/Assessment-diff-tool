const puppeteer = require('playwright');
(async () => {
  const browser = await puppeteer.chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:8090/'); // NOTE: using 8090 to test backend directly
  await page.evaluate(async () => {
    window.controller = new AbortController();
    fetch('/api/portcos/grab', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ company_name: "test", assessments: [{code: "123", year: "2020"}] }),
      signal: window.controller.signal
    }).catch(e => console.log(e.message));
  });
  
  await new Promise(r => setTimeout(r, 2000));
  console.log("Checking for chromium processes...");
  await browser.close();
})();
