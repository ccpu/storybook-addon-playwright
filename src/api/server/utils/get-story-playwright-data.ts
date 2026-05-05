import { loadStoryData } from './load-story-data';
import { PlaywrightStoryData } from '../../../typings';

export interface StoryPlaywrightData {
  data: PlaywrightStoryData;
  storyId: string;
}

export const getStoryPlaywrightData = async (fileName: string) => {
  const playWrightData = (await loadStoryData(fileName, '*')) || {
    stories: {},
  };

  const storiesData = playWrightData.stories || {};

  const stories = Object.keys(storiesData);

  const storyData: StoryPlaywrightData[] = stories.map((story) => {
    return {
      data: storiesData[story],
      storyId: story,
    };
  });

  return {
    playWrightData,
    storyData,
  };
};
