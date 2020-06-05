import { storyData } from '../../../__test_data__/story-data';

const useCurrentStoryData = jest.fn();

useCurrentStoryData.mockImplementation(() => storyData);

export { useCurrentStoryData };
