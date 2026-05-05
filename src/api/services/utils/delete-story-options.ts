import { PlaywrightData, StoryOptions } from '../../../typings';

export const deleteStoryOptions = (
  storyData: PlaywrightData,
  optionsProp: keyof StoryOptions,
  optionsId?: string,
) => {
  const screenShotOptionId = `${optionsProp}Id`;

  const options = storyData[optionsProp];

  if (!optionsId || !options) return storyData;

  let usingOption = false;

  const stories = storyData.stories || {};

  const storyKeys = Object.keys(stories);

  for (let i = 0; i < storyKeys.length; i++) {
    const story = stories[storyKeys[i]];
    if (
      story.screenshots &&
      story.screenshots.find((x) => x[screenShotOptionId] === optionsId)
    ) {
      usingOption = true;
      break;
    }
  }

  if (!usingOption && options[optionsId]) {
    delete options[optionsId];
  }

  if (!Object.keys(options).length) {
    delete storyData[optionsProp];
  }

  return storyData;
};
