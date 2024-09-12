const path = require('path');
const {chromium} = require('playwright');
const fs= require('fs');

// Or 'firefox' or 'webkit'.
const COOKIES_PATH = 'cookies.json';

(async ( )=>{
  try {
    await new Promise((r) => setTimeout(r, 1000));
    const browser = await chromium.connectOverCDP('http://localhost:9222');
    const defaultContext = browser.contexts()[0];
    const page = await defaultContext.newPage();
    await page.goto('https://statname.net/?playerid=776057501');
    await page.screenshot({path: 'fotod.png'})

   await page.close();
   await defaultContext.close();
   await browser.close();
  } catch (error) {
    console.error('Authentication failed:', error);
    throw error;
  }
})
();
 

/*(async () => {
  try {
  const browser = await chromium.launch();
  const context = await browser.newContext()
  const page = await context.newPage();
  const cookies = await JSON.parse(fs.readFileSync(COOKIES_PATH, 'utf-8'));
  console.log(cookies)
  await context.clearCookies()
  await context.addCookies(cookies);
  await page.goto('https://smarthand.pro/888/#gg_oliver');
  await page.screenshot({path: 'fotod.png'})

  // other actions...
  await browser.close();
} catch (error) {
  console.error('Authentication failed:', error);
  throw error;
}
})();*/


