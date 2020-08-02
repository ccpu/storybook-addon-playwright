/* eslint-disable @typescript-eslint/no-unused-vars */
import { ScreenshotData, PlaywrightData } from '../../../../typings';
import equal from 'fast-deep-equal';
import { getOptionsKey } from './get-options-key';

export const findScreenshotWithSameSetting = (
  data: PlaywrightData,
  screenshots: ScreenshotData[],
  screenshot: ScreenshotData,
) => {
  const browserOptionsId = getOptionsKey(
    data,
    'browserOptions',
    screenshot.browserOptions,
  );
  const screenshotOptionsId = getOptionsKey(
    data,
    'screenshotOptions',
    screenshot.screenshotOptions,
  );

  const removeActionId = (scrShot: ScreenshotData) => {
    const newAction =
      scrShot.actions && scrShot.actions.length > 0
        ? scrShot.actions.map((act) => {
            const { id, ...rest } = act;
            return rest;
          })
        : undefined;
    return newAction;
  };

  for (let i = 0; i < screenshots.length; i++) {
    const sc = screenshots[i];

    if (
      sc.browserOptionsId === browserOptionsId &&
      sc.screenshotOptionsId === screenshotOptionsId &&
      sc.browserType === screenshot.browserType &&
      equal(removeActionId(sc), removeActionId(screenshot)) &&
      equal(sc.props, screenshot.props)
    ) {
      return sc;
    }
  }
  return undefined;
};
