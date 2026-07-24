const puppeteer = require('playwright');
(async () => {
  const browser = await puppeteer.chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:8000/index.html');
  await page.waitForTimeout(500);
  
  // Fake the active portco so we can click Add Year
  await page.evaluate(() => {
    document.getElementById('detail-state').style.display = 'flex';
    window.activePortco = { name: "Studio Designer", years: ["2025"] };
  });
  
  await page.click('#btn-add-year');
  await page.waitForTimeout(500);
  
  const modalState = await page.evaluate(() => {
    return {
      display: document.getElementById('upload-modal').style.display,
      companyNameValue: document.getElementById('input-company-name').value,
      companyNameReadOnly: document.getElementById('input-company-name').readOnly
    };
  });
  
  console.log("Modal State:", modalState);
  await browser.close();
})();
