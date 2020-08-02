import { ScreenshotData, PlaywrightData } from '../../../../typings';

export const setStoryScreenshotOptions = (
  storyData: PlaywrightData,
  screenshot: ScreenshotData,
) => {
  if (storyData.browserOptions && screenshot.browserOptionsId) {
    screenshot.browserOptions =
      storyData.browserOptions[screenshot.browserOptionsId];
  }
  if (storyData.screenshotOptions && screenshot.screenshotOptionsId) {
    screenshot.screenshotOptions =
      storyData.screenshotOptions[screenshot.screenshotOptionsId];
  }
};
