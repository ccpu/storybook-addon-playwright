import { getStoryData } from '../../../__test_data__/story-data';

const useCurrentStoryData = jest.fn();

useCurrentStoryData.mockImplementation(() => getStoryData());

export { useCurrentStoryData };
