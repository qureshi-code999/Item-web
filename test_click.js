const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.toString()));

  await page.goto('http://localhost:8888/', { waitUntil: 'networkidle2' });
  console.log('Page loaded');
  
  // Click first category card
  const selector = '.cat-card-container';
  await page.waitForSelector(selector);
  console.log('Category cards found, clicking the first one...');
  await page.click(selector);
  
  // Wait a bit
  await new Promise(r => setTimeout(r, 1000));
  
  const content = await page.content();
  console.log('HTML length after click:', content.length);
  
  await browser.close();
})();