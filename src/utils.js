export const login = async (page) => {
  // Navigate to page
  console.log('🔗 Navigating to MyGES...');
  await page.goto('https://myges.fr/');
  const connectButton = await page.$('a[href="open-session"]');
  connectButton.click();
  await page.waitForNavigation();

  // Fill login form
  console.log('🔑 Login to MyGES...');
  await page.type('#username', process.env.USERNAME);
  await page.type('#password', process.env.PASSWORD);

  // Click on login button
  const loginButton = await page.$('input[name="submit"]');
  loginButton.click();
  await page.waitForNavigation();
  console.log('✅ Logged');
}

/**
 * Take a screenshot of the callendar and save it
 * @param {*} page Puppeteer Page instance
 */
export const calendarScreenshot = async (page) => {
  const table = await page.$('.fc-agenda');
  try {
    await table.screenshot({ path: './generated/table.png' });
    console.log('📸 Screenshot taken to `generated/table.png`');
  } catch (error) {
    throw new Error(error);
  }
};
