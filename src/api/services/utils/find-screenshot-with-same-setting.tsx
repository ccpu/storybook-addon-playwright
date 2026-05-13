/* eslint-disable @typescript-eslint/no-unused-vars */
import type { PlaywrightData, ScreenshotData } from '../../../typings';
import equal from 'fast-deep-equal';
import { getScreenshotArgs, getScreenshotGlobals } from '../../../utils';
import { getOptionsKey } from './get-options-key';

export function findScreenshotWithSameSetting(
  data: PlaywrightData,
  screenshots: ScreenshotData[],
  screenshot: ScreenshotData,
) {
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
  const screenshotArgs = getScreenshotArgs(screenshot);
  const screenshotGlobals = getScreenshotGlobals(screenshot);

  const removeActionId = (scrShot: ScreenshotData) => {
    const newAction =
      scrShot.actionSets && scrShot.actionSets.length > 0
        ? scrShot.actionSets.map((act) => {
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
      equal(getScreenshotArgs(sc), screenshotArgs) &&
      equal(getScreenshotGlobals(sc), screenshotGlobals)
    ) {
      return sc;
    }
  }
  return undefined;
}
