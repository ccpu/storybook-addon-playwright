import { loadStoryData } from './load-story-data';
import { PlaywrightStoryData } from '../../../typings';

export interface StoryPlaywrightData {
  data: PlaywrightStoryData;
  storyId: string;
}

export const getStoryPlaywrightData = async (fileName: string) => {
  const playWrightData = await loadStoryData(fileName, '*');

  const stories = Object.keys(playWrightData.stories);

  const storyData: StoryPlaywrightData[] = stories.map((story) => {
    return {
      data: playWrightData.stories[story],
      storyId: story,
    };
  });

  return {
    playWrightData,
    storyData,
  };
};
