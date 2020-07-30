/* eslint-disable sort-keys-fix/sort-keys-fix */

import sum from 'hash-sum';
import {
  StoryAction,
  ScreenshotProp,
  BrowserTypes,
  BrowserContextOptions,
  ScreenshotOptions,
} from '../typings';

interface ScreenshotHash {
  storyId: string;
  actions: StoryAction[];
  props: ScreenshotProp[];
  browserType: BrowserTypes;
  browserOptions: BrowserContextOptions;
  screenshotOptions: ScreenshotOptions;
}
export const getScreenshotHash: (options: ScreenshotHash) => string = (
  props,
) => {
  //! keep order

  const newObj = {
    actions: props.actions,
    browserOptions: props.browserOptions,
    browserType: props.browserType,
    props: props.props,
    screenshotOptions: props.screenshotOptions,
    storyId: props.storyId,
  };

  const objWithValue = Object.keys(newObj).reduce((obj, k) => {
    if (newObj[k] !== undefined) {
      obj[k] = newObj[k];
    }
    return obj;
  }, {});

  return sum(objWithValue);
};
