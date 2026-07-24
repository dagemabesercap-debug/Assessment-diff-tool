const puppeteer = require('playwright');
(async () => {
  const browser = await puppeteer.chromium.launch();
  const page = await browser.newPage();
  
  const controller = new AbortController();
  fetch('http://localhost:8090/api/portcos/grab', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ company_name: "test", assessments: [{code: "123", year: "2020"}] }),
    signal: controller.signal
  }).catch(e => console.log('Fetch aborted:', e.message));
  
  await new Promise(r => setTimeout(r, 2000));
  console.log('Aborting...');
  controller.abort();
  await new Promise(r => setTimeout(r, 2000));
  await browser.close();
})();
