import { StoryPlaywrightData } from '../../../../typings';

export const getStoryData = (
  data: StoryPlaywrightData,
  storyId: string,
  create = false,
) => {
  if (!create && (!data.stories || !data.stories[storyId])) {
    return undefined;
  }

  if (!data.stories) data.stories = {};
  if (!data.stories[storyId]) data.stories[storyId] = {};

  return data.stories[storyId];
};
