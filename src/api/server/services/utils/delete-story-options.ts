import { PlaywrightData, StoryOptions } from '../../../../typings';

export const deleteStoryOptions = (
  storyData: PlaywrightData,
  optionsProp: keyof StoryOptions,
  optionsId: string,
) => {
  const screenShotOptionId = `${optionsProp}Id`;

  if (!optionsId || !storyData[optionsProp]) return storyData;

  let usingOption = false;

  const storyKeys = Object.keys(storyData.stories);

  for (let i = 0; i < storyKeys.length; i++) {
    const story = storyData.stories[storyKeys[i]];
    if (
      story.screenshots &&
      story.screenshots.find((x) => x[screenShotOptionId] === optionsId)
    ) {
      usingOption = true;
      break;
    }
  }

  if (!usingOption && storyData[optionsProp][optionsId]) {
    delete storyData[optionsProp][optionsId];
  }

  if (!Object.keys(storyData[optionsProp]).length) {
    delete storyData[optionsProp];
  }

  return storyData;
};
