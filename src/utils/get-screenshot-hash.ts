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
  const vals = [
    props.actions,
    props.browserOptions,
    props.browserType,
    props.props,
    props.screenshotOptions,
    props.storyId,
  ].reduce((arr, opt) => {
    if (opt) {
      arr.push(opt);
    }
    return arr;
  }, [] as Array<unknown>);

  return sum(vals);
};
