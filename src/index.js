import puppeteer from 'puppeteer';
import dotevn from 'dotenv';
import fs from 'fs';

// check is the screenshot folder is created, if not create it
if (!fs.existsSync('screenshots')) {
  fs.mkdirSync('screenshots');
}

dotevn.config();

console.log('Launching browser...');

// Init browser
const browser = await puppeteer.launch({
  // headless: false,
  // slowMo: 250, // slow down by 250ms
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

// Init page
const page = await browser.newPage();

// Navigate to page
await page.goto('https://myges.fr/');
const connectButton = await page.$('a[href="open-session"]');
connectButton.click();
await page.waitForNavigation();

// Fill login form
await page.type('#username', process.env.USERNAME);
await page.type('#password', process.env.PASSWORD);

// Click on login button
const loginButton = await page.$('input[name="submit"]');
loginButton.click();
await page.waitForNavigation();

// Click on "Panning"
const planningButton = await page.$('a[href="/student/planning-calendar"]');
planningButton.click();
await page.waitForNavigation();

// Wait the calendar to be loaded (the loading need to be finished)
await page.waitForSelector('.mg_loadingbar_container', { hidden: true });

// Take a screenshot
const table = await page.$('.fc-agenda');
await table.screenshot({ path: './screenshots/table.png' });
console.log('Screenshot taken to `screenshots/table.png`');

// Close browser
await browser.close();
