import {
  PlaywrightData,
  BrowserContextOptions,
  ScreenshotOptions,
  StoryOptions,
} from '../../../../typings';

import { nanoid } from 'nanoid';
import { getOptionsKey } from './get-options-key';

export const setStoryOptions = (
  storyData: PlaywrightData,
  optionProp: keyof StoryOptions,
  options?: BrowserContextOptions | ScreenshotOptions,
) => {
  if (!options || !Object.keys(options).length) return undefined;

  if (!storyData[optionProp]) {
    storyData[optionProp] = {};
  }

  const optionsKey = getOptionsKey(storyData, optionProp, options);

  if (optionsKey) {
    return optionsKey;
  }

  const id = nanoid();

  storyData[optionProp][id] = options;

  return id;
};
