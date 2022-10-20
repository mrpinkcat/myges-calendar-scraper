import puppeteer from 'puppeteer';
import dotevn from 'dotenv';
import fs from 'fs';
import {
  parseStyleText,
  getDayOfTheWeek,
  init,
  calendarScreenshot,
} from './utils.js';
import generateIcs from './generateIcs.js';

// check is the screenshot folder is created, if not create it
if (!fs.existsSync('generated')) {
  fs.mkdirSync('generated');
}

dotevn.config();

// Init browser
const browser = await puppeteer.launch({
  headless: true,
  // slowMo: 250, // slow down by 250ms
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

// Init page
const page = await browser.newPage();

// Navigate to myges and login
await init(page);

// Click on "Panning"
console.log('🔗 Navigating to Planning...');
const planningButton = await page.$('a[href="/student/planning-calendar"]');
planningButton.click();
await page.waitForNavigation();

// Wait the calendar to be loaded (the loading need to be finished)
await page.waitForSelector('.mg_loadingbar_container', { hidden: true });
console.log('✅ Planning loaded');

await calendarScreenshot(page);

const daysOfTheWeek = [];

// Get the day of the week
for (let i = 0; i < 5; i++) {
  const day = await page.$eval(`.fc-col${i}.ui-widget-header`, (el) => el.innerText);
  daysOfTheWeek.push(day.match(/(\d{2}\/){2}\d{2}/g)[0]);
}

const events = await page.$$('.fc-event');

const eventsData = [];

// Loop over events
if (events.length > 0) {
  console.log(`♻️  Start of scraping ${events.length} courses`);
  for (let i = 0; i < events.length; i++) {
    const event = events[i];

    // Get the event position info
    let style = await event.evaluate((node) => node.getAttribute('style'));
    const styleObject = parseStyleText(style);
    const date = daysOfTheWeek[getDayOfTheWeek(styleObject.left)];

    // Get the event title & room
    const titleEl = await event.$('.fc-event-title');
    const eventText = await titleEl.evaluate((node) => node.innerText);
    const [title, room] = (eventText.split('\n'));

    // Get the event time range
    const rangeEl = await event.$('.fc-event-time');
    const rangeText = await rangeEl.evaluate((node) => node.innerText);
    const [start, end] = rangeText.split(' - ');

    // Push the event data to the eventsData array
    eventsData.push({
      date,
      title,
      room: (room !== '' ? room : null),
      start,
      end,
    });

    console.log('✉️  Course scraped:', {
      date,
      title,
      room: (room !== '' ? room : null),
      start,
      end,
    });
  }
} else {
  console.log('⚠️  No courses found');
}

generateIcs(eventsData);

await browser.close();
