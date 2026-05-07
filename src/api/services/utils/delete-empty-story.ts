import type { PlaywrightData } from '../../../typings';

import { getStoryData } from './get-story-data';

export function deleteEmptyStory(data: PlaywrightData, storyId: string) {
  const story = getStoryData(data, storyId);
  if (!story) return data;

  if (data.stories && !Object.keys(story).length) {
    delete data.stories[storyId];
  }

  return data;
}
