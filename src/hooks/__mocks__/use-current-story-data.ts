import { StoryData } from '../../typings';

const storyData: Partial<StoryData> = {
  id: 'story-id',
  name: 'story-name',
  parameters: {
    fileName: 'story-file.ts',
    options: {},
  },
};

const useCurrentStoryData = jest.fn();

useCurrentStoryData.mockImplementation(() => storyData);

export { useCurrentStoryData };
