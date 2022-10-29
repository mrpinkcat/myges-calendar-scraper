import exceptionsJson from './../data/exceptions.json' assert { type: "json" };

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

/**
 * Check if the course need to be ignored
 * @param {String} courseName The name of the course to check
 */
export const matchCourseException = (courseName) => {
  /**
   * All the course that need to be ignored
   * @type {String[]}
   */
  const { electiveCourseNames, ignored } = exceptionsJson;
  const exceptions = [].concat(ignored, electiveCourseNames);
  console.log('exceptions', exceptions)
  console.log('electiveCourseNames', electiveCourseNames)
  console.log('ignored', ignored)
  exceptions.forEach((exception) => {
    if (courseName.slice(0, 13).includes(exception.slice(0, 13))) {
      return true;
    }
  });
  return false;
};

/**
 * Remove non commom courses from the dom calendar voir avoiding the confusion
 * @param {*} page Puppeteer Page instance
 */
export const removeExeptionCoursesFromDom = async (page) => {
  console.log('🔍 Removing unwanted courses...');
  const events = await page.$$('.fc-event');
  events.forEach(async (event) => {
    // console.log(matchCourseException('Cours 1'));
    const eventTitle = await event.$('div.fc-event-title')
    await eventTitle.evaluate(async (el) => {
      const title = el.textContent;

      if (matchCourseException(title)) { // CONTEXXXXT
        console.log(`🔥 Removing course: ${title}`);
        await event.eval((el) => el.remove());
      }
    })
  });
};
