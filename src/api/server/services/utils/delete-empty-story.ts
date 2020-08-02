import { PlaywrightData } from '../../../../typings';

import { getStoryData } from './get-story-data';

export const deleteEmptyStory = (data: PlaywrightData, storyId: string) => {
  const story = getStoryData(data, storyId);
  if (!story) return data;
  if (!Object.keys(story).length) {
    delete data.stories[storyId];
  }
  return data;
};
