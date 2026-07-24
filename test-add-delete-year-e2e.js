const puppeteer = require('playwright');
(async () => {
  const browser = await puppeteer.chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:8000/index.html');
  await page.waitForTimeout(1000);
  
  console.log("Checking UI for Studio Designer");
  // Assuming "Test Portco" is now in the list or "Studio Designer".
  // The backend might not be returning anything because we deleted the only portco or we didn't wait.
  const html = await page.evaluate(() => document.getElementById('active-portco-years-desc').innerHTML);
  console.log("Active Years Desc HTML:", html);
  
  await browser.close();
})();
