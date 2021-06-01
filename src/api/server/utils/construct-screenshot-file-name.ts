import kebabCase from 'lodash/kebabCase';

interface Data {
  storyTitle: string;
  // named export function
  storyId: string;
  screenshotTitle: string;
  browser: string;
}

export const constructScreenshotFileName = (data: Data) => {
  const { screenshotTitle, storyId, storyTitle, browser } = data;

  return (
    kebabCase(
      storyTitle + ' ' + storyId + ' ' + ' ' + screenshotTitle + ' ' + browser,
    ) + '-snap.png'
  );
};
