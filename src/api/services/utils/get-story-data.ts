import { PlaywrightData } from '../../../typings';

export const getStoryData = (
  data: PlaywrightData | undefined,
  storyId: string,
  create = false,
) => {
  if (!data) {
    return undefined;
  }

  if (!data.stories) {
    if (!create) {
      return undefined;
    }

    data.stories = {};
  }

  if (!create && !data.stories[storyId]) {
    return undefined;
  }

  if (!data.stories[storyId]) data.stories[storyId] = {};

  return data.stories[storyId];
};
