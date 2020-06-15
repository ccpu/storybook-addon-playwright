import { loadStoryData } from './load-story-data';
import { PlaywrightData } from '../../../typings';

export interface StoryPlaywrightData {
  data: PlaywrightData;
  storyId: string;
}

export const getStoryPlaywrightData = async (fileName: string) => {
  const playWrightData = await loadStoryData(fileName, '*');

  const stories = Object.keys(playWrightData);

  const data: StoryPlaywrightData[] = stories.map((story) => {
    return {
      data: playWrightData[story],
      storyId: story,
    };
  });

  return data;
};
