import { PlaywrightData } from '../../../../typings';

export const getStoryData = (
  data: PlaywrightData,
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
