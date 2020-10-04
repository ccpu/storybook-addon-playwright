import equal from 'fast-deep-equal';
import { StoryOptions, PlaywrightData } from '../../../../typings';

export const getOptionsKey = (
  storyData: PlaywrightData,
  optionProp: keyof StoryOptions,
  // options?: BrowserContextOptions | ScreenshotOptions,
  options?: unknown,
) => {
  if (!options || !storyData[optionProp]) return undefined;

  const keys = Object.keys(storyData[optionProp]);

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const opt = storyData[optionProp][key];
    if (equal(opt, options)) {
      return key;
    }
  }
  return undefined;
};
