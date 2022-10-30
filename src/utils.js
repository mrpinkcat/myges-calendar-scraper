export const login = async (page) => {
  // Navigate to page
  console.info('🔗 Navigating to MyGES...');
  await page.goto('https://myges.fr/');
  const connectButton = await page.$('a[href="open-session"]');
  connectButton.click();
  await page.waitForNavigation();

  // Fill login form
  console.info('🔑 Login to MyGES...');
  await page.type('#username', process.env.USERNAME);
  await page.type('#password', process.env.PASSWORD);

  // Click on login button
  const loginButton = await page.$('input[name="submit"]');
  loginButton.click();
  await page.waitForNavigation();
  console.info('✅ Logged');
}

/**
 * Take a screenshot of the callendar and save it
 * @param {*} page Puppeteer Page instance
 */
export const calendarScreenshot = async (page) => {
  const table = await page.$('.fc-agenda');
  try {
    await table.screenshot({ path: './generated/table.png' });
    console.info('📸 Screenshot taken to `generated/table.png`');
  } catch (error) {
    console.error('❌ Something went wrong when taking the screenshot');
    console.info(error);
  }
};
