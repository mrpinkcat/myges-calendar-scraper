export const parseStyleText = (cssStyle) => {
  const styleObject = {};
  cssStyle = cssStyle.slice(0, cssStyle.length - 1); // Remove the last ';'
  cssStyle.split('; ').forEach((prop) => {
    const el = prop.split(': ');
    styleObject[el[0]] = el[1];
  });
  return styleObject;
}

export const getDayOfTheWeek = (position) => {
  if (position === '60px') return 0;
  if (position === '174px') return 1;
  if (position === '287px') return 2;
  if (position === '400px') return 4;
  if (position === '513px') return 5;
  if (position === '626px') return 6;
};

export const init = async (page) => {
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
