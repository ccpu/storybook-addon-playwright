import {
  StoryPlaywrightData,
  BrowserContextOptions,
  ScreenshotOptions,
  StoryOptions,
} from '../../../../typings';
import equal from 'fast-deep-equal';
import { nanoid } from 'nanoid';

export const setStoryOptions = (
  storyData: StoryPlaywrightData,
  optionProp: keyof StoryOptions,
  options?: BrowserContextOptions | ScreenshotOptions,
) => {
  if (!options || !Object.keys(options).length) return undefined;

  if (!storyData[optionProp]) {
    storyData[optionProp] = {};
  }

  const keys = Object.keys(storyData[optionProp]);

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const options = storyData[optionProp][key];
    if (equal(options, options)) {
      return key;
    }
  }

  const id = nanoid();

  storyData[optionProp][id] = options;

  return id;
};
