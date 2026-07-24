const puppeteer = require('playwright');
(async () => {
  const browser = await puppeteer.chromium.launch();
  const page = await browser.newPage();
  
  // Abort request after starting
  const controller = new AbortController();
  fetch('http://localhost:8090/api/portcos/grab', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ company_name: "test", assessments: [{code: "123", year: "2020"}] }),
    signal: controller.signal
  }).catch(() => {});
  
  await new Promise(r => setTimeout(r, 2000));
  controller.abort();
  await new Promise(r => setTimeout(r, 2000));
  
  // Second request
  fetch('http://localhost:8090/api/portcos/grab', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ company_name: "test", assessments: [{code: "456", year: "2021"}] })
  }).catch(() => {});
  
  await new Promise(r => setTimeout(r, 5000));
  await browser.close();
})();
