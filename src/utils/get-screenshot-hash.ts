import sum from 'hash-sum';
import {
  StoryAction,
  ScreenshotProp,
  BrowserTypes,
  BrowserOptions,
  ScreenshotOptions,
} from '../typings';

interface ScreenshotHash {
  storyId: string;
  actions: StoryAction[];
  props: ScreenshotProp[];
  browserType: BrowserTypes;
  browserOptions: BrowserOptions;
  screenshotOptions: ScreenshotOptions;
}
export const getScreenshotHash: (options: ScreenshotHash) => string = (
  props,
) => {
  const {
    actions,
    browserType,
    browserOptions,
    screenshotOptions,
    storyId,
  } = props;

  return sum({
    actions,
    browserOptions,
    browserType,
    props,
    screenshotOptions,
    storyId,
  });
};
