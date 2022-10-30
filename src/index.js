import puppeteer from 'puppeteer';
import dotenv from 'dotenv';
import fs from 'fs';
import {
  login,
  calendarScreenshot,
} from './utils.js';
import generateIcs from './generateIcs.js';
import sendDiscordMessage from './discord.js';
import './console.js';

// check is the screenshot folder is created, if not create it
if (!fs.existsSync('generated')) {
  fs.mkdirSync('generated');
}

dotenv.config();

// Init browser
const browser = await puppeteer.launch({
  headless: true,
  executablePath: '/usr/bin/chromium',
  // slowMo: 250, // slow down by 250ms
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

// Init page
const page = await browser.newPage();

// Navigate to myges and login
await login(page);

// Define the xhrRequest catcher for getting the courses info;
let xhrCatcher = page.waitForResponse((response) => {
  return response.request().url() === 'https://myges.fr/student/planning-calendar' && response.request().method() === 'POST';
});

// Click on "Panning"
console.info('🔗 Navigating to Planning...');
const planningButton = await page.$('a[href="/student/planning-calendar"]');
planningButton.click();
await page.waitForNavigation();

// Wait for the xhr request for getting the courses to complete
const xhrResponse = await xhrCatcher;

// Parse the xhrResponse and parse it courses object
let xhrPayload = await xhrResponse.text();
const matchJsonRegex = /<update id="calendar:myschedule"><!\[CDATA\[(?<json>.+)\]{2}><\/update><update/;
const { events } = JSON.parse(xhrPayload.match(matchJsonRegex).groups.json);

// Wait the calendar to be loaded (the loading need to be finished)
await page.waitForSelector('.mg_loadingbar_container', { hidden: true });
console.info('✅ Planning loaded');

// Loop over events
if (events.length > 0) {
  // Create the ics file
  generateIcs(events);
  // Take a screenshot of the calendar
  await calendarScreenshot(page);
  // Send the discord message
  await sendDiscordMessage();
} else {
  console.warn('⚠️  No courses found');
}

await browser.close();
