import type { PlaywrightData, ScreenshotData } from '../../../typings';

export function setStoryScreenshotOptions(
  storyData: PlaywrightData,
  screenshot: ScreenshotData,
) {
  if (storyData.browserOptions && screenshot.browserOptionsId) {
    screenshot.browserOptions = storyData.browserOptions[screenshot.browserOptionsId];
  }
  if (storyData.screenshotOptions && screenshot.screenshotOptionsId) {
    screenshot.screenshotOptions =
      storyData.screenshotOptions[screenshot.screenshotOptionsId];
  }
}
