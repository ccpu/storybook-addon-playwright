import type { PlaywrightStoryData } from '../../../typings';
import { loadStoryData } from './load-story-data';

export interface StoryPlaywrightData {
  data: PlaywrightStoryData;
  storyId: string;
}

export async function getStoryPlaywrightData(fileName: string) {
  const playWrightData = (await loadStoryData(fileName, '*')) || {
    stories: {},
  };

  const storiesData = playWrightData.stories || {};

  const stories = Object.keys(storiesData);

  const storyData: StoryPlaywrightData[] = stories.map((story) => ({
    data: storiesData[story],
    storyId: story,
  }));

  return {
    playWrightData,
    storyData,
  };
}
